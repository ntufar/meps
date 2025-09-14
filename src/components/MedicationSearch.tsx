import React, { useState, useEffect, useRef } from 'react';
import { Medication } from '../types/medical';
import { MedicalDataService } from '../services/medicalDataService';
import MedicationDetails from './MedicationDetails';

interface MedicationSearchProps {
  onSelectMedication: (medication: Medication) => void;
  onClose: () => void;
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({ onSelectMedication, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medication[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchMedications = async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await MedicalDataService.searchMedications(query);
          setResults(searchResults);
          setShowResults(true);
          setSelectedIndex(0);
        } catch (error) {
          console.error('Error searching medications:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const debounceTimer = setTimeout(searchMedications, 300);
    return () => clearTimeout(debounceTimer);
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

  const handleSelectMedication = (medication: Medication) => {
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
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">⏳</div>
              <p>Searching medications...</p>
            </div>
          ) : showResults && results.length > 0 ? (
            <div className="p-2">
              {results.map((medication, index) => (
                <div
                  key={`${medication.name}-${index}`}
                  className={`p-4 rounded-lg transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Medication Image */}
                    <div className="flex-shrink-0">
                      {medication.image ? (
                        <img
                          src={medication.image}
                          alt={medication.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=' + medication.name.charAt(0);
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-white text-lg font-bold">
                          {medication.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    {/* Medication Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {medication.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {medication.genericName}
                      </p>
                      {medication.category && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium mt-1">
                          {medication.category}
                        </span>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Dosage: {medication.dosage} {medication.unit}</span>
                        <span>Frequency: {medication.frequency}</span>
                        <span>Route: {medication.route}</span>
                      </div>
                      {medication.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {medication.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex flex-col space-y-2">
                      <button
                        onClick={() => setSelectedMedication(medication)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleSelectMedication(medication)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                      >
                        Select
                      </button>
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
      
      {/* Medication Details Modal */}
      {selectedMedication && (
        <MedicationDetails
          medication={selectedMedication}
          onClose={() => setSelectedMedication(null)}
        />
      )}
    </div>
  );
};

export default MedicationSearch;
