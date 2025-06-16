import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { FoodLog, Page } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FoodLogForm from '../components/FoodLogForm';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';

const FoodLogItem: React.FC<{ foodLog: FoodLog; onEdit: () => void; onDelete: () => void; }> = ({ foodLog, onEdit, onDelete }) => {
  return (
    <Card className="mb-4">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-lg font-semibold text-pf-green-dark">
                    {new Date(foodLog.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-2xl text-pf-brown-dark">{foodLog.quantityKg.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2})} kg</p>
                {foodLog.foodType && <p className="text-sm text-pf-text-secondary">Tipo: {foodLog.foodType}</p>}
            </div>
            <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Editar registro del ${foodLog.date}`}>
                    <ICONS.Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:bg-red-100" aria-label={`Eliminar registro del ${foodLog.date}`}>
                    <ICONS.Delete className="w-4 h-4" />
                </Button>
            </div>
        </div>
        {foodLog.notes && (
            <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs font-semibold text-pf-text-secondary uppercase">Notas:</p>
                <p className="text-sm text-pf-text whitespace-pre-wrap">{foodLog.notes}</p>
            </div>
        )}
    </Card>
  );
};

const FoodLogPage: React.FC = () => {
  const { foodLogs, addFoodLog, updateFoodLog, deleteFoodLog } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFoodLog, setEditingFoodLog] = useState<FoodLog | undefined>(undefined);

  const handleOpenModal = (foodLog?: FoodLog) => {
    setEditingFoodLog(foodLog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFoodLog(undefined);
  };

  const handleSubmitFoodLog = (foodLogData: Omit<FoodLog, 'id'> | FoodLog) => {
    if ('id' in foodLogData) {
      updateFoodLog(foodLogData as FoodLog);
    } else {
      addFoodLog(foodLogData as Omit<FoodLog, 'id'>);
    }
    handleCloseModal();
  };

  const handleDeleteFoodLog = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro de alimento?')) {
      deleteFoodLog(id);
    }
  };

  const sortedFoodLogs = [...foodLogs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pf-text">{Page.FoodLog}</h1>
        <Button onClick={() => handleOpenModal()} leftIcon={<ICONS.Plus className="w-5 h-5"/>}>
          Añadir Registro
        </Button>
      </div>

      {sortedFoodLogs.length === 0 ? (
        <Card>
          <p className="text-pf-text-secondary text-center py-8">
            No hay registros de alimento todavía. ¡Añade tu primer registro!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedFoodLogs.map((log) => (
            <FoodLogItem
              key={log.id}
              foodLog={log}
              onEdit={() => handleOpenModal(log)}
              onDelete={() => handleDeleteFoodLog(log.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFoodLog ? 'Editar Registro de Alimento' : 'Añadir Nuevo Registro de Alimento'}
      >
        <FoodLogForm 
          onSubmit={handleSubmitFoodLog} 
          initialData={editingFoodLog}
        />
      </Modal>
    </div>
  );
};

export default FoodLogPage;