import React, { useState, useEffect, useRef } from 'react';
import { Medication } from '../types/medical';
import { MedicalDataService } from '../services/medicalDataService';
import { OnlineMedicationService } from '../services/onlineMedicationService';
import MedicationDetails from './MedicationDetails';

interface MobileMedicationSearchProps {
  onSelectMedication: (medication: Medication) => void;
  onClose: () => void;
}

const MobileMedicationSearch: React.FC<MobileMedicationSearchProps> = ({ 
  onSelectMedication, 
  onClose 
}) => {
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
          // Search both local database and online APIs
          const [localResults, onlineResults] = await Promise.all([
            MedicalDataService.searchMedications(query),
            OnlineMedicationService.searchMedications(query)
          ]);
          
          // Combine results, prioritizing local results first
          const combinedResults = [...localResults, ...onlineResults];
          
          // Remove duplicates based on medication name
          const uniqueResults = combinedResults.reduce((acc, current) => {
            const exists = acc.find(med => 
              med.name.toLowerCase() === current.name.toLowerCase()
            );
            if (!exists) {
              acc.push(current);
            } else if (current.description && (!exists.description || exists.description.length < current.description.length)) {
              // Replace with more detailed version
              const index = acc.findIndex(med => med.name.toLowerCase() === current.name.toLowerCase());
              acc[index] = current;
            }
            return acc;
          }, [] as Medication[]);
          
          setResults(uniqueResults);
          setShowResults(true);
          setSelectedIndex(0);
        } catch (error) {
          console.error('Error searching medications:', error);
          // Fallback to local search only
          try {
            const localResults = await MedicalDataService.searchMedications(query);
            setResults(localResults);
            setShowResults(true);
            setSelectedIndex(0);
          } catch (fallbackError) {
            console.error('Fallback search failed:', fallbackError);
            setResults([]);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const debounceTimer = setTimeout(searchMedications, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectMedication(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelectMedication = (medication: Medication) => {
    onSelectMedication(medication);
    onClose();
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="mobile-search md:hidden"
      onClick={handleClickOutside}
    >
      <div className="mobile-modal-content">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Search Medications</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl p-2"
            >
              ×
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search medications..."
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
            <div className="absolute right-3 top-4 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">⏳</div>
              <p>Searching medications...</p>
              <p className="text-sm mt-2 text-gray-400">This may take a moment</p>
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
                  <div className="flex items-start space-x-3">
                    {/* Medication Image */}
                    <div className="flex-shrink-0">
                      {medication.image ? (
                        <img
                          src={medication.image}
                          alt={medication.name}
                          className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200"
                          onError={(e) => {
                            // Generate a data URI fallback
                            const firstLetter = medication.name.charAt(0).toUpperCase();
                            const svg = `<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                              <rect width="48" height="48" fill="#4F46E5"/>
                              <text x="24" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
                            </svg>`;
                            e.currentTarget.src = `data:image/svg+xml;base64,${btoa(svg)}`;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-white text-sm font-bold">
                          {medication.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    {/* Medication Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {medication.name}
                        </h3>
                        {medication.id.startsWith('fda-') || medication.id.startsWith('rxnorm-') ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium flex items-center gap-1">
                            🌐
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium flex items-center gap-1">
                            💾
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        {medication.genericName}
                      </p>
                      {medication.category && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium mb-2">
                          {medication.category}
                        </span>
                      )}
                      <div className="text-xs text-gray-500 mb-2">
                        {medication.dosage} {medication.unit} • {medication.frequency}
                      </div>
                      {medication.description && (
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {medication.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex flex-col space-y-2">
                      <button
                        onClick={() => setSelectedMedication(medication)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleSelectMedication(medication)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : showResults && results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No medications found</p>
              <p className="text-sm mt-2 text-gray-400">Try a different search term</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">💊</div>
              <p>Search for medications</p>
              <p className="text-sm mt-2 text-gray-400">Type at least 2 characters</p>
            </div>
          )}
        </div>
      </div>

      {/* Medication Details Modal */}
      {selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <MedicationDetails 
              medication={selectedMedication} 
              onClose={() => setSelectedMedication(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMedicationSearch;
