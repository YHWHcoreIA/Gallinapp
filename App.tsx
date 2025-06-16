
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ChickensPage from './pages/ChickensPage';
import EggLogPage from './pages/EggLogPage';
import TasksPage from './pages/TasksPage';
import FeedCalculatorPage from './pages/FeedCalculatorPage';
import FoodLogPage from './pages/FoodLogPage';
import IncubationPage from './pages/IncubationPage'; // New
import InventoryPage from './pages/InventoryPage';   // New
import FinancialsPage from './pages/FinancialsPage'; // New
import { Page } from './types';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pf-green-light">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Navigate to={`/${Page.Dashboard.toLowerCase().replace(/\s+/g, '-')}`} replace />} />
          <Route path={`/${Page.Dashboard.toLowerCase().replace(/\s+/g, '-')}`} element={<DashboardPage />} />
          <Route path={`/${Page.Chickens.toLowerCase().replace(/\s+/g, '-')}`} element={<ChickensPage />} />
          <Route path={`/${Page.Eggs.toLowerCase().replace(/\s+/g, '-')}`} element={<EggLogPage />} />
          <Route path={`/${Page.Tasks.toLowerCase().replace(/\s+/g, '-')}`} element={<TasksPage />} />
          <Route path={`/${Page.FeedCalculator.toLowerCase().replace(/\s+/g, '-')}`} element={<FeedCalculatorPage />} />
          <Route path={`/${Page.FoodLog.toLowerCase().replace(/\s+/g, '-')}`} element={<FoodLogPage />} />
          <Route path={`/${Page.Incubation.toLowerCase().replace(/\s+/g, '-')}`} element={<IncubationPage />} />
          <Route path={`/${Page.Inventory.toLowerCase().replace(/\s+/g, '-')}`} element={<InventoryPage />} />
          <Route path={`/${Page.Financials.toLowerCase().replace(/\s+/g, '-')}`} element={<FinancialsPage />} />
        </Routes>
      </main>
      <footer className="text-center p-4 text-pf-text-secondary text-sm">
        Granjas NG Backyard Manager &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
