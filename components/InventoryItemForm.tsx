import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryCategory } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';

interface InventoryItemFormProps {
  onSubmit: (data: Omit<InventoryItem, 'id' | 'currentQuantity'> | InventoryItem) => void;
  initialData?: InventoryItem;
  category: InventoryCategory;
  onClose: () => void;
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({ onSubmit, initialData, category, onClose }) => {
  const [name, setName] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [unit, setUnit] = useState('');
  const [initialQuantity, setInitialQuantity] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [notes, setNotes] = useState('');
  // Meat specific
  const [birdType, setBirdType] = useState('');
  const [processingDate, setProcessingDate] = useState('');
  // Egg specific
  const [eggSize, setEggSize] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof InventoryItem | 'initialQuantityNumber', string>>>({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDateAdded(initialData.dateAdded);
      setUnit(initialData.unit);
      setInitialQuantity(initialData.initialQuantity.toString());
      setStorageLocation(initialData.storageLocation || '');
      setNotes(initialData.notes || '');
      if (category === InventoryCategory.Meat) {
        setBirdType(initialData.birdType || '');
        setProcessingDate(initialData.processingDate || '');
      }
      if (category === InventoryCategory.Eggs) {
        setEggSize(initialData.eggSize || '');
      }
    } else {
      setDateAdded(today);
      setUnit(category === InventoryCategory.Meat ? 'aves' : 'unidades'); // Default unit
    }
  }, [initialData, category, today]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InventoryItem | 'initialQuantityNumber', string>> = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!dateAdded) newErrors.dateAdded = "La fecha de adición es obligatoria.";
    else if (new Date(dateAdded) > new Date(today)) newErrors.dateAdded = "La fecha no puede ser futura.";
    
    if (!unit.trim()) newErrors.unit = "La unidad es obligatoria.";
    
    const numInitialQuantity = parseFloat(initialQuantity);
    if (isNaN(numInitialQuantity) || numInitialQuantity <= 0) {
      newErrors.initialQuantityNumber = "La cantidad inicial debe ser un número positivo.";
    }

    if (category === InventoryCategory.Meat && processingDate && new Date(processingDate) < new Date(dateAdded)) {
        newErrors.processingDate = "La fecha de procesamiento no puede ser anterior a la fecha de adición.";
    }
     if (category === InventoryCategory.Meat && processingDate && new Date(processingDate) > new Date(today)) {
        newErrors.processingDate = "La fecha de procesamiento no puede ser futura.";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const commonData = {
      name: name.trim(),
      category,
      dateAdded,
      unit: unit.trim(),
      initialQuantity: parseFloat(initialQuantity),
      storageLocation: storageLocation.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    let fullData: any = commonData;
    if (category === InventoryCategory.Meat) {
      fullData = { ...fullData, birdType: birdType.trim() || undefined, processingDate: processingDate || undefined };
    }
    if (category === InventoryCategory.Eggs) {
      fullData = { ...fullData, eggSize: eggSize.trim() || undefined };
    }
    
    if (initialData) {
      onSubmit({ ...initialData, ...fullData });
    } else {
      onSubmit(fullData as Omit<InventoryItem, 'id' | 'currentQuantity'>);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del Item/Lote"
        id="itemName"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        maxLength={100}
        required
      />
      <Input
        label="Fecha de Adición/Producción"
        id="itemDateAdded"
        type="date"
        value={dateAdded}
        onChange={(e) => setDateAdded(e.target.value)}
        error={errors.dateAdded}
        max={today}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
            label="Cantidad Inicial"
            id="itemInitialQuantity"
            type="number"
            value={initialQuantity}
            onChange={(e) => setInitialQuantity(e.target.value)}
            error={errors.initialQuantityNumber}
            min="0.01"
            step="any"
            required
        />
        <Input
            label="Unidad"
            id="itemUnit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            error={errors.unit}
            placeholder="kg, aves, docenas"
            maxLength={20}
            required
        />
      </div>

      {category === InventoryCategory.Meat && (
        <>
          <Input
            label="Tipo de Ave (Ej: Pollo, Gallina, Pollito)"
            id="itemBirdType"
            value={birdType}
            onChange={(e) => setBirdType(e.target.value)}
            error={errors.birdType}
            maxLength={50}
          />
          <Input
            label="Fecha de Procesamiento (Opcional)"
            id="itemProcessingDate"
            type="date"
            value={processingDate}
            onChange={(e) => setProcessingDate(e.target.value)}
            error={errors.processingDate}
            max={today}
          />
        </>
      )}

      {category === InventoryCategory.Eggs && (
        <Input
          label="Tamaño del Huevo (Ej: Grande, Mediano, Mixto)"
          id="itemEggSize"
          value={eggSize}
          onChange={(e) => setEggSize(e.target.value)}
          error={errors.eggSize}
          maxLength={30}
        />
      )}

      <Input
        label="Ubicación de Almacenamiento (Opcional)"
        id="itemStorageLocation"
        value={storageLocation}
        onChange={(e) => setStorageLocation(e.target.value)}
        maxLength={100}
      />
      <Input
        as="textarea"
        label="Notas (Opcional)"
        id="itemNotes"
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
          {initialData ? 'Actualizar Item' : 'Añadir Item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryItemForm;