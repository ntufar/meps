import React from 'react';
import { DrugInteraction } from '../types/medical';

interface InteractionCheckerProps {
  interactions: DrugInteraction[];
  isLoading: boolean;
  error: string | null;
}

const InteractionChecker: React.FC<InteractionCheckerProps> = ({
  interactions,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Checking for drug interactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">⚠️ Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.length === 0 ? (
        <div className="text-center py-8 text-green-600">
          ✅ No drug interactions detected
        </div>
      ) : (
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className={`p-4 rounded-lg border ${
                interaction.severity === 'contraindicated' || interaction.severity === 'major'
                  ? 'bg-red-50 border-red-200'
                  : interaction.severity === 'moderate'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{interaction.description}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  interaction.severity === 'contraindicated' || interaction.severity === 'major'
                    ? 'bg-red-100 text-red-800'
                    : interaction.severity === 'moderate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {interaction.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{interaction.clinicalEffect}</p>
              <p className="text-sm text-gray-600 mt-1">{interaction.management}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractionChecker;
