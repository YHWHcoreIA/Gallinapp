import React, { useState, useEffect, useMemo } from 'react';
import { IncubationBatch } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';

interface IncubationFormProps {
  onSubmit: (data: Omit<IncubationBatch, 'id' | 'expectedHatchDate' | 'hasBeenRecordedInInventory'> | IncubationBatch) => void;
  initialData?: IncubationBatch;
  onClose: () => void;
}

const IncubationForm: React.FC<IncubationFormProps> = ({ onSubmit, initialData, onClose }) => {
  const [batchName, setBatchName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [eggsSet, setEggsSet] = useState('');
  const [breed, setBreed] = useState('');
  const [actualHatchDate, setActualHatchDate] = useState('');
  const [chicksHatched, setChicksHatched] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState<Partial<Record<keyof IncubationBatch | 'eggsSetNumber' | 'chicksHatchedNumber', string>>>({});

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialData) {
      setBatchName(initialData.batchName);
      setStartDate(initialData.startDate);
      setEggsSet(initialData.eggsSet.toString());
      setBreed(initialData.breed || '');
      setActualHatchDate(initialData.actualHatchDate || '');
      setChicksHatched(initialData.chicksHatched?.toString() || '');
      setNotes(initialData.notes || '');
    } else {
      setStartDate(today);
    }
  }, [initialData, today]);

  const expectedHatchDateDisplay = useMemo(() => {
    if (!startDate) return 'N/A';
    try {
      const start = new Date(startDate + 'T00:00:00');
      const expected = new Date(start);
      expected.setDate(start.getDate() + 22);
      return expected.toLocaleDateString();
    } catch (e) {
      return 'Fecha de inicio inválida';
    }
  }, [startDate]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof IncubationBatch | 'eggsSetNumber' | 'chicksHatchedNumber', string>> = {};
    if (!batchName.trim()) newErrors.batchName = "El nombre del lote es obligatorio.";
    if (!startDate) newErrors.startDate = "La fecha de inicio es obligatoria.";
    else if (new Date(startDate) > new Date(today) && !initialData) newErrors.startDate = "La fecha de inicio no puede ser futura.";

    const numEggsSet = parseInt(eggsSet, 10);
    if (isNaN(numEggsSet) || numEggsSet <= 0) newErrors.eggsSetNumber = "La cantidad de huevos debe ser un número positivo.";
    
    if (actualHatchDate && new Date(actualHatchDate) < new Date(startDate)) {
        newErrors.actualHatchDate = "La fecha de eclosión real no puede ser anterior a la fecha de inicio.";
    }
    if (actualHatchDate && new Date(actualHatchDate) > new Date(today)) {
        newErrors.actualHatchDate = "La fecha de eclosión real no puede ser futura.";
    }

    const numChicksHatched = parseInt(chicksHatched, 10);
    if (chicksHatched && (isNaN(numChicksHatched) || numChicksHatched < 0)) {
        newErrors.chicksHatchedNumber = "El número de pollitos nacidos debe ser un número no negativo.";
    } else if (chicksHatched && !isNaN(numChicksHatched) && numChicksHatched > numEggsSet) {
        newErrors.chicksHatchedNumber = "El número de pollitos nacidos no puede exceder el número de huevos colocados.";
    }
    if (chicksHatched && !actualHatchDate) {
        newErrors.actualHatchDate = "Debe registrar una fecha de eclosión real si registra pollitos nacidos.";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSubmit = {
      batchName: batchName.trim(),
      startDate,
      eggsSet: parseInt(eggsSet, 10),
      breed: breed.trim() || undefined,
      actualHatchDate: actualHatchDate || undefined,
      chicksHatched: chicksHatched ? parseInt(chicksHatched, 10) : undefined,
      notes: notes.trim() || undefined,
    };

    if (initialData) {
      onSubmit({ ...initialData, ...dataToSubmit });
    } else {
      onSubmit(dataToSubmit as Omit<IncubationBatch, 'id' | 'expectedHatchDate' | 'hasBeenRecordedInInventory'>);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del Lote"
        id="batchName"
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
        error={errors.batchName}
        maxLength={50}
        required
      />
      <Input
        label="Fecha de Inicio"
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        error={errors.startDate}
        max={initialData ? undefined : today} // Allow past dates for editing, but not future for new
        required
      />
      <div>
        <label className="block text-sm font-medium text-pf-text-secondary mb-1">Fecha Estimada de Eclosión (22 días)</label>
        <p className="p-2 bg-gray-100 rounded-md text-sm">{expectedHatchDateDisplay}</p>
      </div>
      <Input
        label="Cantidad de Huevos Colocados"
        id="eggsSet"
        type="number"
        value={eggsSet}
        onChange={(e) => setEggsSet(e.target.value)}
        error={errors.eggsSetNumber}
        min="1"
        required
      />
      <Input
        label="Raza (Opcional)"
        id="breed"
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
        error={errors.breed}
        maxLength={50}
      />
      <hr className="my-3"/>
      <h4 className="text-md font-semibold text-pf-text-secondary">Registro de Eclosión (Opcional)</h4>
       <Input
        label="Fecha de Eclosión Real"
        id="actualHatchDate"
        type="date"
        value={actualHatchDate}
        onChange={(e) => setActualHatchDate(e.target.value)}
        error={errors.actualHatchDate}
        max={today}
      />
      <Input
        label="Pollitos Nacidos"
        id="chicksHatched"
        type="number"
        value={chicksHatched}
        onChange={(e) => setChicksHatched(e.target.value)}
        error={errors.chicksHatchedNumber}
        min="0"
      />
      <Input
        as="textarea"
        label="Notas (Opcional)"
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        maxLength={200}
      />
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Actualizar Lote' : 'Crear Lote'}
        </Button>
      </div>
    </form>
  );
};

export default IncubationForm;