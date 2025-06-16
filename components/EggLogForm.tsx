
import React, { useState, useEffect } from 'react';
import { EggLog } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';

interface EggLogFormProps {
  onSubmit: (eggLog: Omit<EggLog, 'id'>) => void;
  defaultDate?: string; // YYYY-MM-DD
}

const EggLogForm: React.FC<EggLogFormProps> = ({ onSubmit, defaultDate }) => {
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDate(defaultDate || new Date().toISOString().split('T')[0]);
  }, [defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity < 0) {
      setError('La cantidad debe ser un número positivo.');
      return;
    }
    if (!date) {
      setError('La fecha es obligatoria.');
      return;
    }
     if (new Date(date) > new Date()) {
      setError('La fecha no puede ser futura.');
      return;
    }

    onSubmit({ date, quantity: numQuantity });
    setQuantity(''); // Reset quantity for next entry
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:space-x-3 md:items-end">
      <Input
        label="Fecha"
        id="eggDate"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        max={new Date().toISOString().split('T')[0]} // Cannot select future date
        className="md:flex-grow"
        required
      />
      <Input
        label="Cantidad de Huevos"
        id="eggQuantity"
        type="number"
        value={quantity}
        min="0"
        onChange={(e) => setQuantity(e.target.value)}
        className="md:w-40"
        required
      />
      <Button type="submit" className="w-full md:w-auto">
        Registrar Huevos
      </Button>
      {error && <p className="text-sm text-red-500 mt-1 md:mt-0 md:ml-3 col-span-full">{error}</p>}
    </form>
  );
};

export default EggLogForm;
