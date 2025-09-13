import React from 'react';
import { DrugInteraction, DosageCalculation, AllergyAlert } from '../types/medical';
import { DrugInteractionService } from '../services/drugInteractions';
import AllergyAlerts from './AllergyAlerts';
import ContraindicationAlerts from './ContraindicationAlerts';
import { Contraindication } from '../services/contraindicationService';

interface ResultsDisplayProps {
  interactions: DrugInteraction[];
  dosageCalculations: DosageCalculation[];
  allergyAlerts: AllergyAlert[];
  contraindications: Contraindication[];
  isLoading: boolean;
  error: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  interactions,
  dosageCalculations,
  allergyAlerts,
  contraindications,
  isLoading,
  error
}) => {
  const getSeverityColor = (severity: string) => {
    return DrugInteractionService.getSeverityColor(severity);
  };

  const getEvidenceColor = (evidence: string) => {
    switch (evidence) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Running safety checks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
          Safety Check Results
        </h2>
        <p className="text-slate-600 text-lg">Review drug interactions and dosage calculations</p>
      </div>

      {/* Contraindication Alerts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
            {contraindications.length}
          </span>
          Contraindication Alerts
        </h3>
        
        <ContraindicationAlerts contraindications={contraindications} />
      </div>

      {/* Allergy Alerts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
            {allergyAlerts.length}
          </span>
          Allergy Alerts
        </h3>
        
        <AllergyAlerts alerts={allergyAlerts} />
      </div>

      {/* Drug Interactions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
            {interactions.length}
          </span>
          Drug Interactions
        </h3>
        
        {interactions.length === 0 ? (
          <div className="alert-success">
            <div className="flex items-center">
              <span className="text-green-600 text-2xl mr-4">✅</span>
              <div>
                <h4 className="font-semibold text-green-900 text-lg">No Drug Interactions Found</h4>
                <p className="text-green-700">The medications appear to be safe to use together.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div
                key={interaction.id}
                className={`rounded-xl p-6 shadow-lg ${getSeverityColor(interaction.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{interaction.description}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{DrugInteractionService.getSeverityIcon(interaction.severity)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(interaction.severity)}`}>
                      {interaction.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Clinical Effect:</span> {interaction.clinicalEffect}
                  </div>
                  <div>
                    <span className="font-medium">Management:</span> {interaction.management}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Evidence:</span>
                    <span className={`font-medium ${getEvidenceColor(interaction.evidence)}`}>
                      {interaction.evidence.toUpperCase()}
                    </span>
                  </div>
                  
                  {interaction.references.length > 0 && (
                    <div>
                      <span className="font-medium">References:</span>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        {interaction.references.map((ref, index) => (
                          <li key={index} className="text-xs">{ref}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dosage Calculations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
            {dosageCalculations.length}
          </span>
          Dosage Calculations
        </h3>
        
        {dosageCalculations.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-gray-600 text-xl mr-3">ℹ️</span>
              <div>
                <h4 className="font-medium text-gray-900">No Dosage Calculations</h4>
                <p className="text-gray-700 text-sm">Add medications to see personalized dosage calculations.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {dosageCalculations.map((calc, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{calc.medication.name}</h4>
                  <span className="text-sm text-gray-500">{calc.medication.genericName}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Calculated Dose</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {calc.calculatedDose} {calc.unit}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Frequency</div>
                    <div className="text-lg font-semibold text-gray-900">{calc.frequency}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Max Daily Dose</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {calc.maxDailyDose} {calc.unit}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Patient Info</div>
                    <div className="text-sm text-gray-900">
                      {calc.patientInfo.age}y, {calc.patientInfo.weight}kg
                    </div>
                  </div>
                </div>
                
                {calc.warnings.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-yellow-800 mb-2">Warnings:</div>
                    <ul className="list-disc list-inside text-sm text-yellow-700">
                      {calc.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {calc.adjustments.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-blue-800 mb-2">Adjustments:</div>
                    <ul className="list-disc list-inside text-sm text-blue-700">
                      {calc.adjustments.map((adjustment, idx) => (
                        <li key={idx}>{adjustment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Contraindications:</span>
                      <span className={`ml-2 font-semibold ${
                        contraindications.length === 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {contraindications.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Allergy Alerts:</span>
                      <span className={`ml-2 font-semibold ${
                        allergyAlerts.length === 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {allergyAlerts.length}
                      </span>
                    </div>
          <div>
            <span className="text-gray-600">Interactions Found:</span>
            <span className="ml-2 font-semibold text-gray-900">{interactions.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Dosages Calculated:</span>
            <span className="ml-2 font-semibold text-gray-900">{dosageCalculations.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className={`ml-2 font-semibold ${
              interactions.length === 0 && allergyAlerts.length === 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {interactions.length === 0 && allergyAlerts.length === 0 ? 'Safe' : 'Review Required'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
