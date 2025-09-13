// Dosage calculation service
import { DosageCalculation, Medication, PatientInfo } from '../types/medical';

export interface DosageRule {
  medication: string;
  baseDose: number;
  unit: string;
  maxDailyDose: number;
  weightBased: boolean;
  ageAdjustment: boolean;
  renalAdjustment: boolean;
  hepaticAdjustment: boolean;
  warnings: string[];
  contraindications: string[];
}

// Medication-specific dosage rules
const DOSAGE_RULES: DosageRule[] = [
  {
    medication: 'wellbutrin',
    baseDose: 150,
    unit: 'mg',
    maxDailyDose: 450,
    weightBased: false,
    ageAdjustment: true,
    renalAdjustment: true,
    hepaticAdjustment: true,
    warnings: ['Monitor for seizures', 'Avoid in eating disorders', 'May cause insomnia'],
    contraindications: ['Seizure disorder', 'Eating disorders', 'MAOI use']
  },
  {
    medication: 'strattera',
    baseDose: 40,
    unit: 'mg',
    maxDailyDose: 100,
    weightBased: true,
    ageAdjustment: true,
    renalAdjustment: true,
    hepaticAdjustment: true,
    warnings: ['Monitor blood pressure', 'Monitor heart rate', 'May cause liver problems'],
    contraindications: ['Narrow-angle glaucoma', 'MAOI use', 'Severe hepatic impairment']
  },
  {
    medication: 'warfarin',
    baseDose: 5,
    unit: 'mg',
    maxDailyDose: 20,
    weightBased: true,
    ageAdjustment: true,
    renalAdjustment: false,
    hepaticAdjustment: true,
    warnings: ['Monitor INR regularly', 'Watch for bleeding signs', 'Avoid vitamin K changes'],
    contraindications: ['Active bleeding', 'Severe liver disease', 'Pregnancy']
  },
  {
    medication: 'metformin',
    baseDose: 500,
    unit: 'mg',
    maxDailyDose: 2550,
    weightBased: false,
    ageAdjustment: true,
    renalAdjustment: true,
    hepaticAdjustment: true,
    warnings: ['Monitor kidney function', 'Watch for lactic acidosis', 'Hold before contrast'],
    contraindications: ['Severe renal impairment', 'Severe hepatic impairment', 'Contrast procedures']
  },
  {
    medication: 'lisinopril',
    baseDose: 10,
    unit: 'mg',
    maxDailyDose: 40,
    weightBased: false,
    ageAdjustment: true,
    renalAdjustment: true,
    hepaticAdjustment: false,
    warnings: ['Monitor blood pressure', 'Watch for cough', 'Monitor potassium levels'],
    contraindications: ['Pregnancy', 'Bilateral renal artery stenosis', 'Angioedema history']
  }
];

export class DosageCalculatorService {
  static calculateDosage(medication: Medication, patient: PatientInfo): DosageCalculation {
    const rule = this.findDosageRule(medication.name);
    const warnings: string[] = [];
    const adjustments: string[] = [];
    
    // Base calculation
    let calculatedDose = rule?.baseDose || medication.strength || 10;
    
    // Weight-based adjustment
    if (rule?.weightBased && patient.weight > 0) {
      const weightFactor = patient.weight / 70; // Standard adult weight
      calculatedDose = calculatedDose * weightFactor;
      adjustments.push('Dose adjusted for patient weight');
    }
    
    // Age adjustment
    if (rule?.ageAdjustment) {
      if (patient.age > 65) {
        calculatedDose = calculatedDose * 0.8;
        adjustments.push('Reduced dose for elderly patient');
        warnings.push('Monitor for increased sensitivity in elderly');
      } else if (patient.age < 18) {
        calculatedDose = calculatedDose * 0.7;
        adjustments.push('Pediatric dosing adjustment');
        warnings.push('Pediatric dosing - monitor closely');
      }
    }
    
    // Renal adjustment (simplified)
    if (rule?.renalAdjustment) {
      // Simulate creatinine clearance calculation
      const estimatedCrCl = this.estimateCreatinineClearance(patient);
      if (estimatedCrCl < 30) {
        calculatedDose = calculatedDose * 0.5;
        adjustments.push('Reduced dose for renal impairment');
        warnings.push('Severe renal impairment - monitor kidney function');
      } else if (estimatedCrCl < 60) {
        calculatedDose = calculatedDose * 0.75;
        adjustments.push('Moderate dose reduction for renal function');
        warnings.push('Moderate renal impairment - monitor kidney function');
      }
    }
    
    // Round to appropriate precision
    calculatedDose = Math.round(calculatedDose * 10) / 10;
    
    // Add medication-specific warnings
    if (rule) {
      warnings.push(...rule.warnings);
      
      // Check contraindications
      rule.contraindications.forEach(contraindication => {
        if (this.hasContraindication(patient, contraindication)) {
          warnings.push(`WARNING: ${contraindication} - consider alternative`);
        }
      });
    }
    
    // Patient-specific warnings
    if (patient.pregnancyStatus === 'pregnant') {
      warnings.push('Pregnancy - consult obstetrician');
      adjustments.push('Consider pregnancy-safe alternatives');
    }
    
    if (patient.pregnancyStatus === 'breastfeeding') {
      warnings.push('Breastfeeding - consider infant safety');
      adjustments.push('Monitor infant for side effects');
    }
    
    // Allergy warnings
    if (this.hasAllergy(patient, medication)) {
      warnings.push('ALLERGY ALERT - Do not administer');
      adjustments.push('Use alternative medication');
    }
    
    return {
      medication,
      patientInfo: patient,
      calculatedDose,
      unit: rule?.unit || medication.unit,
      frequency: medication.frequency,
      maxDailyDose: rule?.maxDailyDose || calculatedDose * 3,
      warnings: warnings.length > 0 ? warnings : ['Monitor for side effects'],
      adjustments: adjustments.length > 0 ? adjustments : ['Consider individual patient factors']
    };
  }
  
  private static findDosageRule(medicationName: string): DosageRule | undefined {
    return DOSAGE_RULES.find(rule => 
      medicationName.toLowerCase().includes(rule.medication.toLowerCase())
    );
  }
  
  private static estimateCreatinineClearance(patient: PatientInfo): number {
    // Simplified Cockcroft-Gault equation
    const age = patient.age;
    const weight = patient.weight;
    const gender = patient.gender === 'male' ? 1 : 0.85;
    
    // Assume normal creatinine for calculation (1.0 mg/dL)
    const creatinine = 1.0;
    
    return ((140 - age) * weight * gender) / (72 * creatinine);
  }
  
  private static hasContraindication(patient: PatientInfo, contraindication: string): boolean {
    const conditions = patient.medicalConditions.map(c => c.toLowerCase());
    return conditions.some(condition => 
      condition.includes(contraindication.toLowerCase()) ||
      contraindication.toLowerCase().includes(condition)
    );
  }
  
  private static hasAllergy(patient: PatientInfo, medication: Medication): boolean {
    const allergies = patient.allergies.map(a => a.toLowerCase());
    const medNames = [medication.name.toLowerCase(), medication.genericName.toLowerCase()];
    
    return allergies.some(allergy => 
      medNames.some(medName => 
        medName.includes(allergy) || allergy.includes(medName)
      )
    );
  }
}
