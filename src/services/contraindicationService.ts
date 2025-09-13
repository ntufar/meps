// Comprehensive contraindication checking service
import { Medication, PatientInfo } from '../types/medical';

export interface Contraindication {
  id: string;
  medication: string;
  condition: string;
  severity: 'absolute' | 'relative';
  description: string;
  alternative: string;
  monitoring: string[];
}

export class ContraindicationService {
  // Comprehensive contraindication database
  private static contraindications: Contraindication[] = [
    // Cardiovascular contraindications
    {
      id: 'warfarin-bleeding',
      medication: 'Warfarin',
      condition: 'Active bleeding',
      severity: 'absolute',
      description: 'Warfarin is absolutely contraindicated in patients with active bleeding',
      alternative: 'Consider alternative anticoagulation or delay therapy',
      monitoring: ['INR', 'Hemoglobin', 'Signs of bleeding']
    },
    {
      id: 'warfarin-liver-severe',
      medication: 'Warfarin',
      condition: 'Severe liver disease',
      severity: 'absolute',
      description: 'Severe liver disease impairs warfarin metabolism and increases bleeding risk',
      alternative: 'Consider LMWH or alternative anticoagulation',
      monitoring: ['Liver function tests', 'INR', 'Bleeding signs']
    },
    {
      id: 'aspirin-ulcer',
      medication: 'Aspirin',
      condition: 'Active peptic ulcer disease',
      severity: 'absolute',
      description: 'Aspirin increases risk of gastrointestinal bleeding in active ulcer disease',
      alternative: 'Use acetaminophen for pain/fever, consider PPI if aspirin needed',
      monitoring: ['Hemoglobin', 'Stool occult blood', 'GI symptoms']
    },
    {
      id: 'metoprolol-asthma',
      medication: 'Metoprolol',
      condition: 'Severe asthma',
      severity: 'absolute',
      description: 'Beta-blockers can cause severe bronchospasm in asthma patients',
      alternative: 'Consider calcium channel blockers or ACE inhibitors',
      monitoring: ['Pulmonary function tests', 'Respiratory symptoms']
    },
    {
      id: 'lisinopril-pregnancy',
      medication: 'Lisinopril',
      condition: 'Pregnancy (2nd and 3rd trimester)',
      severity: 'absolute',
      description: 'ACE inhibitors cause fetal malformations and death in 2nd/3rd trimester',
      alternative: 'Use methyldopa, labetalol, or nifedipine',
      monitoring: ['Fetal monitoring', 'Blood pressure', 'Renal function']
    },
    // Antibiotic contraindications
    {
      id: 'amoxicillin-penicillin-allergy',
      medication: 'Amoxicillin',
      condition: 'Penicillin allergy',
      severity: 'absolute',
      description: 'Cross-reactivity between penicillins and cephalosporins',
      alternative: 'Use macrolides, fluoroquinolones, or clindamycin',
      monitoring: ['Allergic reaction signs', 'Skin rash monitoring']
    },
    {
      id: 'ciprofloxacin-tendon',
      medication: 'Ciprofloxacin',
      condition: 'Tendon disorders',
      severity: 'relative',
      description: 'Fluoroquinolones increase risk of tendon rupture',
      alternative: 'Consider alternative antibiotics',
      monitoring: ['Tendon pain', 'Joint swelling', 'Mobility assessment']
    },
    // Pain management contraindications
    {
      id: 'morphine-respiratory',
      medication: 'Morphine',
      condition: 'Respiratory depression',
      severity: 'absolute',
      description: 'Morphine can cause severe respiratory depression',
      alternative: 'Use non-opioid analgesics or lower potency opioids',
      monitoring: ['Respiratory rate', 'Oxygen saturation', 'Consciousness level']
    },
    {
      id: 'ibuprofen-renal-severe',
      medication: 'Ibuprofen',
      condition: 'Severe renal impairment (eGFR < 30)',
      severity: 'absolute',
      description: 'NSAIDs can cause acute kidney injury in severe renal impairment',
      alternative: 'Use acetaminophen or topical analgesics',
      monitoring: ['Renal function', 'Urine output', 'Electrolytes']
    },
    // Mental health contraindications
    {
      id: 'sertraline-maoi',
      medication: 'Sertraline',
      condition: 'MAO inhibitor use',
      severity: 'absolute',
      description: 'Risk of serotonin syndrome with MAO inhibitors',
      alternative: 'Wait 14 days after MAOI discontinuation before starting',
      monitoring: ['Serotonin syndrome signs', 'Blood pressure', 'Temperature']
    },
    {
      id: 'bupropion-seizure',
      medication: 'Bupropion',
      condition: 'Seizure disorder',
      severity: 'absolute',
      description: 'Bupropion lowers seizure threshold',
      alternative: 'Use alternative antidepressants',
      monitoring: ['Seizure activity', 'EEG if indicated']
    },
    // Diabetes contraindications
    {
      id: 'metformin-renal-severe',
      medication: 'Metformin',
      condition: 'Severe renal impairment (eGFR < 30)',
      severity: 'absolute',
      description: 'Risk of lactic acidosis with severe renal impairment',
      alternative: 'Use alternative antidiabetic agents',
      monitoring: ['Renal function', 'Lactate levels', 'Acid-base status']
    },
    {
      id: 'metformin-heart-failure',
      medication: 'Metformin',
      condition: 'Heart failure requiring pharmacologic treatment',
      severity: 'relative',
      description: 'Increased risk of lactic acidosis in heart failure',
      alternative: 'Consider alternative antidiabetic agents',
      monitoring: ['Lactate levels', 'Heart failure symptoms', 'Renal function']
    },
    // Gastrointestinal contraindications
    {
      id: 'omeprazole-magnesium',
      medication: 'Omeprazole',
      condition: 'Severe hypomagnesemia',
      severity: 'relative',
      description: 'PPIs can worsen hypomagnesemia',
      alternative: 'Correct magnesium levels first, consider H2 blockers',
      monitoring: ['Magnesium levels', 'ECG changes', 'Neuromuscular symptoms']
    },
    // Respiratory contraindications
    {
      id: 'albuterol-hypersensitivity',
      medication: 'Albuterol',
      condition: 'Hypersensitivity to beta-agonists',
      severity: 'absolute',
      description: 'Risk of severe allergic reaction',
      alternative: 'Use anticholinergics or corticosteroids',
      monitoring: ['Allergic reaction signs', 'Respiratory status']
    }
  ];

  // Check for contraindications
  static checkContraindications(medications: Medication[], patient: PatientInfo): Contraindication[] {
    const foundContraindications: Contraindication[] = [];
    
    for (const medication of medications) {
      for (const contraindication of this.contraindications) {
        if (contraindication.medication === medication.name) {
          if (this.isConditionPresent(contraindication.condition, patient)) {
            foundContraindications.push(contraindication);
          }
        }
      }
    }
    
    return foundContraindications;
  }

  // Check if a medical condition is present in the patient
  private static isConditionPresent(condition: string, patient: PatientInfo): boolean {
    const conditionLower = condition.toLowerCase();
    const medicalConditions = patient.medicalConditions.map(c => c.toLowerCase());
    const allergies = patient.allergies.map(a => a.toLowerCase());
    
    // Check medical conditions
    for (const condition of medicalConditions) {
      if (this.conditionMatches(conditionLower, condition)) {
        return true;
      }
    }
    
    // Check allergies
    for (const allergy of allergies) {
      if (this.conditionMatches(conditionLower, allergy)) {
        return true;
      }
    }
    
    // Check specific conditions
    if (conditionLower.includes('pregnancy') && patient.pregnancyStatus === 'pregnant') {
      return true;
    }
    
    if (conditionLower.includes('renal') || conditionLower.includes('kidney')) {
      return medicalConditions.some(c => 
        c.includes('kidney') || c.includes('renal') || c.includes('dialysis')
      );
    }
    
    if (conditionLower.includes('liver')) {
      return medicalConditions.some(c => 
        c.includes('liver') || c.includes('hepatic')
      );
    }
    
    if (conditionLower.includes('asthma')) {
      return medicalConditions.some(c => 
        c.includes('asthma') || c.includes('copd')
      );
    }
    
    if (conditionLower.includes('bleeding')) {
      return medicalConditions.some(c => 
        c.includes('bleeding') || c.includes('hemorrhage') || c.includes('coagulation')
      );
    }
    
    if (conditionLower.includes('seizure')) {
      return medicalConditions.some(c => 
        c.includes('seizure') || c.includes('epilepsy')
      );
    }
    
    if (conditionLower.includes('heart failure')) {
      return medicalConditions.some(c => 
        c.includes('heart failure') || c.includes('congestive heart failure')
      );
    }
    
    return false;
  }

  // Check if conditions match (fuzzy matching)
  private static conditionMatches(condition1: string, condition2: string): boolean {
    const words1 = condition1.split(' ');
    const words2 = condition2.split(' ');
    
    return words1.some(word => 
      words2.some(word2 => 
        word2.includes(word) || word.includes(word2)
      )
    );
  }

  // Get contraindications for a specific medication
  static getContraindicationsForMedication(medicationName: string): Contraindication[] {
    return this.contraindications.filter(c => c.medication === medicationName);
  }

  // Get all contraindications
  static getAllContraindications(): Contraindication[] {
    return [...this.contraindications];
  }

  // Check for drug-disease interactions
  static checkDrugDiseaseInteractions(medications: Medication[], patient: PatientInfo): Contraindication[] {
    const interactions: Contraindication[] = [];
    
    // Check each medication against patient conditions
    for (const medication of medications) {
      const medicationContraindications = this.getContraindicationsForMedication(medication.name);
      
      for (const contraindication of medicationContraindications) {
        if (this.isConditionPresent(contraindication.condition, patient)) {
          interactions.push(contraindication);
        }
      }
    }
    
    return interactions;
  }

  // Get severity-based contraindications
  static getContraindicationsBySeverity(medications: Medication[], patient: PatientInfo, severity: 'absolute' | 'relative'): Contraindication[] {
    const allContraindications = this.checkContraindications(medications, patient);
    return allContraindications.filter(c => c.severity === severity);
  }

  // Check for pregnancy-related contraindications
  static checkPregnancyContraindications(medications: Medication[], patient: PatientInfo): Contraindication[] {
    if (patient.pregnancyStatus !== 'pregnant') {
      return [];
    }
    
    const pregnancyContraindications: Contraindication[] = [];
    
    for (const medication of medications) {
      const contraindications = this.getContraindicationsForMedication(medication.name);
      const pregnancyRelated = contraindications.filter(c => 
        c.condition.toLowerCase().includes('pregnancy')
      );
      pregnancyContraindications.push(...pregnancyRelated);
    }
    
    return pregnancyContraindications;
  }

  // Get monitoring recommendations for contraindications
  static getMonitoringRecommendations(contraindications: Contraindication[]): string[] {
    const monitoring: string[] = [];
    
    for (const contraindication of contraindications) {
      monitoring.push(...contraindication.monitoring);
    }
    
    // Remove duplicates
    return [...new Set(monitoring)];
  }

  // Get alternative medications
  static getAlternativeMedications(contraindications: Contraindication[]): string[] {
    const alternatives: string[] = [];
    
    for (const contraindication of contraindications) {
      if (contraindication.alternative) {
        alternatives.push(contraindication.alternative);
      }
    }
    
    return alternatives;
  }

  // Calculate risk score based on contraindications
  static calculateRiskScore(contraindications: Contraindication[]): number {
    let score = 0;
    
    for (const contraindication of contraindications) {
      if (contraindication.severity === 'absolute') {
        score += 10;
      } else if (contraindication.severity === 'relative') {
        score += 5;
      }
    }
    
    return Math.min(score, 100); // Cap at 100
  }

  // Get risk level description
  static getRiskLevel(score: number): string {
    if (score >= 80) {
      return 'Very High Risk';
    } else if (score >= 60) {
      return 'High Risk';
    } else if (score >= 40) {
      return 'Moderate Risk';
    } else if (score >= 20) {
      return 'Low Risk';
    } else {
      return 'Minimal Risk';
    }
  }
}
