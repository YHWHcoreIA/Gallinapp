
import React from 'react';
import { BreedInfo, GroundingChunk } from '../types';
import { ICONS } from '../constants';
import Card from './ui/Card';

interface BreedInfoSectionProps {
  breedName: string;
  breedInfo: BreedInfo | null;
  sources: GroundingChunk[] | null;
  isLoading: boolean;
  error?: string;
  onFetchBreedInfo: (breedName: string) => void;
}

const BreedInfoSection: React.FC<BreedInfoSectionProps> = ({
  breedName,
  breedInfo,
  sources,
  isLoading,
  error,
  onFetchBreedInfo,
}) => {
  if (!process.env.API_KEY) {
    return (
      <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm">
        La función de información de raza (con IA) está deshabilitada. Se requiere una clave API de Gemini.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-md font-semibold text-pf-text-secondary">Información de la Raza (IA)</h4>
        <button
            onClick={() => onFetchBreedInfo(breedName)}
            disabled={isLoading || !breedName}
            className="text-sm text-pf-green hover:text-pf-green-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
            <ICONS.Sparkles className="w-4 h-4 mr-1" />
            {isLoading ? 'Buscando...' : `Obtener info de "${breedName}"`}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}
      
      {isLoading && <p className="text-sm text-pf-text-secondary">Cargando información de la raza...</p>}

      {breedInfo && !isLoading && (
        <Card className="bg-pf-green-light border border-pf-green mt-2">
            <h5 className="text-lg font-semibold text-pf-green-dark">{breedInfo.breedName || breedName}</h5>
            <p className="text-sm text-pf-text mt-1">{breedInfo.description || 'No hay descripción disponible.'}</p>
            {breedInfo.characteristics && breedInfo.characteristics.length > 0 && (
                <div className="mt-2">
                    <h6 className="text-xs font-semibold text-pf-text-secondary uppercase">Características:</h6>
                    <ul className="list-disc list-inside text-sm text-pf-text space-y-0.5">
                        {breedInfo.characteristics.map((char, index) => <li key={index}>{char}</li>)}
                    </ul>
                </div>
            )}
            {breedInfo.temperament && (
                 <p className="text-sm text-pf-text mt-2"><strong className="text-pf-text-secondary text-xs uppercase">Temperamento:</strong> {breedInfo.temperament}</p>
            )}
            {breedInfo.eggProduction && (
                 <p className="text-sm text-pf-text mt-2"><strong className="text-pf-text-secondary text-xs uppercase">Producción de Huevos:</strong> {breedInfo.eggProduction}</p>
            )}
            {sources && sources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-pf-green/30">
                <h6 className="text-xs font-semibold text-pf-text-secondary uppercase">Fuentes (Google Search):</h6>
                <ul className="list-disc list-inside text-xs text-pf-text space-y-0.5">
                  {sources.map((source, index) => (
                    source.web && (
                      <li key={index}>
                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-pf-green hover:underline">
                          {source.web.title || source.web.uri}
                        </a>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
        </Card>
      )}
    </div>
  );
};

export default BreedInfoSection;
