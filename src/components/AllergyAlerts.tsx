import React from 'react';
import { AllergyAlert } from '../types/medical';
import { AllergyCheckerService } from '../services/allergyChecker';

interface AllergyAlertsProps {
  alerts: AllergyAlert[];
}

const AllergyAlerts: React.FC<AllergyAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="alert-success">
        <div className="flex items-center">
          <span className="text-green-600 text-2xl mr-4">✅</span>
          <div>
            <h4 className="font-semibold text-green-900 text-lg">No Allergy Alerts</h4>
            <p className="text-green-700">All medications appear safe for this patient's known allergies.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`rounded-xl p-6 shadow-lg border-2 ${AllergyCheckerService.getSeverityColor(alert.severity)}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{AllergyCheckerService.getSeverityIcon(alert.severity)}</span>
              <div>
                <h4 className="font-bold text-lg">
                  ALLERGY ALERT: {alert.medication}
                </h4>
                <p className="text-sm opacity-80">
                  Patient allergic to: <span className="font-semibold">{alert.allergen}</span>
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${AllergyCheckerService.getSeverityColor(alert.severity)}`}>
              {alert.severity.toUpperCase()}
            </span>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-red-800">Potential Reaction:</span>
              <p className="text-red-700 mt-1">{alert.reaction}</p>
            </div>
            
            <div>
              <span className="font-semibold text-blue-800">Recommended Action:</span>
              <p className="text-blue-700 mt-1 font-medium">{alert.action}</p>
            </div>
            
            {alert.alternative && (
              <div>
                <span className="font-semibold text-green-800">Alternative Medications:</span>
                <p className="text-green-700 mt-1">{alert.alternative}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-current border-opacity-20">
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold">⚠️</span>
              <span>Do not administer this medication. Consult with pharmacist or physician immediately.</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllergyAlerts;
