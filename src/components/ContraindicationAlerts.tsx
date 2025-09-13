import React from 'react';
import { Contraindication } from '../services/contraindicationService';

interface ContraindicationAlertsProps {
  contraindications: Contraindication[];
}

const ContraindicationAlerts: React.FC<ContraindicationAlertsProps> = ({ contraindications }) => {
  if (contraindications.length === 0) {
    return (
      <div className="alert-success">
        <div className="flex items-center">
          <span className="text-green-600 text-2xl mr-4">✅</span>
          <div>
            <h4 className="font-semibold text-green-900 text-lg">No Contraindications Found</h4>
            <p className="text-green-700">All medications are safe for this patient's conditions.</p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'absolute': return 'bg-red-100 border-red-300 text-red-900';
      case 'relative': return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      default: return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'absolute': return '🚫';
      case 'relative': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'absolute': return 'ABSOLUTE CONTRAINDICATION';
      case 'relative': return 'RELATIVE CONTRAINDICATION';
      default: return 'CAUTION';
    }
  };

  return (
    <div className="space-y-4">
      {contraindications.map((contraindication, index) => (
        <div
          key={index}
          className={`rounded-xl p-6 shadow-lg border-2 ${getSeverityColor(contraindication.severity)}`}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-lg">
              {contraindication.medication} - {contraindication.condition}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getSeverityIcon(contraindication.severity)}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(contraindication.severity)}`}>
                {getSeverityText(contraindication.severity)}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Description:</span> {contraindication.description}
            </div>
            
            {contraindication.alternative && (
              <div>
                <span className="font-medium">Alternative:</span> 
                <span className="ml-2 text-blue-700 font-medium">{contraindication.alternative}</span>
              </div>
            )}
            
            {contraindication.monitoring.length > 0 && (
              <div>
                <span className="font-medium">Monitoring Required:</span>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {contraindication.monitoring.map((item, idx) => (
                    <li key={idx} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContraindicationAlerts;
