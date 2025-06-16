import React, { useState, useEffect } from 'react';
import { FoodLog } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';

interface FoodLogFormProps {
  onSubmit: (foodLog: Omit<FoodLog, 'id'> | FoodLog) => void;
  initialData?: FoodLog;
}

const FoodLogForm: React.FC<FoodLogFormProps> = ({ onSubmit, initialData }) => {
  const [date, setDate] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [foodType, setFoodType] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ date?: string; quantityKg?: string }>({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setQuantityKg(initialData.quantityKg.toString());
      setFoodType(initialData.foodType || '');
      setNotes(initialData.notes || '');
    } else {
      setDate(today);
      setQuantityKg('');
      setFoodType('');
      setNotes('');
    }
  }, [initialData, today]);

  const validate = () => {
    const newErrors: { date?: string; quantityKg?: string } = {};
    if (!date) {
      newErrors.date = 'La fecha es obligatoria.';
    } else if (new Date(date) > new Date(today)) {
      newErrors.date = 'La fecha no puede ser futura.';
    }
    
    const numQuantity = parseFloat(quantityKg);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      newErrors.quantityKg = 'La cantidad debe ser un número positivo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const foodLogData = {
      date,
      quantityKg: parseFloat(quantityKg),
      foodType: foodType.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (initialData) {
      onSubmit({ ...initialData, ...foodLogData });
    } else {
      onSubmit(foodLogData as Omit<FoodLog, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Fecha"
        id="foodLogDate"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        max={today}
        required
      />
      <Input
        label="Cantidad de Alimento (kg)"
        id="foodLogQuantity"
        type="number"
        value={quantityKg}
        onChange={(e) => setQuantityKg(e.target.value)}
        error={errors.quantityKg}
        min="0.01"
        step="0.01"
        placeholder="Ej: 2.5"
        required
      />
      <Input
        label="Tipo de Alimento (Opcional)"
        id="foodLogType"
        type="text"
        value={foodType}
        onChange={(e) => setFoodType(e.target.value)}
        placeholder="Ej: Ponedora Premium, Maíz molido"
        maxLength={100}
      />
      <Input
        as="textarea"
        label="Notas (Opcional)"
        id="foodLogNotes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Ej: Mezclado con sobras de verdura"
        maxLength={200}
      />
      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Registro' : 'Añadir Registro de Alimento'}
      </Button>
    </form>
  );
};

export default FoodLogForm;