import React, { useState } from 'react';
import { Medication } from '../types/medical';
import MedicationSearch from './MedicationSearch';
import { MedicalDataService } from '../services/medicalDataService';

interface MedicationFormProps {
  medications: Medication[];
  onAddMedication: (medication: Medication) => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ medications, onAddMedication }) => {
  const [formData, setFormData] = useState<Partial<Medication>>({
    name: '',
    genericName: '',
    dosage: '',
    unit: 'mg',
    frequency: '',
    route: 'oral',
    form: 'tablet',
    strength: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSearch, setShowSearch] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Medication name is required';
    }
    if (!formData.genericName?.trim()) {
      newErrors.genericName = 'Generic name is required';
    }
    if (!formData.dosage?.trim()) {
      newErrors.dosage = 'Dosage is required';
    }
    if (!formData.frequency?.trim()) {
      newErrors.frequency = 'Frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const medication: Medication = {
      id: Date.now().toString(),
      name: formData.name!,
      genericName: formData.genericName!,
      dosage: formData.dosage!,
      unit: formData.unit!,
      frequency: formData.frequency!,
      route: formData.route!,
      form: formData.form!,
      strength: formData.strength
    };

    onAddMedication(medication);
    
    // Reset form
    setFormData({
      name: '',
      genericName: '',
      dosage: '',
      unit: 'mg',
      frequency: '',
      route: 'oral',
      form: 'tablet',
      strength: undefined
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof Medication, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSearchSelect = (medication: Medication) => {
    setFormData(medication);
    setShowSearch(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
          Add Medication
        </h2>
        <p className="text-slate-600 text-lg">Enter medication details for comprehensive safety checking</p>
      </div>

      {/* Quick Search Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          🔍 Quick Search Medications
        </button>
        <p className="text-center text-sm text-gray-600 mt-2">
          Or fill out the form manually below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medication Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`input-field ${
                errors.name ? 'border-red-500 ring-red-500' : ''
              }`}
              placeholder="e.g., Warfarin"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generic Name *
            </label>
            <input
              type="text"
              value={formData.genericName || ''}
              onChange={(e) => handleInputChange('genericName', e.target.value)}
              className={`input-field ${
                errors.genericName ? 'border-red-500 ring-red-500' : ''
              }`}
              placeholder="e.g., Warfarin sodium"
            />
            {errors.genericName && <p className="mt-1 text-sm text-red-600">{errors.genericName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosage *
            </label>
            <input
              type="text"
              value={formData.dosage || ''}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              className={`input-field ${
                errors.dosage ? 'border-red-500 ring-red-500' : ''
              }`}
              placeholder="e.g., 5"
            />
            {errors.dosage && <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <select
              value={formData.unit || 'mg'}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="input-field"
            >
              <option value="mg">mg</option>
              <option value="ml">ml</option>
              <option value="mcg">mcg</option>
              <option value="g">g</option>
              <option value="units">units</option>
              <option value="tablets">tablets</option>
              <option value="capsules">capsules</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <input
              type="text"
              value={formData.frequency || ''}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              className={`input-field ${
                errors.frequency ? 'border-red-500 ring-red-500' : ''
              }`}
              placeholder="e.g., Once daily"
            />
            {errors.frequency && <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route
            </label>
            <select
              value={formData.route || 'oral'}
              onChange={(e) => handleInputChange('route', e.target.value)}
              className="input-field"
            >
              <option value="oral">Oral</option>
              <option value="injection">Injection</option>
              <option value="topical">Topical</option>
              <option value="inhalation">Inhalation</option>
              <option value="rectal">Rectal</option>
              <option value="vaginal">Vaginal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form
            </label>
            <select
              value={formData.form || 'tablet'}
              onChange={(e) => handleInputChange('form', e.target.value)}
              className="input-field"
            >
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="liquid">Liquid</option>
              <option value="injection">Injection</option>
              <option value="cream">Cream</option>
              <option value="patch">Patch</option>
              <option value="inhaler">Inhaler</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strength (optional)
            </label>
            <input
              type="number"
              value={formData.strength || ''}
              onChange={(e) => handleInputChange('strength', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="e.g., 5"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary"
        >
          Add Medication
        </button>
      </form>

      {/* Current Medications List */}
      {medications.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications ({medications.length})</h3>
          <div className="space-y-2">
            {medications.map((med) => (
              <div key={med.id} className="medication-card">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 text-lg">{med.name}</span>
                    <span className="text-slate-600 ml-2">({med.genericName})</span>
                    <div className="text-sm text-slate-500 mt-1">
                      {med.dosage} {med.unit} • {med.frequency} • {med.route}
                    </div>
                  </div>
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full font-medium">
                    {med.form}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medication Search Modal */}
      {showSearch && (
        <MedicationSearch
          onSelectMedication={handleSearchSelect}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
};

export default MedicationForm;
