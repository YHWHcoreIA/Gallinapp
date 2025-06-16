import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryLog, InventoryAction, Currency } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import { CURRENCY_DETAILS } from '../constants';

interface InventoryLogFormProps {
  onSubmit: (data: Omit<InventoryLog, 'id'>) => void;
  item: InventoryItem; // The item this log is for
  onClose: () => void;
}

const InventoryLogForm: React.FC<InventoryLogFormProps> = ({ onSubmit, item, onClose }) => {
  const [date, setDate] = useState('');
  const [action, setAction] = useState<InventoryAction>(InventoryAction.Sale);
  const [quantityChanged, setQuantityChanged] = useState('');
  const [salePricePerUnit, setSalePricePerUnit] = useState('');
  const [saleCurrency, setSaleCurrency] = useState<Currency>(Currency.USD);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof InventoryLog | 'quantityChangedNumber' | 'salePriceNumber', string>>>({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setDate(today);
  }, [today]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InventoryLog | 'quantityChangedNumber' | 'salePriceNumber', string>> = {};
    if (!date) newErrors.date = "La fecha es obligatoria.";
    else if (new Date(date) > new Date(today)) newErrors.date = "La fecha no puede ser futura.";
    else if (new Date(date) < new Date(item.dateAdded)) newErrors.date = `La fecha no puede ser anterior a la fecha de adición del item (${new Date(item.dateAdded + 'T00:00:00').toLocaleDateString()}).`;


    const numQuantityChanged = parseFloat(quantityChanged);
    if (isNaN(numQuantityChanged) || numQuantityChanged <= 0) {
      newErrors.quantityChangedNumber = "La cantidad debe ser un número positivo.";
    } else if (action !== InventoryAction.Addition && numQuantityChanged > item.currentQuantity) {
      newErrors.quantityChangedNumber = `No puede ${action.toLowerCase()} más de la cantidad disponible (${item.currentQuantity} ${item.unit}).`;
    }

    if (action === InventoryAction.Sale) {
      const numSalePrice = parseFloat(salePricePerUnit);
      if (isNaN(numSalePrice) || numSalePrice < 0) {
        newErrors.salePriceNumber = "El precio de venta debe ser un número no negativo.";
      }
      if (!saleCurrency) newErrors.saleCurrency = "Debe seleccionar una moneda para la venta.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const logData: Omit<InventoryLog, 'id'> = {
      inventoryItemId: item.id,
      date,
      action,
      quantityChanged: parseFloat(quantityChanged), // Always positive
      salePricePerUnit: action === InventoryAction.Sale ? parseFloat(salePricePerUnit) || 0 : undefined,
      saleCurrency: action === InventoryAction.Sale ? saleCurrency : undefined,
      notes: notes.trim() || undefined,
    };
    onSubmit(logData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-pf-text">Registrar Movimiento para: <span className="text-pf-green-dark">{item.name}</span></h3>
      <p className="text-sm text-pf-text-secondary">Disponible: <span className="font-semibold">{item.currentQuantity} {item.unit}</span></p>
      
      <Input
        label="Fecha del Movimiento"
        id="logDate"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        max={today}
        required
      />

      <div>
        <label htmlFor="logAction" className="block text-sm font-medium text-pf-text-secondary mb-1">Tipo de Acción</label>
        <select
          id="logAction"
          value={action}
          onChange={(e) => setAction(e.target.value as InventoryAction)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pf-green focus:border-pf-green bg-white"
        >
          {Object.values(InventoryAction).map((act) => (
            <option key={act} value={act}>{act}</option>
          ))}
        </select>
      </div>

      <Input
        label={`Cantidad (${item.unit})`}
        id="logQuantityChanged"
        type="number"
        value={quantityChanged}
        onChange={(e) => setQuantityChanged(e.target.value)}
        error={errors.quantityChangedNumber}
        min="0.01"
        step="any"
        required
      />

      {action === InventoryAction.Sale && (
        <>
          <Input
            label="Precio de Venta por Unidad"
            id="logSalePrice"
            type="number"
            value={salePricePerUnit}
            onChange={(e) => setSalePricePerUnit(e.target.value)}
            error={errors.salePriceNumber}
            min="0"
            step="0.01"
          />
          <div>
            <label htmlFor="logSaleCurrency" className="block text-sm font-medium text-pf-text-secondary mb-1">Moneda de Venta</label>
            <select
              id="logSaleCurrency"
              value={saleCurrency}
              onChange={(e) => setSaleCurrency(e.target.value as Currency)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pf-green focus:border-pf-green bg-white"
            >
              {Object.values(Currency).map((curr) => (
                <option key={curr} value={curr}>
                  {CURRENCY_DETAILS[curr].name} ({CURRENCY_DETAILS[curr].symbol})
                </option>
              ))}
            </select>
            {errors.saleCurrency && <p className="mt-1 text-sm text-red-600">{errors.saleCurrency}</p>}
          </div>
        </>
      )}

      <Input
        as="textarea"
        label="Notas (Opcional)"
        id="logNotes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        maxLength={200}
      />

      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Registrar Movimiento
        </Button>
      </div>
    </form>
  );
};

export default InventoryLogForm;