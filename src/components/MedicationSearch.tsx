import React, { useState, useEffect, useRef } from 'react';
import { Medication } from '../types/medical';
import { MedicationSearchService, MedicationOption } from '../services/medicationDatabase';

interface MedicationSearchProps {
  onSelectMedication: (medication: Medication) => void;
  onClose: () => void;
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({ onSelectMedication, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MedicationOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = MedicationSearchService.searchMedications(query);
      setResults(searchResults);
      setShowResults(true);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectMedication(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleSelectMedication = (medicationOption: MedicationOption) => {
    const medication: Medication = {
      id: Date.now().toString(),
      name: medicationOption.name,
      genericName: medicationOption.genericName,
      dosage: medicationOption.commonDosages[0] || '10mg',
      unit: 'mg',
      frequency: 'Once daily',
      route: 'oral',
      form: medicationOption.forms[0] as any || 'tablet',
      strength: parseInt(medicationOption.commonDosages[0]?.replace(/\D/g, '') || '10')
    };

    onSelectMedication(medication);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Search Medications</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search by medication name, generic name, or category..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {showResults && results.length > 0 ? (
            <div className="p-2">
              {results.map((medication, index) => (
                <div
                  key={`${medication.name}-${index}`}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                  onClick={() => handleSelectMedication(medication)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {medication.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {medication.genericName}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {medication.category}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        {medication.description}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-xs text-gray-500 mb-1">Common Dosages:</div>
                      <div className="flex flex-wrap gap-1">
                        {medication.commonDosages.slice(0, 3).map((dosage, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {dosage}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : showResults && query.length >= 2 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No medications found for "{query}"</p>
              <p className="text-sm mt-2">Try searching with a different term</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">💊</div>
              <p>Start typing to search medications</p>
              <p className="text-sm mt-2">Search by name, generic name, or category</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Use ↑↓ arrows to navigate, Enter to select, Esc to close
            </div>
            <div>
              {results.length > 0 && `${results.length} results`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationSearch;
