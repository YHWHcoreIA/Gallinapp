
import React, { useState, useMemo, useEffect } from 'react';
import { Page, ChickenTypeForCalc, FeedTypeForCalc, FeedConsumptionRule } from '../types';
import { FEED_CONSUMPTION_RULES, ICONS } from '../constants';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const FeedCalculatorPage: React.FC = () => {
  const [numChickensStr, setNumChickensStr] = useState<string>('');
  const [selectedChickenType, setSelectedChickenType] = useState<ChickenTypeForCalc | ''>('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>(''); // Stores ageGroupDescription
  const [selectedFeedType, setSelectedFeedType] = useState<FeedTypeForCalc | ''>('');

  const [calculatedDailyFeed, setCalculatedDailyFeed] = useState<number | null>(null);
  const [calculatedWeeklyFeed, setCalculatedWeeklyFeed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chickenTypeOptions = Object.values(ChickenTypeForCalc);

  const ageGroupOptions = useMemo(() => {
    if (!selectedChickenType) return [];
    const uniqueAgeGroups = [...new Set(FEED_CONSUMPTION_RULES
      .filter(rule => rule.chickenType === selectedChickenType)
      .map(rule => rule.ageGroupDescription)
    )];
    return uniqueAgeGroups;
  }, [selectedChickenType]);

  const feedTypeOptions = useMemo(() => {
    if (!selectedChickenType || !selectedAgeGroup) return [];
    const uniqueFeedTypes = [...new Set(FEED_CONSUMPTION_RULES
      .filter(rule => rule.chickenType === selectedChickenType && rule.ageGroupDescription === selectedAgeGroup)
      .map(rule => rule.feedType)
    )];
    return uniqueFeedTypes;
  }, [selectedChickenType, selectedAgeGroup]);

  useEffect(() => {
    setSelectedAgeGroup('');
    setSelectedFeedType('');
    setCalculatedDailyFeed(null);
    setCalculatedWeeklyFeed(null);
    setError(null);
  }, [selectedChickenType]);

  useEffect(() => {
    setSelectedFeedType('');
    setCalculatedDailyFeed(null);
    setCalculatedWeeklyFeed(null);
    setError(null);
    if (feedTypeOptions.length === 1) {
      setSelectedFeedType(feedTypeOptions[0]);
    }
  }, [selectedAgeGroup, feedTypeOptions]);


  const handleCalculate = () => {
    setError(null);
    setCalculatedDailyFeed(null);
    setCalculatedWeeklyFeed(null);

    const numGallinas = parseInt(numChickensStr, 10);
    if (isNaN(numGallinas) || numGallinas <= 0) {
      setError("Por favor, ingrese un número válido de gallinas.");
      return;
    }
    if (!selectedChickenType) {
      setError("Por favor, seleccione el tipo de gallina.");
      return;
    }
    if (!selectedAgeGroup) {
      setError("Por favor, seleccione el grupo de edad.");
      return;
    }
    if (!selectedFeedType) {
      setError("Por favor, seleccione el tipo de alimento.");
      return;
    }

    const rule = FEED_CONSUMPTION_RULES.find(
      r => r.chickenType === selectedChickenType &&
           r.ageGroupDescription === selectedAgeGroup &&
           r.feedType === selectedFeedType
    );

    if (rule) {
      let avgConsPerChicken = 0;
      if (typeof rule.avgConsumption === 'number') {
        avgConsPerChicken = rule.avgConsumption;
      } else {
        avgConsPerChicken = (rule.avgConsumption.min + rule.avgConsumption.max) / 2;
      }
      
      const dailyTotalGrams = numGallinas * avgConsPerChicken;
      const weeklyTotalGrams = dailyTotalGrams * 7;

      setCalculatedDailyFeed(dailyTotalGrams / 1000); // Convert to kg
      setCalculatedWeeklyFeed(weeklyTotalGrams / 1000); // Convert to kg
    } else {
      setError("No se encontró una regla de consumo para la selección actual. Verifique las opciones.");
    }
  };

  const commonSelectClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pf-green focus:border-pf-green bg-white text-pf-text";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pf-text">{Page.FeedCalculator}</h1>

      <Card title="Ingresar Datos de la Parvada">
        <div className="space-y-4">
          <Input
            label="Número de Gallinas"
            id="numChickens"
            type="number"
            value={numChickensStr}
            onChange={(e) => {
              setNumChickensStr(e.target.value);
              setCalculatedDailyFeed(null); 
              setCalculatedWeeklyFeed(null);
              setError(null);
            }}
            min="1"
            placeholder="Ej: 50"
          />

          <div>
            <label htmlFor="chickenType" className="block text-sm font-medium text-pf-text-secondary mb-1">Tipo de Gallina</label>
            <select
              id="chickenType"
              value={selectedChickenType}
              onChange={(e) => setSelectedChickenType(e.target.value as ChickenTypeForCalc)}
              className={commonSelectClasses}
            >
              <option value="" disabled>Seleccione un tipo...</option>
              {chickenTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {selectedChickenType && (
            <div>
              <label htmlFor="ageGroup" className="block text-sm font-medium text-pf-text-secondary mb-1">Grupo de Edad/Etapa</label>
              <select
                id="ageGroup"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className={commonSelectClasses}
                disabled={ageGroupOptions.length === 0}
              >
                <option value="" disabled>Seleccione una etapa...</option>
                {ageGroupOptions.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          )}

          {selectedChickenType && selectedAgeGroup && (
            <div>
              <label htmlFor="feedType" className="block text-sm font-medium text-pf-text-secondary mb-1">Tipo de Alimento</label>
              <select
                id="feedType"
                value={selectedFeedType}
                onChange={(e) => setSelectedFeedType(e.target.value as FeedTypeForCalc)}
                className={commonSelectClasses}
                disabled={feedTypeOptions.length === 0}
              >
                <option value="" disabled>Seleccione un alimento...</option>
                {feedTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
          
          <Button onClick={handleCalculate} className="w-full" disabled={!selectedChickenType || !selectedAgeGroup || !selectedFeedType || !numChickensStr}>
            Calcular Consumo
          </Button>

          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}
        </div>
      </Card>

      {(calculatedDailyFeed !== null || calculatedWeeklyFeed !== null) && (
        <Card title="Resultado del Cálculo" className="bg-pf-green-light border border-pf-green">
          <div className="space-y-3 text-center">
            {calculatedDailyFeed !== null && (
              <div>
                <p className="text-lg text-pf-text-secondary">Cantidad Diaria Estimada:</p>
                <p className="text-3xl font-bold text-pf-green-dark">
                  {calculatedDailyFeed.toFixed(2)} kg
                </p>
              </div>
            )}
            {calculatedWeeklyFeed !== null && (
              <div>
                <p className="text-lg text-pf-text-secondary">Cantidad Semanal Estimada:</p>
                <p className="text-3xl font-bold text-pf-green-dark">
                  {calculatedWeeklyFeed.toFixed(2)} kg
                </p>
              </div>
            )}
            <div className="pt-2 text-xs text-pf-text-secondary">
              <p><strong>Aviso:</strong> Este cálculo es una estimación basada en promedios. Las necesidades reales pueden variar según la raza específica, clima, actividad y estado de salud de las aves. Consulte siempre las guías del fabricante del alimento.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FeedCalculatorPage;