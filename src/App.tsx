import { useState, useEffect } from 'react';
import { MEPSState, Medication, PatientInfo } from './types/medical';
import MedicationForm from './components/MedicationForm';
import PatientForm from './components/PatientForm';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import { DrugInteractionService } from './services/drugInteractions';
import { DosageCalculatorService } from './services/dosageCalculator';
import { AllergyCheckerService } from './services/allergyChecker';
import { StorageService } from './services/storageService';
import DataManagement from './components/DataManagement';

const initialPatientInfo: PatientInfo = {
  age: 0,
  weight: 0,
  height: 0,
  gender: 'male',
  allergies: [],
  medicalConditions: [],
  pregnancyStatus: 'none'
};

const initialState: MEPSState = {
  medications: [],
  patientInfo: initialPatientInfo,
  interactions: [],
  dosageCalculations: [],
  allergyAlerts: [],
  auditLogs: [],
  isLoading: false,
  error: null
};

function App() {
  const [state, setState] = useState<MEPSState>(initialState);
  const [activeTab, setActiveTab] = useState<'medications' | 'patient' | 'check' | 'results' | 'data'>('medications');

  const addMedication = (medication: Medication) => {
    setState(prev => ({
      ...prev,
      medications: [...prev.medications, medication]
    }));
  };

  const updatePatientInfo = (patientInfo: PatientInfo) => {
    setState(prev => ({
      ...prev,
      patientInfo
    }));
  };

  const checkInteractions = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call for drug interactions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the drug interaction service
      const interactions = DrugInteractionService.checkInteractions(state.medications);

      setState(prev => ({
        ...prev,
        interactions,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to check interactions',
        isLoading: false
      }));
    }
  };

  const calculateDosages = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call for dosage calculations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the dosage calculator service
      const calculations = state.medications.map(med => 
        DosageCalculatorService.calculateDosage(med, state.patientInfo)
      );

      setState(prev => ({
        ...prev,
        dosageCalculations: calculations,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to calculate dosages',
        isLoading: false
      }));
    }
  };

  const checkAllergies = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call for allergy checking
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use the allergy checker service
      const allergyAlerts = AllergyCheckerService.checkAllergies(state.medications, state.patientInfo);

      setState(prev => ({
        ...prev,
        allergyAlerts,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to check allergies',
        isLoading: false
      }));
    }
  };

  const runSafetyCheck = async () => {
    await Promise.all([checkInteractions(), calculateDosages(), checkAllergies()]);
    setActiveTab('results');
  };

  const loadData = (newState: Partial<MEPSState>) => {
    setState(prev => ({
      ...prev,
      ...newState
    }));
  };

  const clearData = () => {
    setState(initialState);
  };

  // Load data on component mount
  useEffect(() => {
    const savedPatientInfo = StorageService.loadPatientInfo();
    const savedMedications = StorageService.loadMedications();
    
    if (savedPatientInfo || savedMedications.length > 0) {
      setState(prev => ({
        ...prev,
        patientInfo: savedPatientInfo || prev.patientInfo,
        medications: savedMedications
      }));
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    if (state.medications.length > 0) {
      StorageService.saveMedications(state.medications);
    }
    if (state.patientInfo.age > 0 || state.patientInfo.allergies.length > 0) {
      StorageService.savePatientInfo(state.patientInfo);
    }
  }, [state.medications, state.patientInfo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            {[
              { id: 'medications', label: 'Medications', icon: '💊' },
              { id: 'patient', label: 'Patient Info', icon: '👤' },
              { id: 'check', label: 'Safety Check', icon: '🔍' },
              { id: 'results', label: 'Results', icon: '📊' },
              { id: 'data', label: 'Data Management', icon: '💾' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="card">
          {activeTab === 'medications' && (
            <MedicationForm 
              medications={state.medications}
              onAddMedication={addMedication}
            />
          )}
          
          {activeTab === 'patient' && (
            <PatientForm 
              patientInfo={state.patientInfo}
              onUpdatePatientInfo={updatePatientInfo}
            />
          )}
          
          {activeTab === 'check' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety Check</h2>
              <p className="text-gray-600 mb-6">
                Review medications and patient information, then run safety checks for interactions and dosage calculations.
              </p>
              
              <div className="space-y-4">
                <div className="text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-2">Medications ({state.medications.length})</h3>
                  {state.medications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No medications added yet</p>
                  ) : (
                    <ul className="space-y-1">
                      {state.medications.map((med, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {med.name} - {med.dosage} {med.unit}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-2">Patient Info</h3>
                  <p className="text-sm text-gray-600">
                    {state.patientInfo.age > 0 ? `${state.patientInfo.age} years old` : 'Not specified'}
                    {state.patientInfo.weight > 0 && `, ${state.patientInfo.weight}kg`}
                    {state.patientInfo.allergies.length > 0 && `, ${state.patientInfo.allergies.length} allergies`}
                  </p>
                </div>
              </div>
              
              <button
                onClick={runSafetyCheck}
                disabled={state.isLoading || state.medications.length === 0}
                className="mt-6 btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                {state.isLoading ? 'Running Safety Check...' : 'Run Safety Check'}
              </button>
            </div>
          )}
          
          {activeTab === 'results' && (
            <ResultsDisplay 
              interactions={state.interactions}
              dosageCalculations={state.dosageCalculations}
              allergyAlerts={state.allergyAlerts}
              isLoading={state.isLoading}
              error={state.error}
            />
          )}
          
          {activeTab === 'data' && (
            <DataManagement 
              state={state}
              onLoadData={loadData}
              onClearData={clearData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;