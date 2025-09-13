import { useState } from 'react';
import { MEPSState, Medication, PatientInfo, DrugInteraction, DosageCalculation } from './types/medical';
import MedicationForm from './components/MedicationForm';
import PatientForm from './components/PatientForm';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';

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
  const [activeTab, setActiveTab] = useState<'medications' | 'patient' | 'check' | 'results'>('medications');

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
      
      // Mock interaction data for demonstration
      const mockInteractions: DrugInteraction[] = [
        {
          id: '1',
          severity: 'moderate',
          description: 'Warfarin and Aspirin',
          clinicalEffect: 'Increased bleeding risk',
          management: 'Monitor INR closely, consider lower aspirin dose',
          evidence: 'good',
          references: ['Drug Interaction Database 2024']
        }
      ];

      setState(prev => ({
        ...prev,
        interactions: mockInteractions,
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
      
      // Mock dosage calculations
      const mockCalculations: DosageCalculation[] = state.medications.map(med => ({
        medication: med,
        patientInfo: state.patientInfo,
        calculatedDose: 10, // Mock calculation
        unit: med.unit,
        frequency: med.frequency,
        maxDailyDose: 40,
        warnings: ['Monitor for side effects'],
        adjustments: ['Consider renal function']
      }));

      setState(prev => ({
        ...prev,
        dosageCalculations: mockCalculations,
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

  const runSafetyCheck = async () => {
    await Promise.all([checkInteractions(), calculateDosages()]);
    setActiveTab('results');
  };

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
              { id: 'results', label: 'Results', icon: '📊' }
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
              isLoading={state.isLoading}
              error={state.error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;