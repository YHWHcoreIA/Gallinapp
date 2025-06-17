import React, { createContext, useContext, ReactNode } from 'react';
import {
  Chicken, EggLog, Task, FoodLog,
  IncubationBatch, FinancialTransaction, InventoryItem, InventoryLog, InventoryAction, InventoryCategory, TransactionType
} from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface DataContextProps {
  // Existing
  chickens: Chicken[];
  setChickens: React.Dispatch<React.SetStateAction<Chicken[]>>;
  addChicken: (chicken: Omit<Chicken, 'id'>) => void;
  updateChicken: (chicken: Chicken) => void;
  deleteChicken: (id: string) => void;

  eggLogs: EggLog[];
  setEggLogs: React.Dispatch<React.SetStateAction<EggLog[]>>;
  addEggLog: (eggLog: Omit<EggLog, 'id'>) => void;

  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;

  foodLogs: FoodLog[];
  setFoodLogs: React.Dispatch<React.SetStateAction<FoodLog[]>>;
  addFoodLog: (foodLog: Omit<FoodLog, 'id'>) => void;
  updateFoodLog: (foodLog: FoodLog) => void;
  deleteFoodLog: (id: string) => void;

  // New Features
  incubationBatches: IncubationBatch[];
  setIncubationBatches: React.Dispatch<React.SetStateAction<IncubationBatch[]>>;
  addIncubationBatch: (batch: Omit<IncubationBatch, 'id' | 'expectedHatchDate' | 'hasBeenRecordedInInventory'>) => void;
  updateIncubationBatch: (batch: IncubationBatch) => void;
  deleteIncubationBatch: (id: string) => void;

  financialTransactions: FinancialTransaction[];
  setFinancialTransactions: React.Dispatch<React.SetStateAction<FinancialTransaction[]>>;
  addFinancialTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => void;
  updateFinancialTransaction: (transaction: FinancialTransaction) => void;
  deleteFinancialTransaction: (id: string) => void;

  inventoryItems: InventoryItem[];
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'currentQuantity'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;

  inventoryLogs: InventoryLog[];
  setInventoryLogs: React.Dispatch<React.SetStateAction<InventoryLog[]>>;
  addInventoryLog: (logEntry: Omit<InventoryLog, 'id'>) => void;
  // No update/delete for inventory logs for simplicity, handled by item deletion or adjustments
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

const useDataManagement = () => {
    const [chickens, setChickens] = useLocalStorage<Chicken[]>('chickens', []);
    const [eggLogs, setEggLogs] = useLocalStorage<EggLog[]>('eggLogs', []);
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [foodLogs, setFoodLogs] = useLocalStorage<FoodLog[]>('foodLogs', []);
    const [incubationBatches, setIncubationBatches] = useLocalStorage<IncubationBatch[]>('incubationBatches', []);
    const [financialTransactions, setFinancialTransactions] = useLocalStorage<FinancialTransaction[]>('financialTransactions', []);
    const [inventoryItems, setInventoryItems] = useLocalStorage<InventoryItem[]>('inventoryItems', []);
    const [inventoryLogs, setInventoryLogs] = useLocalStorage<InventoryLog[]>('inventoryLogs', []);

    // Chicken Management
    const addChicken = (chickenData: Omit<Chicken, 'id'>) => setChickens(prev => [...prev, { ...chickenData, id: Date.now().toString() }].sort((a,b) => a.name.localeCompare(b.name)));
    const updateChicken = (updatedChicken: Chicken) => setChickens(prev => prev.map(c => c.id === updatedChicken.id ? updatedChicken : c).sort((a,b) => a.name.localeCompare(b.name)));
    const deleteChicken = (id: string) => setChickens(prev => prev.filter(c => c.id !== id));

    // Egg Log Management
    const addEggLog = (eggLogData: Omit<EggLog, 'id'>) => {
        const existingLogIndex = eggLogs.findIndex(log => log.date === eggLogData.date);
        if (existingLogIndex > -1) {
            setEggLogs(prev => prev.map((log, index) =>
                index === existingLogIndex ? { ...log, quantity: log.quantity + eggLogData.quantity } : log
            ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
            setEggLogs(prev => [...prev, { ...eggLogData, id: Date.now().toString() }].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    };

    // Task Management
    const addTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => setTasks(prev => [...prev, { ...taskData, id: Date.now().toString(), isCompleted: false }].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    const updateTask = (updatedTask: Task) => setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
    const toggleTaskCompletion = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));

    // Food Log Management
    const addFoodLog = (foodLogData: Omit<FoodLog, 'id'>) => setFoodLogs(prev => [...prev, { ...foodLogData, id: Date.now().toString() }].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    const updateFoodLog = (updatedFoodLog: FoodLog) => setFoodLogs(prev => prev.map(fl => fl.id === updatedFoodLog.id ? updatedFoodLog : fl).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    const deleteFoodLog = (id: string) => setFoodLogs(prev => prev.filter(fl => fl.id !== id));

    // Incubation Batch Management
    const addIncubationBatch = (batchData: Omit<IncubationBatch, 'id' | 'expectedHatchDate' | 'hasBeenRecordedInInventory'>) => {
        const startDate = new Date(batchData.startDate + 'T00:00:00');
        const expectedDate = new Date(startDate);
        expectedDate.setDate(startDate.getDate() + 22); // 22-day incubation period

        const newBatch: IncubationBatch = {
            ...batchData,
            id: Date.now().toString(),
            expectedHatchDate: expectedDate.toISOString().split('T')[0],
            hasBeenRecordedInInventory: false,
        };
        setIncubationBatches(prev => [...prev, newBatch].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    };

    const updateIncubationBatch = (updatedBatch: IncubationBatch) => {
        let batchToUpdate = { ...updatedBatch }; // Make a mutable copy

        if (batchToUpdate.chicksHatched && batchToUpdate.chicksHatched > 0 && batchToUpdate.actualHatchDate && !batchToUpdate.hasBeenRecordedInInventory) {
            const newInventoryItem: Omit<InventoryItem, 'id' | 'currentQuantity'> = {
                name: `Pollitos del Lote '${batchToUpdate.batchName}'`,
                category: InventoryCategory.Meat,
                birdType: "Pollito",
                dateAdded: batchToUpdate.actualHatchDate,
                unit: 'pollitos',
                initialQuantity: batchToUpdate.chicksHatched,
                notes: `Nacidos del lote de incubación: ${batchToUpdate.batchName} (ID: ${batchToUpdate.id})`,
            };
            addInventoryItem(newInventoryItem);
            batchToUpdate.hasBeenRecordedInInventory = true;
        }

        setIncubationBatches(prev => prev.map(b => b.id === batchToUpdate.id ? batchToUpdate : b).sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    };
    const deleteIncubationBatch = (id: string) => setIncubationBatches(prev => prev.filter(b => b.id !== id));

    // Financial Transaction Management
    const addFinancialTransaction = (transactionData: Omit<FinancialTransaction, 'id'>) => setFinancialTransactions(prev => [...prev, { ...transactionData, id: Date.now().toString() }].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    const updateFinancialTransaction = (updatedTransaction: FinancialTransaction) => setFinancialTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    const deleteFinancialTransaction = (id: string) => setFinancialTransactions(prev => prev.filter(t => t.id !== id));

    // Inventory Item Management
    const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'currentQuantity'>) => {
        const newItem = {
            ...itemData,
            id: Date.now().toString(),
            currentQuantity: itemData.initialQuantity
        };
        setInventoryItems(prev => [...prev, newItem].sort((a,b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()));
    };
    const updateInventoryItem = (updatedItemData: InventoryItem) => setInventoryItems(prevItems => prevItems.map(item => item.id === updatedItemData.id ? { ...item, ...updatedItemData } : item).sort((a,b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()));
    const deleteInventoryItem = (id: string) => {
        setInventoryItems(prev => prev.filter(item => item.id !== id));
        setInventoryLogs(prevLogs => prevLogs.filter(log => log.inventoryItemId !== id));
    };

    // Inventory Log Management
    const addInventoryLog = (logEntryData: Omit<InventoryLog, 'id'>) => {
        setInventoryItems(prevItems =>
            prevItems.map(item => {
                if (item.id === logEntryData.inventoryItemId) {
                    let newCurrentQuantity = item.currentQuantity;
                    switch (logEntryData.action) {
                        case InventoryAction.Addition:
                            newCurrentQuantity += logEntryData.quantityChanged;
                            break;
                        case InventoryAction.Sale:
                        case InventoryAction.Consumption:
                        case InventoryAction.Spoilage:
                            newCurrentQuantity -= logEntryData.quantityChanged;
                            break;
                        case InventoryAction.Adjustment:
                            newCurrentQuantity -= logEntryData.quantityChanged;
                            break;
                        default:
                            break;
                    }
                    return { ...item, currentQuantity: Math.max(0, newCurrentQuantity) };
                }
                return item;
            })
        );
        setInventoryLogs(prev => [...prev, { ...logEntryData, id: Date.now().toString() }].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        if (logEntryData.action === InventoryAction.Sale && logEntryData.salePricePerUnit && logEntryData.saleCurrency) {
            const itemSold = inventoryItems.find(i => i.id === logEntryData.inventoryItemId);
            if (itemSold) {
                const financialTransactionData: Omit<FinancialTransaction, 'id'> = {
                    date: logEntryData.date,
                    description: `Venta de ${itemSold.name} (${logEntryData.quantityChanged} ${itemSold.unit})`,
                    category: `Venta de ${itemSold.category === InventoryCategory.Eggs ? 'Huevos' : 'Carne'}`,
                    transactionType: TransactionType.Income,
                    amount: logEntryData.quantityChanged * logEntryData.salePricePerUnit,
                    currency: logEntryData.saleCurrency,
                    notes: `Venta de inventario ID: ${itemSold.id}`,
                };
                addFinancialTransaction(financialTransactionData);
            }
        }
    };

    return {
        chickens, setChickens, addChicken, updateChicken, deleteChicken,
        eggLogs, setEggLogs, addEggLog,
        tasks, setTasks, addTask, updateTask, deleteTask, toggleTaskCompletion,
        foodLogs, setFoodLogs, addFoodLog, updateFoodLog, deleteFoodLog,
        incubationBatches, setIncubationBatches, addIncubationBatch, updateIncubationBatch, deleteIncubationBatch,
        financialTransactions, setFinancialTransactions, addFinancialTransaction, updateFinancialTransaction, deleteFinancialTransaction,
        inventoryItems, setInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem,
        inventoryLogs, setInventoryLogs, addInventoryLog
    };
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const data = useDataManagement();
  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
