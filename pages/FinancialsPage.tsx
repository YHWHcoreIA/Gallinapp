import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { FinancialTransaction, Page, TransactionType, Currency } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import { ICONS, CURRENCY_DETAILS } from '../constants';
import FinancialTransactionForm from '../components/FinancialTransactionForm';


const FinancialTransactionCard: React.FC<{ transaction: FinancialTransaction; onEdit: () => void; onDelete: () => void; }> = ({ transaction, onEdit, onDelete }) => {
  const currencyDetail = CURRENCY_DETAILS[transaction.currency];
  const amountColor = transaction.transactionType === TransactionType.Income ? 'text-green-600' : 'text-red-600';
  const amountPrefix = transaction.transactionType === TransactionType.Income ? '+' : '-';

  return (
    <Card className="mb-3 hover:shadow-lg transition-shadow duration-150">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">{new Date(transaction.date + 'T00:00:00').toLocaleDateString()} - <span className="font-medium">{transaction.category}</span></p>
          <h4 className="text-md font-semibold text-pf-text mt-0.5">{transaction.description}</h4>
        </div>
        <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Editar transacción ${transaction.description}`}><ICONS.Edit className="w-4 h-4"/></Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:bg-red-100" aria-label={`Eliminar transacción ${transaction.description}`}><ICONS.Delete className="w-4 h-4"/></Button>
        </div>
      </div>
      <p className={`text-xl font-bold ${amountColor} text-right mt-1`}>
        {amountPrefix} {currencyDetail.symbol} {transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
      </p>
      {transaction.notes && <p className="text-xs text-gray-500 mt-1 italic whitespace-pre-wrap">Notas: {transaction.notes}</p>}
    </Card>
  );
};


const FinancialsPage: React.FC = () => {
  const { financialTransactions, addFinancialTransaction, updateFinancialTransaction, deleteFinancialTransaction } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | undefined>(undefined);

  const handleOpenModal = (transaction?: FinancialTransaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  const handleSubmit = (data: Omit<FinancialTransaction, 'id'> | FinancialTransaction) => {
    if ('id' in data) {
      updateFinancialTransaction(data as FinancialTransaction);
    } else {
      addFinancialTransaction(data as Omit<FinancialTransaction, 'id'>);
    }
    // handleCloseModal(); // Form calls onClose now
  };

  const handleDelete = (id: string) => {
    if(window.confirm('¿Seguro que quieres eliminar esta transacción financiera?')) {
        deleteFinancialTransaction(id);
    }
  }

  const totals = useMemo(() => {
    const summary: { [key in Currency]?: { income: number; expense: number; net: number } } = {};
    financialTransactions.forEach(t => {
      if (!summary[t.currency]) {
        summary[t.currency] = { income: 0, expense: 0, net: 0 };
      }
      if (t.transactionType === TransactionType.Income) {
        summary[t.currency]!.income += t.amount;
      } else {
        summary[t.currency]!.expense += t.amount;
      }
      summary[t.currency]!.net = summary[t.currency]!.income - summary[t.currency]!.expense;
    });
    return summary;
  }, [financialTransactions]);

  const sortedTransactions = [...financialTransactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pf-text">{Page.Financials}</h1>
        <Button onClick={() => handleOpenModal()} leftIcon={<ICONS.Plus className="w-5 h-5"/>} aria-label="Añadir nueva transacción financiera">
          Nueva Transacción
        </Button>
      </div>
      
      {Object.keys(totals).length > 0 && (
        <Card title="Resumen Financiero (por Moneda)">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(totals).map(([currencyCode, summary]) => (
              <div key={currencyCode} className="p-3 border rounded-lg border-pf-green-dark/20 bg-pf-green-light/30">
                <h4 className="font-semibold text-pf-green-dark text-lg">{CURRENCY_DETAILS[currencyCode as Currency].name} ({CURRENCY_DETAILS[currencyCode as Currency].symbol})</h4>
                <p className="text-sm text-green-700">Ingresos: {CURRENCY_DETAILS[currencyCode as Currency].symbol} {summary.income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p className="text-sm text-red-700">Gastos: {CURRENCY_DETAILS[currencyCode as Currency].symbol} {summary.expense.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p className={`text-md font-bold ${summary.net >= 0 ? 'text-pf-green-dark' : 'text-red-700'}`}>
                  Neto: {CURRENCY_DETAILS[currencyCode as Currency].symbol} {summary.net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}


      <Card title="Historial de Transacciones">
        {sortedTransactions.length === 0 ? (
          <p className="text-center py-8 text-pf-text-secondary">No hay transacciones registradas.</p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {sortedTransactions.map(transaction => (
              <FinancialTransactionCard 
                key={transaction.id} 
                transaction={transaction}
                onEdit={() => handleOpenModal(transaction)}
                onDelete={() => handleDelete(transaction.id)}
                 />
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? `Editar Transacción: ${editingTransaction.description.substring(0,30)}...` : 'Nueva Transacción Financiera'}
      >
          <FinancialTransactionForm 
            onSubmit={handleSubmit}
            initialData={editingTransaction}
            onClose={handleCloseModal}
          />
      </Modal>
    </div>
  );
};

export default FinancialsPage;