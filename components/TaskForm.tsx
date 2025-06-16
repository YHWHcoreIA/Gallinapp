
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'isCompleted'> | Task) => void;
  initialData?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData }) => {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<{description?: string, dueDate?: string}>({});

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setDueDate(initialData.dueDate);
    } else {
      setDescription('');
      setDueDate(new Date().toISOString().split('T')[0]); // Default to today
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: {description?: string, dueDate?: string} = {};
    if (!description.trim()) newErrors.description = "La descripción es obligatoria.";
    if (!dueDate) newErrors.dueDate = "La fecha de vencimiento es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const taskData = { description, dueDate };
    if (initialData) {
      onSubmit({ ...initialData, ...taskData });
    } else {
      // For new tasks, isCompleted is false by default, handled in context
      onSubmit(taskData as Omit<Task, 'id' | 'isCompleted'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Descripción de la Tarea"
        id="taskDescription"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        required
      />
      <Input
        label="Fecha de Vencimiento"
        id="taskDueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        error={errors.dueDate}
        min={new Date().toISOString().split('T')[0]} // Default min to today
        required
      />
      <Button type="submit" className="w-full">
        {initialData ? 'Actualizar Tarea' : 'Añadir Tarea'}
      </Button>
    </form>
  );
};

export default TaskForm;
