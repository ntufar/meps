// Drug interaction database and checking service
import { DrugInteraction, Medication } from '../types/medical';

export interface InteractionRule {
  medications: string[];
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  clinicalEffect: string;
  management: string;
  evidence: 'excellent' | 'good' | 'fair' | 'poor';
  references: string[];
}

// Comprehensive drug interaction database
const INTERACTION_DATABASE: InteractionRule[] = [
  // Wellbutrin interactions
  {
    medications: ['wellbutrin', 'strattera'],
    severity: 'major',
    description: 'Wellbutrin (Bupropion) and Strattera (Atomoxetine)',
    clinicalEffect: 'Increased risk of seizures, hypertension, and cardiovascular events',
    management: 'Monitor blood pressure and heart rate closely. Consider alternative treatments or lower doses.',
    evidence: 'excellent',
    references: ['FDA Drug Interaction Database', 'Clinical Pharmacology 2024']
  },
  {
    medications: ['wellbutrin', 'prozac'],
    severity: 'moderate',
    description: 'Wellbutrin (Bupropion) and Prozac (Fluoxetine)',
    clinicalEffect: 'Increased risk of seizures and serotonin syndrome',
    management: 'Monitor for seizure activity and serotonin syndrome symptoms. Consider dose reduction.',
    evidence: 'good',
    references: ['Drug Interaction Database 2024']
  },
  {
    medications: ['wellbutrin', 'alcohol'],
    severity: 'major',
    description: 'Wellbutrin (Bupropion) and Alcohol',
    clinicalEffect: 'Increased risk of seizures and central nervous system depression',
    management: 'Avoid alcohol consumption. If unavoidable, monitor closely for seizure activity.',
    evidence: 'excellent',
    references: ['FDA Labeling', 'Clinical Guidelines']
  },

  // Warfarin interactions
  {
    medications: ['warfarin', 'aspirin'],
    severity: 'moderate',
    description: 'Warfarin and Aspirin',
    clinicalEffect: 'Increased bleeding risk due to additive anticoagulant effects',
    management: 'Monitor INR closely, consider lower aspirin dose or alternative pain management',
    evidence: 'excellent',
    references: ['Anticoagulation Guidelines 2024']
  },
  {
    medications: ['warfarin', 'ibuprofen'],
    severity: 'moderate',
    description: 'Warfarin and Ibuprofen',
    clinicalEffect: 'Increased bleeding risk and potential for gastrointestinal bleeding',
    management: 'Monitor INR and watch for signs of bleeding. Consider acetaminophen instead.',
    evidence: 'good',
    references: ['Drug Interaction Database 2024']
  },
  {
    medications: ['warfarin', 'vitamin-k'],
    severity: 'moderate',
    description: 'Warfarin and Vitamin K',
    clinicalEffect: 'Decreased anticoagulant effect of warfarin',
    management: 'Maintain consistent vitamin K intake. Monitor INR more frequently if diet changes.',
    evidence: 'excellent',
    references: ['Anticoagulation Guidelines 2024']
  },

  // SSRI interactions
  {
    medications: ['prozac', 'zoloft'],
    severity: 'moderate',
    description: 'Prozac (Fluoxetine) and Zoloft (Sertraline)',
    clinicalEffect: 'Increased risk of serotonin syndrome',
    management: 'Monitor for serotonin syndrome symptoms. Consider alternative treatment.',
    evidence: 'good',
    references: ['SSRI Interaction Guidelines']
  },
  {
    medications: ['prozac', 'maoi'],
    severity: 'contraindicated',
    description: 'Prozac (Fluoxetine) and MAOIs',
    clinicalEffect: 'Life-threatening serotonin syndrome',
    management: 'CONTRAINDICATED - Do not use together. Wait 14 days between treatments.',
    evidence: 'excellent',
    references: ['FDA Black Box Warning']
  },

  // Blood pressure medications
  {
    medications: ['lisinopril', 'potassium'],
    severity: 'moderate',
    description: 'Lisinopril and Potassium Supplements',
    clinicalEffect: 'Risk of hyperkalemia (high potassium levels)',
    management: 'Monitor potassium levels regularly. Avoid high-potassium foods.',
    evidence: 'good',
    references: ['Hypertension Guidelines 2024']
  },
  {
    medications: ['metformin', 'contrast'],
    severity: 'moderate',
    description: 'Metformin and Contrast Dye',
    clinicalEffect: 'Risk of lactic acidosis with contrast imaging',
    management: 'Hold metformin 48 hours before and after contrast procedures.',
    evidence: 'excellent',
    references: ['Radiology Safety Guidelines']
  },

  // Pain medication interactions
  {
    medications: ['morphine', 'alcohol'],
    severity: 'major',
    description: 'Morphine and Alcohol',
    clinicalEffect: 'Severe respiratory depression and central nervous system depression',
    management: 'CONTRAINDICATED - Do not use together. Monitor respiratory status closely.',
    evidence: 'excellent',
    references: ['FDA Black Box Warning']
  },
  {
    medications: ['acetaminophen', 'alcohol'],
    severity: 'moderate',
    description: 'Acetaminophen and Alcohol',
    clinicalEffect: 'Increased risk of liver damage',
    management: 'Limit alcohol consumption. Monitor liver function tests.',
    evidence: 'good',
    references: ['Hepatology Guidelines']
  }
];

export class DrugInteractionService {
  static checkInteractions(medications: Medication[]): DrugInteraction[] {
    const interactions: DrugInteraction[] = [];
    const medicationNames = medications.map(med => med.name.toLowerCase());
    
    // Check each interaction rule
    INTERACTION_DATABASE.forEach(rule => {
      const hasAllMedications = rule.medications.every(medName => 
        medicationNames.some(med => med.includes(medName))
      );
      
      if (hasAllMedications) {
        interactions.push({
          id: `interaction-${rule.medications.join('-')}`,
          severity: rule.severity,
          description: rule.description,
          clinicalEffect: rule.clinicalEffect,
          management: rule.management,
          evidence: rule.evidence,
          references: rule.references
        });
      }
    });

    // Check for generic interactions if no specific ones found
    if (interactions.length === 0 && medications.length >= 2) {
      const med1 = medications[0];
      const med2 = medications[1];
      interactions.push({
        id: 'generic-interaction',
        severity: 'minor',
        description: `${med1.name} and ${med2.name}`,
        clinicalEffect: 'Potential interaction - consult pharmacist or physician',
        management: 'Monitor for unusual side effects, consider timing of doses',
        evidence: 'poor',
        references: ['General Drug Interaction Guidelines']
      });
    }

    return interactions;
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'contraindicated':
        return 'severity-critical';
      case 'major':
        return 'severity-major';
      case 'moderate':
        return 'severity-moderate';
      case 'minor':
        return 'severity-minor';
      default:
        return 'severity-minor';
    }
  }

  static getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'contraindicated':
        return '🚫';
      case 'major':
        return '⚠️';
      case 'moderate':
        return '⚡';
      case 'minor':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  }
}
