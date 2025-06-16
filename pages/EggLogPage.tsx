
import React from 'react';
import { useData } from '../contexts/DataContext';
import EggLogForm from '../components/EggLogForm';
import Card from '../components/ui/Card';
import { Page } from '../types';
import { ICONS } from '../constants';

const EggLogPage: React.FC = () => {
  const { eggLogs, addEggLog } = useData();

  // Aggregate eggs by date for display
  const aggregatedLogs: { [date: string]: number } = {};
  eggLogs.forEach(log => {
    aggregatedLogs[log.date] = (aggregatedLogs[log.date] || 0) + log.quantity;
  });

  const sortedDates = Object.keys(aggregatedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pf-text">{Page.Eggs}</h1>

      <Card title="Nuevo Registro de Huevos">
        <EggLogForm onSubmit={addEggLog} />
      </Card>

      <Card title="Historial de Recolección">
        {sortedDates.length === 0 ? (
          <p className="text-pf-text-secondary text-center py-4">No hay registros de huevos todavía.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {sortedDates.map((date) => (
                <li key={date} className="py-3 px-1 sm:py-4 flex justify-between items-center">
                  <span className="text-pf-text font-medium">
                    {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <div className="flex items-center text-pf-brown-dark font-semibold">
                     <ICONS.Egg className="w-5 h-5 mr-2"/>
                     {aggregatedLogs[date]} huevo{aggregatedLogs[date] !== 1 ? 's' : ''}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EggLogPage;
