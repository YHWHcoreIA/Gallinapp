import React, { useState, useCallback, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Chicken, BreedInfo, GroundingChunk, Page } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ChickenForm from '../components/ChickenForm';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';
import { getBreedInfo } from '../services/geminiService';
import BreedInfoSection from '../components/BreedInfoSection';

const ChickenCard: React.FC<{ chicken: Chicken; onEdit: () => void; onDelete: () => void; }> = ({ chicken, onEdit, onDelete }) => {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-pf-green-dark">{chicken.name}</h3>
          <p className="text-sm text-pf-text-secondary">{chicken.breed}</p>
          <p className="text-xs text-gray-500 mt-1">
            Adquirida: {new Date(chicken.acquisitionDate + 'T00:00:00').toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Edit ${chicken.name}`}>
            <ICONS.Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:bg-red-100" aria-label={`Delete ${chicken.name}`}>
            <ICONS.Delete className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ChickensPage: React.FC = () => {
  const { chickens, addChicken, updateChicken, deleteChicken } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChicken, setEditingChicken] = useState<Chicken | undefined>(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingChickenId, setDeletingChickenId] = useState<string | null>(null);

  const [formBreed, setFormBreed] = useState<string>(''); // For live breed updates from form

  const [breedInfo, setBreedInfo] = useState<BreedInfo | null>(null);
  const [breedInfoSources, setBreedInfoSources] = useState<GroundingChunk[] | null>(null);
  const [isFetchingBreedInfo, setIsFetchingBreedInfo] = useState(false);
  const [breedInfoError, setBreedInfoError] = useState<string | undefined>(undefined);

  const handleOpenModal = (chicken?: Chicken) => {
    setEditingChicken(chicken);
    setFormBreed(chicken?.breed || ''); // Initialize formBreed
    setBreedInfo(null);
    setBreedInfoError(undefined);
    setBreedInfoSources(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChicken(undefined);
    setFormBreed('');
    setBreedInfo(null);
    setBreedInfoError(undefined);
    setBreedInfoSources(null);
  };

  const handleSubmitChicken = (chickenData: Omit<Chicken, 'id'> | Chicken) => {
    if ('id' in chickenData) {
      updateChicken(chickenData as Chicken);
    } else {
      addChicken(chickenData);
    }
    handleCloseModal();
  };

  const handleDeleteRequest = (id: string) => {
      setDeletingChickenId(id);
      setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
      if (deletingChickenId) {
          deleteChicken(deletingChickenId);
          setDeletingChickenId(null);
          setIsConfirmModalOpen(false);
      }
  };

  const cancelDelete = () => {
      setDeletingChickenId(null);
      setIsConfirmModalOpen(false);
  };

  const fetchBreedInfoCallback = useCallback(async (breedNameToFetch: string) => {
    if (!breedNameToFetch.trim()) {
        setBreedInfoError("Por favor, introduce un nombre de raza.");
        setBreedInfo(null);
        setBreedInfoSources(null);
        return;
    }
    setIsFetchingBreedInfo(true);
    setBreedInfoError(undefined);
    setBreedInfo(null);
    setBreedInfoSources(null);

    const result = await getBreedInfo(breedNameToFetch);
    // Ensure modal is still open and fetching for the same breed to avoid race conditions if user types fast / closes modal
    if(isModalOpen && formBreed === breedNameToFetch) {
        if (result.info) {
            setBreedInfo(result.info);
            setBreedInfoSources(result.sources);
        } else {
            setBreedInfoError(result.error || "No se encontró información.");
        }
    }
    setIsFetchingBreedInfo(false);
  }, [isModalOpen, formBreed]); // Add dependencies

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pf-text">{Page.Chickens}</h1>
        <Button onClick={() => handleOpenModal()} leftIcon={<ICONS.Plus className="w-5 h-5"/>}>
          Añadir Gallina
        </Button>
      </div>

      {chickens.length === 0 ? (
        <Card>
          <p className="text-pf-text-secondary text-center py-8">
            No hay gallinas registradas todavía. ¡Añade tu primera gallina!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chickens.map((chicken) => (
            <ChickenCard
              key={chicken.id}
              chicken={chicken}
              onEdit={() => handleOpenModal(chicken)}
              onDelete={() => handleDeleteRequest(chicken.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingChicken ? 'Editar Gallina' : 'Añadir Nueva Gallina'}
      >
        <ChickenForm
          onSubmit={handleSubmitChicken}
          initialData={editingChicken}
          onBreedChange={setFormBreed} // Pass callback to update formBreed
        />
        { isModalOpen && ( // Only render if modal is open
            <BreedInfoSection
                breedName={formBreed} // Use live formBreed
                breedInfo={breedInfo}
                sources={breedInfoSources}
                isLoading={isFetchingBreedInfo && formBreed.length > 0} // Show loading only if actively fetching for current formBreed
                error={breedInfoError}
                onFetchBreedInfo={fetchBreedInfoCallback}
            />
        )}
      </Modal>
      <Modal
          isOpen={isConfirmModalOpen}
          onClose={cancelDelete}
          title="Confirmar Eliminación"
      >
          <div>
              <p>¿Estás seguro de que quieres eliminar esta gallina?</p>
              <div className="flex justify-end space-x-4 mt-4">
                  <Button variant="ghost" onClick={cancelDelete}>Cancelar</Button>
                  <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default ChickensPage;
