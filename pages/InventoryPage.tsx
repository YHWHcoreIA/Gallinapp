import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { InventoryItem, InventoryLog, Page, InventoryCategory, InventoryAction, Currency } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';
import InventoryItemForm from '../components/InventoryItemForm';
import InventoryLogForm from '../components/InventoryLogForm';


const InventoryItemCard: React.FC<{ item: InventoryItem; onEdit: () => void; onDelete: () => void; onLogAction: () => void; }> = ({ item, onEdit, onDelete, onLogAction }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-pf-green-dark">{item.name}</h3>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Editar ${item.name}`}><ICONS.Edit className="w-4 h-4"/></Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:bg-red-100" aria-label={`Eliminar ${item.name}`}><ICONS.Delete className="w-4 h-4"/></Button>
          </div>
        </div>
        <p className="text-sm text-pf-text-secondary">Categoría: <span className="font-medium">{item.category === InventoryCategory.Meat ? 'Carne' : 'Huevos'}</span></p>
        <p className="text-sm text-pf-text-secondary">Cantidad Actual: <span className="font-bold text-lg text-pf-brown-dark">{item.currentQuantity}</span> {item.unit}</p>
        <p className="text-xs text-gray-500">Cantidad Inicial: {item.initialQuantity} {item.unit}</p>
        <p className="text-xs text-gray-500">Añadido: {new Date(item.dateAdded + 'T00:00:00').toLocaleDateString()}</p>
        {item.category === InventoryCategory.Meat && item.birdType && <p className="text-xs text-gray-500">Tipo de Ave: {item.birdType}</p>}
        {item.category === InventoryCategory.Meat && item.processingDate && <p className="text-xs text-gray-500">Procesado: {new Date(item.processingDate + 'T00:00:00').toLocaleDateString()}</p>}
        {item.category === InventoryCategory.Eggs && item.eggSize && <p className="text-xs text-gray-500">Tamaño Huevo: {item.eggSize}</p>}
        {item.storageLocation && <p className="text-xs text-gray-500">Ubicación: {item.storageLocation}</p>}
        {item.notes && <p className="text-xs text-gray-500 mt-1 italic whitespace-pre-wrap">Notas: {item.notes}</p>}
      </div>
      <Button size="sm" onClick={onLogAction} className="mt-3 w-full" aria-label={`Registrar movimiento para ${item.name}`}>
        Registrar Movimiento
      </Button>
    </Card>
  );
};

const InventoryPage: React.FC = () => {
  const { inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, addInventoryLog, inventoryLogs } = useData();
  const [activeTab, setActiveTab] = useState<InventoryCategory>(InventoryCategory.Meat);
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [loggingForItem, setLoggingForItem] = useState<InventoryItem | undefined>(undefined);
  
  const [viewingLogsForItem, setViewingLogsForItem] = useState<InventoryItem | undefined>(undefined);


  const handleOpenItemModal = (category: InventoryCategory, item?: InventoryItem) => {
    setActiveTab(category); 
    setEditingItem(item);
    setIsItemModalOpen(true);
  };
  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItem(undefined);
  };

  const handleOpenLogModal = (item: InventoryItem) => {
    setLoggingForItem(item);
    setIsLogModalOpen(true);
  };
  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setLoggingForItem(undefined);
  };

  const handleOpenViewLogsModal = (item: InventoryItem) => {
    setViewingLogsForItem(item);
  };
  const handleCloseViewLogsModal = () => {
    setViewingLogsForItem(undefined);
  };


  const handleSubmitItem = (data: Omit<InventoryItem, 'id' | 'currentQuantity'> | InventoryItem) => {
    if ('id' in data) {
      updateInventoryItem(data as InventoryItem);
    } else {
      addInventoryItem(data as Omit<InventoryItem, 'id' | 'currentQuantity'>);
    }
    // handleCloseItemModal(); // Form calls onClose
  };

  const handleSubmitLog = (logData: Omit<InventoryLog, 'id'>) => {
    addInventoryLog(logData);
    // handleCloseLogModal(); // Form calls onClose
  };

  const handleDelete = (id: string) => {
    if(window.confirm('¿Seguro que quieres eliminar este item de inventario y todos sus registros de movimiento asociados? Esta acción es irreversible.')) {
        deleteInventoryItem(id);
    }
  }

  const filteredItems = inventoryItems.filter(item => item.category === activeTab).sort((a,b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  const itemSpecificLogs = viewingLogsForItem ? inventoryLogs.filter(log => log.inventoryItemId === viewingLogsForItem.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pf-text">{Page.Inventory}</h1>

      <div className="flex border-b border-gray-200">
        <button 
            className={`py-2 px-4 -mb-px font-medium text-sm sm:text-base ${activeTab === InventoryCategory.Meat ? 'border-b-2 border-pf-green text-pf-green' : 'text-pf-text-secondary hover:text-pf-green'}`}
            onClick={() => setActiveTab(InventoryCategory.Meat)}
            aria-pressed={activeTab === InventoryCategory.Meat}>
            Inventario de Carne
        </button>
        <button 
            className={`py-2 px-4 -mb-px font-medium text-sm sm:text-base ${activeTab === InventoryCategory.Eggs ? 'border-b-2 border-pf-green text-pf-green' : 'text-pf-text-secondary hover:text-pf-green'}`}
            onClick={() => setActiveTab(InventoryCategory.Eggs)}
            aria-pressed={activeTab === InventoryCategory.Eggs}>
            Inventario de Huevos
        </button>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleOpenItemModal(activeTab)} leftIcon={<ICONS.Plus className="w-5 h-5"/>} aria-label={`Añadir a inventario de ${activeTab === InventoryCategory.Meat ? 'Carne' : 'Huevos'}`}>
          Añadir a Inventario de {activeTab === InventoryCategory.Meat ? 'Carne' : 'Huevos'}
        </Button>
      </div>

      {filteredItems.length === 0 ? (
        <Card><p className="text-center py-8 text-pf-text-secondary">No hay items en el inventario de {activeTab === InventoryCategory.Meat ? 'carne' : 'huevos'}.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <InventoryItemCard 
                key={item.id} 
                item={item} 
                onEdit={() => handleOpenItemModal(item.category, item)}
                onDelete={() => handleDelete(item.id)}
                onLogAction={() => handleOpenLogModal(item)} 
            />
          ))}
        </div>
      )}

      {/* Item Modal (Add/Edit) */}
      <Modal isOpen={isItemModalOpen} onClose={handleCloseItemModal} title={editingItem ? `Editar Item: ${editingItem.name}` : `Añadir a Inventario de ${activeTab === InventoryCategory.Meat ? 'Carne' : 'Huevos'}`}>
        <InventoryItemForm 
            onSubmit={handleSubmitItem} 
            initialData={editingItem} 
            category={activeTab}
            onClose={handleCloseItemModal} 
        />
      </Modal>

      {/* Log Modal (Add Sale/Consumption etc) */}
      {loggingForItem && (
        <Modal isOpen={isLogModalOpen} onClose={handleCloseLogModal} title={`Registrar Movimiento para ${loggingForItem.name}`}>
            <InventoryLogForm
                onSubmit={handleSubmitLog}
                item={loggingForItem}
                onClose={handleCloseLogModal}
            />
        </Modal>
      )}

       {/* View Logs Modal */}
      {viewingLogsForItem && (
        <Modal isOpen={true} onClose={handleCloseViewLogsModal} title={`Historial de Movimientos: ${viewingLogsForItem.name}`}>
          {itemSpecificLogs.length === 0 ? (
            <p className="text-pf-text-secondary text-center py-4">No hay movimientos registrados para este item.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {itemSpecificLogs.map(log => (
                <li key={log.id} className="py-3">
                  <p className="font-medium text-pf-text">{new Date(log.date + 'T00:00:00').toLocaleDateString()} - <span className={`${log.action === InventoryAction.Addition ? 'text-green-600' : 'text-red-600'}`}>{log.action}</span></p>
                  <p className="text-sm text-pf-text-secondary">Cantidad: {log.action !== InventoryAction.Addition ? '-' : '+'}{log.quantityChanged} {viewingLogsForItem.unit}</p>
                  {log.action === InventoryAction.Sale && log.salePricePerUnit && log.saleCurrency && (
                    <p className="text-sm text-pf-text-secondary">Venta: {log.salePricePerUnit.toFixed(2)} {log.saleCurrency} /unidad</p>
                  )}
                  {log.notes && <p className="text-xs italic text-gray-500">Nota: {log.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}


    </div>
  );
};

export default InventoryPage;