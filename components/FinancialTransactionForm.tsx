import React, { useState, useEffect } from 'react';
import { FinancialTransaction, TransactionType, Currency } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import { CURRENCY_DETAILS } from '../constants';

interface FinancialTransactionFormProps {
  onSubmit: (data: Omit<FinancialTransaction, 'id'> | FinancialTransaction) => void;
  initialData?: FinancialTransaction;
  onClose: () => void;
}

const FinancialTransactionForm: React.FC<FinancialTransactionFormProps> = ({ onSubmit, initialData, onClose }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.Expense);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof FinancialTransaction | 'amountNumber', string>>>({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setTransactionType(initialData.transactionType);
      setAmount(initialData.amount.toString());
      setCurrency(initialData.currency);
      setNotes(initialData.notes || '');
    } else {
      setDate(today);
    }
  }, [initialData, today]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FinancialTransaction | 'amountNumber', string>> = {};
    if (!date) newErrors.date = "La fecha es obligatoria.";
    else if (new Date(date) > new Date(today)) newErrors.date = "La fecha no puede ser futura.";
    
    if (!description.trim()) newErrors.description = "La descripción es obligatoria.";
    if (!category.trim()) newErrors.category = "La categoría es obligatoria.";
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amountNumber = "El monto debe ser un número positivo.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const transactionData = {
      date,
      description: description.trim(),
      category: category.trim(),
      transactionType,
      amount: parseFloat(amount),
      currency,
      notes: notes.trim() || undefined,
    };

    if (initialData) {
      onSubmit({ ...initialData, ...transactionData });
    } else {
      onSubmit(transactionData as Omit<FinancialTransaction, 'id'>);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Fecha de la Transacción"
        id="transactionDate"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        max={today}
        required
      />
      <Input
        label="Descripción"
        id="transactionDescription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        maxLength={150}
        required
      />
      <Input
        label="Categoría (Ej: Alimento, Venta Huevos, Medicinas)"
        id="transactionCategory"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        error={errors.category}
        maxLength={50}
        required
      />
      <div>
        <label htmlFor="transactionType" className="block text-sm font-medium text-pf-text-secondary mb-1">Tipo de Transacción</label>
        <select
          id="transactionType"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value as TransactionType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pf-green focus:border-pf-green bg-white"
        >
          <option value={TransactionType.Expense}>Gasto</option>
          <option value={TransactionType.Income}>Ingreso</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monto"
          id="transactionAmount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amountNumber}
          min="0.01"
          step="0.01"
          required
        />
        <div>
            <label htmlFor="transactionCurrency" className="block text-sm font-medium text-pf-text-secondary mb-1">Moneda</label>
            <select
                id="transactionCurrency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pf-green focus:border-pf-green bg-white"
            >
                {Object.values(Currency).map((curr) => (
                <option key={curr} value={curr}>
                    {CURRENCY_DETAILS[curr].name} ({CURRENCY_DETAILS[curr].symbol})
                </option>
                ))}
            </select>
        </div>
      </div>
      <Input
        as="textarea"
        label="Notas (Opcional)"
        id="transactionNotes"
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
          {initialData ? 'Actualizar Transacción' : 'Añadir Transacción'}
        </Button>
      </div>
    </form>
  );
};

export default FinancialTransactionForm;