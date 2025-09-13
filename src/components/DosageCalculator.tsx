import React from 'react';
import { DosageCalculation } from '../types/medical';

interface DosageCalculatorProps {
  calculations: DosageCalculation[];
  isLoading: boolean;
  error: string | null;
}

const DosageCalculator: React.FC<DosageCalculatorProps> = ({
  calculations,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Calculating dosages...</p>
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
      {calculations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No dosage calculations available
        </div>
      ) : (
        <div className="space-y-4">
          {calculations.map((calc, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{calc.medication.name}</h4>
                <span className="text-sm text-gray-500">{calc.medication.genericName}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Calculated Dose</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {calc.calculatedDose} {calc.unit}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Frequency</div>
                  <div className="text-sm font-medium text-gray-900">{calc.frequency}</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Max Daily</div>
                  <div className="text-sm font-medium text-gray-900">
                    {calc.maxDailyDose} {calc.unit}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Patient</div>
                  <div className="text-sm text-gray-900">
                    {calc.patientInfo.age}y, {calc.patientInfo.weight}kg
                  </div>
                </div>
              </div>
              
              {calc.warnings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs font-medium text-yellow-800 mb-1">Warnings:</div>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {calc.warnings.map((warning, idx) => (
                      <li key={idx}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {calc.adjustments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs font-medium text-blue-800 mb-1">Adjustments:</div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {calc.adjustments.map((adjustment, idx) => (
                      <li key={idx}>• {adjustment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DosageCalculator;
