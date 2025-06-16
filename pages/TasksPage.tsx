
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Task, Page } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/TaskForm';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';

const TaskItem: React.FC<{ task: Task; onToggle: () => void; onEdit: () => void; onDelete: () => void; }> = ({ task, onToggle, onEdit, onDelete }) => {
  const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date(new Date().toDateString()); // Compare date part only
  
  return (
    <li className={`p-3 sm:p-4 flex items-center justify-between border-b border-gray-200 last:border-b-0 ${task.isCompleted ? 'bg-green-50' : isOverdue ? 'bg-red-50' : 'bg-white'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={onToggle}
          className="h-5 w-5 text-pf-green rounded border-gray-300 focus:ring-pf-green mr-3"
          aria-labelledby={`task-desc-${task.id}`}
        />
        <div>
          <p id={`task-desc-${task.id}`} className={`text-pf-text ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
            {task.description}
          </p>
          <p className={`text-xs ${task.isCompleted ? 'text-gray-400' : isOverdue ? 'text-red-600 font-semibold' : 'text-pf-text-secondary'}`}>
            Vence: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString()} {isOverdue && !task.isCompleted && '(Vencida)'}
          </p>
        </div>
      </div>
      {!task.isCompleted && (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Edit ${task.description}`}>
            <ICONS.Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:bg-red-100" aria-label={`Delete ${task.description}`}>
            <ICONS.Delete className="w-4 h-4" />
          </Button>
        </div>
      )}
    </li>
  );
};


const TasksPage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleOpenModal = (task?: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'isCompleted'> | Task) => {
    if ('id' in taskData) { // Editing existing task
      updateTask(taskData as Task);
    } else { // Adding new task
      addTask(taskData as Omit<Task, 'id' | 'isCompleted'>);
    }
    handleCloseModal();
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask(id);
    }
  };

  const pendingTasks = tasks.filter(task => !task.isCompleted).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completedTasks = tasks.filter(task => task.isCompleted).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pf-text">{Page.Tasks}</h1>
        <Button onClick={() => handleOpenModal()} leftIcon={<ICONS.Plus className="w-5 h-5"/>}>
          Añadir Tarea
        </Button>
      </div>

      <Card title="Tareas Pendientes">
        {pendingTasks.length === 0 ? (
          <p className="text-pf-text-secondary text-center py-4">¡No hay tareas pendientes! Buen trabajo.</p>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {pendingTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task}
                onToggle={() => toggleTaskCompletion(task.id)}
                onEdit={() => handleOpenModal(task)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </ul>
        )}
      </Card>
      
      {completedTasks.length > 0 && (
        <Card title="Tareas Completadas">
           <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
            {completedTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task}
                onToggle={() => toggleTaskCompletion(task.id)}
                onEdit={() => handleOpenModal(task)} // Might want to disable editing for completed tasks
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </ul>
        </Card>
      )}


      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Editar Tarea' : 'Añadir Nueva Tarea'}
      >
        <TaskForm 
          onSubmit={handleSubmitTask} 
          initialData={editingTask}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;
