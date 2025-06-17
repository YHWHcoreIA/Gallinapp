
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import { InventoryCategory, IncubationBatch } from '../types';
import { generateXML, generatePDF, downloadFile, AppData } from '../utils/exportData';


const DashboardPage: React.FC = () => {
  const dataContext = useData();
  const { chickens, eggLogs, tasks, foodLogs, incubationBatches, financialTransactions, inventoryItems, inventoryLogs } = dataContext;

  const [isDownloadingXml, setIsDownloadingXml] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const getTodayISO = () => new Date().toISOString().split('T')[0];
  const getStartOfWeekISO = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(today.setDate(diff)).toISOString().split('T')[0];
  };

  const today = getTodayISO();
  const startOfWeek = getStartOfWeekISO();

  const eggsToday = eggLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.quantity, 0);

  const eggsThisWeek = eggLogs
    .filter(log => log.date >= startOfWeek)
    .reduce((sum, log) => sum + log.quantity, 0);

  const totalBroilers = inventoryItems
    .filter(item => item.category === InventoryCategory.Meat && item.birdType === "Pollo de Engorde")
    .reduce((sum, item) => sum + item.currentQuantity, 0);

  const eggsInIncubation = incubationBatches
    .filter((batch: IncubationBatch) => !batch.actualHatchDate)
    .reduce((sum, batch) => sum + batch.eggsSet, 0);
  const weeklyEggData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const data = last7Days.map(date => {
        const totalEggs = eggLogs
            .filter(log => log.date === date)
            .reduce((sum, log) => sum + log.quantity, 0);
        return {
            date,
            day: new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' }),
            eggs: totalEggs,
        };
    });
    return data;
  }, [eggLogs]);

  const maxWeeklyEggs = useMemo(() => Math.max(...weeklyEggData.map(d => d.eggs), 1), [weeklyEggData]);


  const handleDownloadXML = async () => {
    setIsDownloadingXml(true);
    try {
      const allData: AppData = {
        chickens, eggLogs, tasks, foodLogs, incubationBatches, financialTransactions, inventoryItems, inventoryLogs
      };
      const xmlData = generateXML(allData);
      downloadFile(xmlData, `GranjasNG_Datos_${new Date().toISOString().split('T')[0]}.xml`, 'application/xml');
    } catch (error) {
      console.error("Error generating XML:", error);
      alert("Ocurrió un error al generar el archivo XML.");
    } finally {
      setIsDownloadingXml(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    try {
      const allData: AppData = {
        chickens, eggLogs, tasks, foodLogs, incubationBatches, financialTransactions, inventoryItems, inventoryLogs
      };
      await generatePDF(allData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Ocurrió un error al generar el archivo PDF.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pf-text">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"> {/* Adjusted grid for 5 items */}
        {/* 1. Total Gallinas */}
        <Card className="bg-pf-green text-white" aria-labelledby="total-chickens-label">
          <div className="flex items-center">
            <ICONS.Chicken className="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4 text-white" />
            <div>
              <p className="text-3xl md:text-4xl font-bold">{chickens.length}</p>
              <p id="total-chickens-label" className="text-md md:text-lg">Total Gallinas</p>
            </div>
          </div>
        </Card>

        {/* 2. Pollos de Engorde */}
        <Card className="bg-pf-brown-light text-pf-brown-dark" aria-labelledby="broilers-label">
           <div className="flex items-center">
            <ICONS.Chicken className="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4 text-pf-brown-dark" />
            <div>
              <p className="text-3xl md:text-4xl font-bold">{totalBroilers}</p>
              <p id="broilers-label" className="text-md md:text-lg">Pollos de Engorde</p>
            </div>
          </div>
        </Card>

        {/* 3. Huevos en Incubación */}
        <Card className="bg-pf-green-light text-pf-green-dark" aria-labelledby="incubation-eggs-label">
           <div className="flex items-center">
            <ICONS.Incubation className="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4 text-pf-green-dark" />
            <div>
              <p className="text-3xl md:text-4xl font-bold">{eggsInIncubation}</p>
              <p id="incubation-eggs-label" className="text-md md:text-lg">Huevos en Incubación</p>
            </div>
          </div>
        </Card>

        {/* 4. Huevos Hoy */}
        <Card className="bg-pf-brown text-white" aria-labelledby="eggs-today-label">
           <div className="flex items-center">
            <ICONS.Egg className="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4 text-white" />
            <div>
              <p className="text-3xl md:text-4xl font-bold">{eggsToday}</p>
              <p id="eggs-today-label" className="text-md md:text-lg">Huevos Hoy</p>
            </div>
          </div>
        </Card>

        {/* 5. Huevos Esta Semana */}
        <Card className="bg-pf-brown-light text-pf-brown-dark" aria-labelledby="eggs-week-label">
           <div className="flex items-center">
            <ICONS.Egg className="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4 text-pf-brown-dark" />
            <div>
              <p className="text-3xl md:text-4xl font-bold">{eggsThisWeek}</p>
              <p id="eggs-week-label" className="text-md md:text-lg">Huevos Esta Semana</p>
            </div>
          </div>
        </Card>
      </div>
      <Card title="Producción de Huevos (Últimos 7 Días)">
          <div className="flex justify-between items-end h-48 p-4">
              {weeklyEggData.map(data => (
                  <div key={data.date} className="flex flex-col items-center w-1/7">
                      <div className="text-sm font-bold text-pf-text">{data.eggs}</div>
                      <div
                          className="w-8 bg-pf-green rounded-t-md"
                          style={{ height: `${(data.eggs / maxWeeklyEggs) * 100}%` }}
                          title={`${data.eggs} huevos`}
                      ></div>
                      <div className="text-xs text-pf-text-secondary mt-1">{data.day}</div>
                  </div>
              ))}
          </div>
      </Card>


      <Card title="Descargar Datos">
        <p className="text-pf-text-secondary mb-4">
          Descargue todos los datos de su aplicación en formato XML o PDF.
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={handleDownloadXML}
            disabled={isDownloadingXml || isDownloadingPdf}
            leftIcon={<ICONS.Download className="w-5 h-5" />}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            {isDownloadingXml ? 'Generando XML...' : 'Descargar XML'}
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloadingPdf || isDownloadingXml}
            leftIcon={<ICONS.Download className="w-5 h-5" />}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            {isDownloadingPdf ? 'Generando PDF...' : 'Descargar PDF'}
          </Button>
        </div>
      </Card>

      <Card title="¡Bienvenido a Granjas NG!">
        <p className="text-pf-text-secondary">
          ¡Gestiona tu granja de traspatio con facilidad! Registra tus aves, lleva un control de la producción de huevos y carne, administra la incubación, registra el alimento, maneja las finanzas y organiza tus tareas pendientes.
        </p>
        <p className="text-pf-text-secondary mt-2">
          Usa la navegación de arriba para empezar. ¡Éxito con tu granja!
        </p>
      </Card>

    </div>
  );
};

export default DashboardPage;
