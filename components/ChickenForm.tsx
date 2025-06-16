
import React, { useState, useEffect } from 'react';
import { Chicken } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';

interface ChickenFormProps {
  onSubmit: (chicken: Omit<Chicken, 'id'> | Chicken) => void;
  initialData?: Chicken;
  onBreedChange?: (breed: string) => void; // New callback
}

const ChickenForm: React.FC<ChickenFormProps> = ({ onSubmit, initialData, onBreedChange }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [errors, setErrors] = useState<{name?:string, breed?:string, acquisitionDate?:string}>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBreed(initialData.breed);
      setAcquisitionDate(initialData.acquisitionDate);
    } else {
      setName('');
      setBreed('');
      setAcquisitionDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

  useEffect(() => {
    if (onBreedChange) {
      onBreedChange(breed);
    }
  }, [breed, onBreedChange]);

  const validate = () => {
    const newErrors: {name?:string, breed?:string, acquisitionDate?:string} = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!breed.trim()) newErrors.breed = "La raza es obligatoria.";
    if (!acquisitionDate) newErrors.acquisitionDate = "La fecha es obligatoria.";
    else if (new Date(acquisitionDate) > new Date()) newErrors.acquisitionDate = "La fecha no puede ser futura.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const chickenData = { name, breed, acquisitionDate };
    if (initialData) {
      onSubmit({ ...initialData, ...chickenData });
    } else {
      onSubmit(chickenData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de la Gallina"
        id="chickenName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />
      <Input
        label="Raza"
        id="chickenBreed"
        type="text"
        value={breed}
        onChange={(e) => {
            setBreed(e.target.value);
            // if (onBreedChange) onBreedChange(e.target.value); // Already handled by useEffect on breed
        }}
        error={errors.breed}
        required
      />
      <Input
        label="Fecha de Adquisición/Nacimiento"
        id="acquisitionDate"
        type="date"
        value={acquisitionDate}
        onChange={(e) => setAcquisitionDate(e.target.value)}
        error={errors.acquisitionDate}
        max={new Date().toISOString().split('T')[0]} // Cannot select future date
        required
      />
      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Gallina' : 'Añadir Gallina'}
      </Button>
    </form>
  );
};

export default ChickenForm;