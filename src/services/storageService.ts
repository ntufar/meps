// Local storage service for data persistence
import { PatientInfo, Medication } from '../types/medical';

const STORAGE_KEYS = {
  PATIENT_INFO: 'meps_patient_info',
  MEDICATIONS: 'meps_medications',
  SETTINGS: 'meps_settings'
};

export class StorageService {
  // Patient Info Storage
  static savePatientInfo(patientInfo: PatientInfo): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENT_INFO, JSON.stringify(patientInfo));
    } catch (error) {
      console.error('Failed to save patient info:', error);
    }
  }

  static loadPatientInfo(): PatientInfo | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENT_INFO);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load patient info:', error);
      return null;
    }
  }

  // Medications Storage
  static saveMedications(medications: Medication[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
    } catch (error) {
      console.error('Failed to save medications:', error);
    }
  }

  static loadMedications(): Medication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load medications:', error);
      return [];
    }
  }

  // Settings Storage
  static saveSettings(settings: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static loadSettings(): any {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {};
    }
  }

  // Clear all data
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PATIENT_INFO);
      localStorage.removeItem(STORAGE_KEYS.MEDICATIONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  // Export data
  static exportData(): string {
    const data = {
      patientInfo: this.loadPatientInfo(),
      medications: this.loadMedications(),
      settings: this.loadSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.patientInfo) {
        this.savePatientInfo(data.patientInfo);
      }
      
      if (data.medications) {
        this.saveMedications(data.medications);
      }
      
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Check if data exists
  static hasStoredData(): boolean {
    return !!(localStorage.getItem(STORAGE_KEYS.PATIENT_INFO) || 
              localStorage.getItem(STORAGE_KEYS.MEDICATIONS));
  }
}
