import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { IncubationBatch, Page } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';
import IncubationForm from '../components/IncubationForm'; 

const CountdownDisplay: React.FC<{ expectedHatchDateStr?: string; actualHatchDateStr?: string }> = ({ expectedHatchDateStr, actualHatchDateStr }) => {
  const [daysRemaining, setDaysRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (actualHatchDateStr) {
      setDaysRemaining("Eclosionado");
      return;
    }
    if (!expectedHatchDateStr) {
      setDaysRemaining(null);
      return;
    }

    const calculateRemaining = () => {
      const today = new Date();
      today.setHours(0,0,0,0); // Normalize today to start of day
      const expectedDate = new Date(expectedHatchDateStr + 'T00:00:00');
      expectedDate.setHours(0,0,0,0); // Normalize expectedDate

      if (expectedDate < today) {
        setDaysRemaining("Eclosión Esperada Pasada");
      } else if (expectedDate.getTime() === today.getTime()) {
        setDaysRemaining("¡Día de Eclosión!");
      } else {
        const diffTime = expectedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysRemaining(`${diffDays} día${diffDays !== 1 ? 's' : ''} restante${diffDays !== 1 ? 's' : ''}`);
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000 * 60 * 60); // Update roughly every hour
    return () => clearInterval(interval);

  }, [expectedHatchDateStr, actualHatchDateStr]);

  if (daysRemaining === null && !actualHatchDateStr) return null;
  
  let bgColor = "bg-gray-100 text-gray-700";
  if (daysRemaining === "¡Día de Eclosión!") bgColor = "bg-yellow-400 text-yellow-800";
  else if (daysRemaining === "Eclosionado") bgColor = "bg-green-100 text-green-700";
  else if (daysRemaining === "Eclosión Esperada Pasada") bgColor = "bg-red-100 text-red-700";
  else if (daysRemaining && parseInt(daysRemaining) <= 3) bgColor = "bg-orange-200 text-orange-800";


  return <p className={`text-sm font-semibold mt-2 px-2 py-1 rounded-md inline-block ${bgColor}`}>{daysRemaining}</p>;
};


const IncubationBatchCard: React.FC<{ batch: IncubationBatch; onEdit: () => void; onDelete: () => void; }> = ({ batch, onEdit, onDelete }) => {
  const actualHatchDate = batch.actualHatchDate ? new Date(batch.actualHatchDate + 'T00:00:00') : null;
  let hatchRate = null;
  if (batch.chicksHatched !== undefined && batch.eggsSet > 0) {
    hatchRate = (batch.chicksHatched / batch.eggsSet * 100).toFixed(1) + '%';
  }

  return (
    <Card>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-pf-green-dark">{batch.batchName}</h3>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Editar lote ${batch.batchName}`}>
            <ICONS.Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:bg-red-100" aria-label={`Eliminar lote ${batch.batchName}`}>
            <ICONS.Delete className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-pf-text-secondary">Raza: {batch.breed || 'No especificada'}</p>
      <p className="text-sm text-pf-text-secondary">Inicio: {new Date(batch.startDate + 'T00:00:00').toLocaleDateString()}</p>
      <p className="text-sm text-pf-text-secondary">Huevos Colocados: {batch.eggsSet}</p>
      
      <CountdownDisplay expectedHatchDateStr={batch.expectedHatchDate} actualHatchDateStr={batch.actualHatchDate} />

      {actualHatchDate && <p className="text-sm font-semibold mt-1">Eclosión Real: {actualHatchDate.toLocaleDateString()}</p>}
      {batch.chicksHatched !== undefined && batch.chicksHatched >= 0 && <p className="text-sm font-semibold">Pollitos Nacidos: {batch.chicksHatched}</p>}
      {hatchRate && <p className="text-sm font-bold text-pf-green">Tasa de Eclosión: {hatchRate}</p>}
      {batch.notes && <p className="text-xs text-gray-600 mt-2 italic whitespace-pre-wrap">Notas: {batch.notes}</p>}
      {batch.hasBeenRecordedInInventory && <p className="text-xs text-blue-600 mt-1">Pollitos registrados en inventario.</p>}
    </Card>
  );
};


const IncubationPage: React.FC = () => {
  const { incubationBatches, addIncubationBatch, updateIncubationBatch, deleteIncubationBatch } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<IncubationBatch | undefined>(undefined);

  const handleOpenModal = (batch?: IncubationBatch) => {
    setEditingBatch(batch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBatch(undefined);
  };

  const handleSubmit = (data: Omit<IncubationBatch, 'id' | 'expectedHatchDate' | 'hasBeenRecordedInInventory'> | IncubationBatch) => {
    if ('id' in data) {
      updateIncubationBatch(data as IncubationBatch);
    } else {
      addIncubationBatch(data as Omit<IncubationBatch, 'id' | 'expectedHatchDate' | 'hasBeenRecordedInInventory'>);
    }
    // handleCloseModal(); // Form now calls onClose
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este lote de incubación? Esto no afectará a los pollitos ya registrados en el inventario.')) {
      deleteIncubationBatch(id);
    }
  };
  
  const sortedBatches = [...incubationBatches].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pf-text">{Page.Incubation}</h1>
        <Button onClick={() => handleOpenModal()} leftIcon={<ICONS.Plus className="w-5 h-5"/>} aria-label="Añadir nuevo lote de incubación">
          Nuevo Lote de Incubación
        </Button>
      </div>

      {sortedBatches.length === 0 ? (
        <Card>
          <p className="text-pf-text-secondary text-center py-8">
            No hay lotes de incubación registrados.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBatches.map((batch) => (
            <IncubationBatchCard 
              key={batch.id} 
              batch={batch} 
              onEdit={() => handleOpenModal(batch)}
              onDelete={() => handleDelete(batch.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBatch ? 'Editar Lote de Incubación' : 'Nuevo Lote de Incubación'}
      >
        <IncubationForm 
            onSubmit={handleSubmit} 
            initialData={editingBatch}
            onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default IncubationPage;