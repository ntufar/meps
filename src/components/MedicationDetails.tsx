import React from 'react';
import { Medication } from '../types/medical';

interface MedicationDetailsProps {
  medication: Medication;
  onClose: () => void;
}

const MedicationDetails: React.FC<MedicationDetailsProps> = ({ medication, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Medication Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Medication Header Info */}
          <div className="flex items-start space-x-6">
            {/* Medication Image */}
            <div className="flex-shrink-0">
              {medication.image ? (
                <img
                  src={medication.image}
                  alt={medication.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/96x96/4F46E5/FFFFFF?text=' + medication.name.charAt(0);
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md border-2 border-gray-200 flex items-center justify-center text-white text-2xl font-bold">
                  {medication.name.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{medication.name}</h3>
              <p className="text-lg text-gray-600 mb-2">{medication.genericName}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {medication.category || 'Medication'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  {medication.dosage} {medication.unit}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                  {medication.frequency}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                  {medication.route}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              {medication.description && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">i</span>
                    Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{medication.description}</p>
                </div>
              )}

              {/* Indications */}
              {medication.indications && medication.indications.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">✓</span>
                    Indications
                  </h4>
                  <ul className="space-y-2">
                    {medication.indications.map((indication, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                        {indication}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Side Effects */}
              {medication.sideEffects && medication.sideEffects.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">⚠</span>
                    Side Effects
                  </h4>
                  <ul className="space-y-2">
                    {medication.sideEffects.map((effect, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contraindications */}
              {medication.contraindications && medication.contraindications.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">🚫</span>
                    Contraindications
                  </h4>
                  <ul className="space-y-2">
                    {medication.contraindications.map((contraindication, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></span>
                        {contraindication}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Monitoring */}
              {medication.monitoring && medication.monitoring.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">📊</span>
                    Monitoring Required
                  </h4>
                  <ul className="space-y-2">
                    {medication.monitoring.map((monitor, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></span>
                        {monitor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
                <div className="space-y-3 text-sm">
                  {medication.manufacturer && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Manufacturer:</span>
                      <span className="text-gray-900">{medication.manufacturer}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Form:</span>
                    <span className="text-gray-900 capitalize">{medication.form}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Route:</span>
                    <span className="text-gray-900 capitalize">{medication.route}</span>
                  </div>
                  {medication.strength && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Strength:</span>
                      <span className="text-gray-900">{medication.strength} {medication.unit}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;
