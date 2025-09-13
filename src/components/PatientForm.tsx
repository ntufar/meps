import React, { useState } from 'react';
import { PatientInfo } from '../types/medical';
import { AllergyCheckerService } from '../services/allergyChecker';

interface PatientFormProps {
  patientInfo: PatientInfo;
  onUpdatePatientInfo: (patientInfo: PatientInfo) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patientInfo, onUpdatePatientInfo }) => {
  const [formData, setFormData] = useState<PatientInfo>(patientInfo);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleInputChange = (field: keyof PatientInfo, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      const updatedAllergies = [...formData.allergies, newAllergy.trim()];
      handleInputChange('allergies', updatedAllergies);
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    const updatedAllergies = formData.allergies.filter(a => a !== allergy);
    handleInputChange('allergies', updatedAllergies);
  };

  const addCondition = () => {
    if (newCondition.trim() && !formData.medicalConditions.includes(newCondition.trim())) {
      const updatedConditions = [...formData.medicalConditions, newCondition.trim()];
      handleInputChange('medicalConditions', updatedConditions);
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    const updatedConditions = formData.medicalConditions.filter(c => c !== condition);
    handleInputChange('medicalConditions', updatedConditions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePatientInfo(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Information</h2>
        <p className="text-gray-600">Enter patient details for personalized safety checks</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age (years)
            </label>
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight || ''}
              onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height || ''}
              onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex space-x-4">
            {['male', 'female', 'other'].map(gender => (
              <label key={gender} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | 'other')}
                  className="mr-2"
                />
                <span className="capitalize">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pregnancy Status
          </label>
          <select
            value={formData.pregnancyStatus || 'none'}
            onChange={(e) => handleInputChange('pregnancyStatus', e.target.value as 'pregnant' | 'breastfeeding' | 'none')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="none">Not pregnant/breastfeeding</option>
            <option value="pregnant">Pregnant</option>
            <option value="breastfeeding">Breastfeeding</option>
          </select>
        </div>

        {/* Allergies Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          
          {/* Quick Add Common Allergies */}
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Quick add common allergies:</p>
            <div className="flex flex-wrap gap-2">
              {AllergyCheckerService.getCommonAllergies().slice(0, 8).map(allergy => (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => {
                    if (!formData.allergies.includes(allergy)) {
                      const updatedAllergies = [...formData.allergies, allergy];
                      handleInputChange('allergies', updatedAllergies);
                    }
                  }}
                  disabled={formData.allergies.includes(allergy)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    formData.allergies.includes(allergy)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add custom allergy (e.g., Penicillin)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
            />
            <button
              type="button"
              onClick={addAllergy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.allergies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeAllergy(allergy)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Medical Conditions Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Conditions
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Add condition (e.g., Diabetes)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
            />
            <button
              type="button"
              onClick={addCondition}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.medicalConditions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.medicalConditions.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                >
                  {condition}
                  <button
                    type="button"
                    onClick={() => removeCondition(condition)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Save Patient Information
        </button>
      </form>
    </div>
  );
};

export default PatientForm;
