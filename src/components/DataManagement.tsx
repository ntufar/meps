import React, { useState } from 'react';
import { MEPSState } from '../types/medical';
import { StorageService } from '../services/storageService';
import { PDFExportService } from '../services/pdfExportService';

interface DataManagementProps {
  state: MEPSState;
  onLoadData: (state: Partial<MEPSState>) => void;
  onClearData: () => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ state, onLoadData, onClearData }) => {
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');

  const handleSaveData = () => {
    StorageService.savePatientInfo(state.patientInfo);
    StorageService.saveMedications(state.medications);
    alert('Data saved successfully!');
  };

  const handleLoadData = () => {
    const patientInfo = StorageService.loadPatientInfo();
    const medications = StorageService.loadMedications();
    
    if (patientInfo || medications.length > 0) {
      onLoadData({ patientInfo: patientInfo || state.patientInfo, medications });
      alert('Data loaded successfully!');
    } else {
      alert('No saved data found.');
    }
  };

  const handleExportData = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `meps-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    if (StorageService.importData(importData)) {
      const patientInfo = StorageService.loadPatientInfo();
      const medications = StorageService.loadMedications();
      onLoadData({ patientInfo: patientInfo || state.patientInfo, medications });
      setShowImport(false);
      setImportData('');
      alert('Data imported successfully!');
    } else {
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleExportReport = () => {
    PDFExportService.downloadReport(state);
  };

  const handlePrintReport = () => {
    PDFExportService.printReport(state);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      StorageService.clearAllData();
      onClearData();
      alert('All data cleared successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
          Data Management
        </h2>
        <p className="text-slate-600 text-lg">Save, load, and export your MEPS data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Save & Load */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Storage</h3>
          <div className="space-y-3">
            <button
              onClick={handleSaveData}
              className="w-full btn-primary"
            >
              💾 Save Current Data
            </button>
            <button
              onClick={handleLoadData}
              className="w-full btn-secondary"
            >
              📂 Load Saved Data
            </button>
            <button
              onClick={handleClearData}
              className="w-full btn-danger"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Export & Import */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Export & Import</h3>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full btn-primary"
            >
              📤 Export Data (JSON)
            </button>
            <button
              onClick={() => setShowImport(!showImport)}
              className="w-full btn-secondary"
            >
              📥 Import Data (JSON)
            </button>
          </div>
        </div>

        {/* Reports */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety Reports</h3>
          <div className="space-y-3">
            <button
              onClick={handleExportReport}
              className="w-full btn-success"
            >
              📄 Download Safety Report
            </button>
            <button
              onClick={handlePrintReport}
              className="w-full btn-secondary"
            >
              🖨️ Print Safety Report
            </button>
          </div>
        </div>

        {/* Data Summary */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Data</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Medications:</span>
              <span className="font-semibold">{state.medications.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Patient Age:</span>
              <span className="font-semibold">{state.patientInfo.age || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Allergies:</span>
              <span className="font-semibold">{state.patientInfo.allergies.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Conditions:</span>
              <span className="font-semibold">{state.patientInfo.medicalConditions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Has Stored Data:</span>
              <span className="font-semibold">{StorageService.hasStoredData() ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Import Data</h3>
              <button
                onClick={() => setShowImport(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste JSON data here:
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="Paste exported JSON data here..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleImportData}
                  className="flex-1 btn-primary"
                >
                  Import Data
                </button>
                <button
                  onClick={() => setShowImport(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;
