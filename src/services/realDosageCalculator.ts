// Real medical dosage calculation service with evidence-based algorithms
import { Medication, PatientInfo, DosageCalculation } from '../types/medical';

export class RealDosageCalculatorService {
  // Calculate creatinine clearance using Cockcroft-Gault equation
  private static calculateCreatinineClearance(patient: PatientInfo, serumCreatinine: number = 1.0): number {
    const age = patient.age;
    const weight = patient.weight;
    const gender = patient.gender;
    
    // Cockcroft-Gault equation
    let crCl = ((140 - age) * weight) / (72 * serumCreatinine);
    
    // Adjust for gender (multiply by 0.85 for females)
    if (gender === 'female') {
      crCl *= 0.85;
    }
    
    return Math.round(crCl);
  }


  // Calculate body surface area using Mosteller formula
  private static calculateBSA(patient: PatientInfo): number {
    const height = patient.height;
    const weight = patient.weight;
    return Math.sqrt((height * weight) / 3600);
  }

  // Calculate pediatric dose using weight-based dosing
  private static calculatePediatricDose(medication: Medication, patient: PatientInfo): DosageCalculation {
    const age = patient.age;
    const weight = patient.weight;
    
    // Pediatric dosing guidelines (mg/kg/day)
    const pediatricDoses: { [key: string]: number } = {
      'Amoxicillin': 25, // mg/kg/day divided into 3 doses
      'Azithromycin': 10, // mg/kg/day
      'Acetaminophen': 15, // mg/kg every 6 hours
      'Ibuprofen': 10, // mg/kg every 6 hours
      'Metformin': 500, // mg/day (not weight-based for children)
      'Sertraline': 25, // mg/day starting dose
      'Bupropion': 1.4, // mg/kg/day
      'Atomoxetine': 0.5 // mg/kg/day
    };

    const dailyDosePerKg = pediatricDoses[medication.name] || 0;
    const dailyDose = dailyDosePerKg * weight;
    const singleDose = dailyDose / (medication.frequency.includes('twice') ? 2 : 
                                   medication.frequency.includes('three') ? 3 : 1);

    return {
      medication,
      calculatedDose: Math.round(singleDose),
      unit: medication.unit,
      frequency: medication.frequency,
      totalDailyDose: Math.round(dailyDose),
      warnings: this.getPediatricWarnings(medication, age),
      notes: `Pediatric dosing based on weight: ${weight}kg`,
      adjustments: this.getPediatricAdjustments(age, weight)
    };
  }

  // Calculate geriatric dose with age-related adjustments
  private static calculateGeriatricDose(medication: Medication, patient: PatientInfo): DosageCalculation {
    const crCl = this.calculateCreatinineClearance(patient);
    
    // Age-related dose reductions
    const ageAdjustments: { [key: string]: number } = {
      'Warfarin': 0.8, // 20% reduction
      'Morphine': 0.5, // 50% reduction
      'Metoprolol': 0.75, // 25% reduction
      'Sertraline': 0.5, // 50% reduction
      'Bupropion': 0.75 // 25% reduction
    };

    const adjustment = ageAdjustments[medication.name] || 1.0;
    const baseDose = medication.strength || 0;
    const adjustedDose = baseDose * adjustment;

    return {
      medication,
      calculatedDose: Math.round(adjustedDose),
      unit: medication.unit,
      frequency: medication.frequency,
      totalDailyDose: Math.round(adjustedDose * (medication.frequency.includes('twice') ? 2 : 1)),
      warnings: this.getGeriatricWarnings(medication, crCl),
      notes: `Geriatric dosing with age-related adjustments`,
      adjustments: this.getGeriatricAdjustments(crCl)
    };
  }

  // Calculate renal dose adjustments
  private static calculateRenalDose(medication: Medication, patient: PatientInfo): DosageCalculation {
    const crCl = this.calculateCreatinineClearance(patient);
    const baseDose = medication.strength || 0;
    
    // Renal dose adjustments based on creatinine clearance
    let doseAdjustment = 1.0;
    
    if (crCl < 30) {
      // Severe renal impairment
      doseAdjustment = 0.5;
    } else if (crCl < 60) {
      // Moderate renal impairment
      doseAdjustment = 0.75;
    } else if (crCl < 90) {
      // Mild renal impairment
      doseAdjustment = 0.9;
    }

    const adjustedDose = baseDose * doseAdjustment;
    const adjustedFrequency = medication.frequency;

    return {
      medication,
      calculatedDose: Math.round(adjustedDose),
      unit: medication.unit,
      frequency: adjustedFrequency,
      totalDailyDose: Math.round(adjustedDose * (medication.frequency.includes('twice') ? 2 : 1)),
      warnings: this.getRenalWarnings(medication, crCl),
      notes: `Renal dosing adjustment for CrCl: ${crCl} mL/min`,
      adjustments: this.getRenalAdjustments(crCl)
    };
  }

  // Main dosage calculation method
  static calculateDosage(medication: Medication, patient: PatientInfo): DosageCalculation {
    const age = patient.age;
    const crCl = this.calculateCreatinineClearance(patient);
    
    // Determine calculation method based on patient characteristics
    if (age < 18) {
      return this.calculatePediatricDose(medication, patient);
    } else if (age >= 65) {
      return this.calculateGeriatricDose(medication, patient);
    } else if (crCl < 60) {
      return this.calculateRenalDose(medication, patient);
    } else {
      // Standard adult dosing
      return this.calculateStandardDose(medication, patient);
    }
  }

  // Calculate standard adult dose
  private static calculateStandardDose(medication: Medication, patient: PatientInfo): DosageCalculation {
    const baseDose = medication.strength || 0;
    const bsa = this.calculateBSA(patient);
    
    // BSA-based dosing for certain medications
    const bsaBasedMedications = ['Morphine', 'Insulin Glargine'];
    let calculatedDose = baseDose;
    
    if (bsaBasedMedications.includes(medication.name)) {
      calculatedDose = baseDose * bsa;
    }

    return {
      medication,
      calculatedDose: Math.round(calculatedDose),
      unit: medication.unit,
      frequency: medication.frequency,
      totalDailyDose: Math.round(calculatedDose * (medication.frequency.includes('twice') ? 2 : 1)),
      warnings: this.getStandardWarnings(medication, patient),
      notes: 'Standard adult dosing',
      adjustments: this.getStandardAdjustments(medication, patient)
    };
  }

  // Warning messages
  private static getPediatricWarnings(medication: Medication, age: number): string[] {
    const warnings: string[] = [];
    
    if (age < 2 && medication.name === 'Aspirin') {
      warnings.push('Avoid aspirin in children under 2 years due to Reye syndrome risk');
    }
    
    if (age < 18 && medication.name === 'Bupropion') {
      warnings.push('Monitor for suicidal ideation in pediatric patients');
    }
    
    if (age < 6 && medication.name === 'Atomoxetine') {
      warnings.push('Use with caution in children under 6 years');
    }
    
    return warnings;
  }

  private static getGeriatricWarnings(medication: Medication, crCl: number): string[] {
    const warnings: string[] = [];
    
    if (medication.name === 'Warfarin') {
      warnings.push('Increased bleeding risk in elderly patients');
    }
    
    if (medication.name === 'Morphine') {
      warnings.push('Increased sensitivity to opioids in elderly');
    }
    
    if (crCl < 30) {
      warnings.push('Severe renal impairment - consider dose reduction');
    }
    
    return warnings;
  }

  private static getRenalWarnings(medication: Medication, crCl: number): string[] {
    const warnings: string[] = [];
    
    if (crCl < 30) {
      warnings.push('Severe renal impairment - avoid or use with extreme caution');
    } else if (crCl < 60) {
      warnings.push('Moderate renal impairment - dose adjustment required');
    }
    
    if (medication.name === 'Metformin' && crCl < 30) {
      warnings.push('Metformin contraindicated with severe renal impairment');
    }
    
    return warnings;
  }

  private static getStandardWarnings(medication: Medication, patient: PatientInfo): string[] {
    const warnings: string[] = [];
    
    if (patient.pregnancyStatus === 'pregnant' && medication.name === 'Warfarin') {
      warnings.push('Warfarin contraindicated in pregnancy');
    }
    
    if (patient.allergies.includes(medication.name)) {
      warnings.push(`Patient has known allergy to ${medication.name}`);
    }
    
    return warnings;
  }

  // Adjustment recommendations
  private static getPediatricAdjustments(age: number, weight: number): string[] {
    const adjustments: string[] = [];
    
    if (age < 2) {
      adjustments.push('Consider liquid formulation for easier administration');
    }
    
    if (weight < 20) {
      adjustments.push('Monitor closely for adverse effects due to low body weight');
    }
    
    return adjustments;
  }

  private static getGeriatricAdjustments(crCl: number): string[] {
    const adjustments: string[] = [];
    
    adjustments.push('Start with lowest effective dose');
    adjustments.push('Monitor for adverse effects closely');
    
    if (crCl < 60) {
      adjustments.push('Consider renal dose adjustment');
    }
    
    return adjustments;
  }

  private static getRenalAdjustments(crCl: number): string[] {
    const adjustments: string[] = [];
    
    if (crCl < 30) {
      adjustments.push('Consider alternative medication with better renal profile');
    }
    
    adjustments.push('Monitor renal function regularly');
    
    return adjustments;
  }

  private static getStandardAdjustments(medication: Medication, patient: PatientInfo): string[] {
    const adjustments: string[] = [];
    
    if (patient.pregnancyStatus === 'pregnant') {
      adjustments.push('Consider pregnancy category and potential risks');
    }
    
    if (patient.medicalConditions.includes('diabetes') && medication.name === 'Prednisone') {
      adjustments.push('Monitor blood glucose closely - may cause hyperglycemia');
    }
    
    return adjustments;
  }

  // Calculate maximum daily dose
  static calculateMaxDailyDose(medication: Medication): number {
    const maxDoses: { [key: string]: number } = {
      'Acetaminophen': 4000, // mg/day
      'Ibuprofen': 2400, // mg/day
      'Aspirin': 4000, // mg/day
      'Morphine': 200, // mg/day
      'Metformin': 2000, // mg/day
      'Sertraline': 200, // mg/day
      'Bupropion': 450, // mg/day
      'Atomoxetine': 100 // mg/day
    };

    return maxDoses[medication.name] || 0;
  }

  // Check for dose-related contraindications
  static checkDoseContraindications(medication: Medication, patient: PatientInfo): string[] {
    const contraindications: string[] = [];
    const crCl = this.calculateCreatinineClearance(patient);
    
    if (medication.name === 'Metformin' && crCl < 30) {
      contraindications.push('Metformin contraindicated with severe renal impairment');
    }
    
    if (medication.name === 'Morphine' && patient.medicalConditions.includes('severe asthma')) {
      contraindications.push('Morphine contraindicated with severe asthma');
    }
    
    return contraindications;
  }
}
