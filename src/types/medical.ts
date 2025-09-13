// Core medical data types for MEPS

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  unit: 'mg' | 'ml' | 'mcg' | 'g' | 'units' | 'tablets' | 'capsules';
  frequency: string;
  route: 'oral' | 'injection' | 'topical' | 'inhalation' | 'rectal' | 'vaginal';
  strength?: number;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'patch' | 'inhaler';
}

export interface DrugInteraction {
  id: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  clinicalEffect: string;
  management: string;
  evidence: 'excellent' | 'good' | 'fair' | 'poor';
  references: string[];
}

export interface PatientInfo {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female' | 'other';
  allergies: string[];
  medicalConditions: string[];
  pregnancyStatus?: 'pregnant' | 'breastfeeding' | 'none';
}

export interface DosageCalculation {
  medication: Medication;
  patientInfo: PatientInfo;
  calculatedDose: number;
  unit: string;
  frequency: string;
  maxDailyDose: number;
  warnings: string[];
  adjustments: string[];
}

export interface AllergyAlert {
  medication: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction: string;
  alternative: string;
  action: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  type: 'poison-control' | 'emergency' | 'pharmacy' | 'hospital';
  available24h: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: 'interaction-check' | 'dosage-calculation' | 'allergy-check' | 'emergency-call';
  medications: string[];
  patientInfo?: PatientInfo;
  result: any;
  userId?: string;
}

export interface MEPSState {
  medications: Medication[];
  patientInfo: PatientInfo;
  interactions: DrugInteraction[];
  dosageCalculations: DosageCalculation[];
  allergyAlerts: AllergyAlert[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: string | null;
}
