// Allergy checking service
import { Medication, PatientInfo, AllergyAlert } from '../types/medical';

export interface AllergyRule {
  allergen: string;
  crossReactive: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction: string;
  alternatives: string[];
  action: string;
}

// Comprehensive allergy database
const ALLERGY_DATABASE: AllergyRule[] = [
  // Penicillin allergies
  {
    allergen: 'penicillin',
    crossReactive: ['amoxicillin', 'ampicillin', 'cephalexin', 'cefazolin', 'ceftriaxone'],
    severity: 'severe',
    reaction: 'Rash, hives, difficulty breathing, anaphylaxis',
    alternatives: ['azithromycin', 'clindamycin', 'doxycycline', 'vancomycin'],
    action: 'CONTRAINDICATED - Use alternative antibiotic'
  },
  {
    allergen: 'amoxicillin',
    crossReactive: ['penicillin', 'ampicillin', 'cephalexin'],
    severity: 'moderate',
    reaction: 'Rash, hives, gastrointestinal upset',
    alternatives: ['azithromycin', 'clindamycin', 'doxycycline'],
    action: 'Avoid - Use alternative antibiotic'
  },
  {
    allergen: 'cephalexin',
    crossReactive: ['penicillin', 'amoxicillin', 'cefazolin', 'ceftriaxone'],
    severity: 'moderate',
    reaction: 'Rash, hives, gastrointestinal upset',
    alternatives: ['azithromycin', 'clindamycin', 'doxycycline'],
    action: 'Use with caution - Monitor for reactions'
  },

  // Sulfa allergies
  {
    allergen: 'sulfa',
    crossReactive: ['sulfamethoxazole', 'trimethoprim-sulfa', 'sulfasalazine', 'furosemide', 'hydrochlorothiazide'],
    severity: 'severe',
    reaction: 'Stevens-Johnson syndrome, toxic epidermal necrolysis, anaphylaxis',
    alternatives: ['amoxicillin', 'azithromycin', 'doxycycline'],
    action: 'CONTRAINDICATED - Use alternative medication'
  },
  {
    allergen: 'sulfamethoxazole',
    crossReactive: ['sulfa', 'trimethoprim-sulfa', 'sulfasalazine'],
    severity: 'severe',
    reaction: 'Severe skin reactions, blood disorders',
    alternatives: ['amoxicillin', 'azithromycin', 'doxycycline'],
    action: 'CONTRAINDICATED - Use alternative antibiotic'
  },

  // NSAID allergies
  {
    allergen: 'aspirin',
    crossReactive: ['ibuprofen', 'naproxen', 'diclofenac', 'celecoxib'],
    severity: 'moderate',
    reaction: 'Asthma exacerbation, nasal polyps, gastrointestinal bleeding',
    alternatives: ['acetaminophen', 'tramadol', 'codeine'],
    action: 'Avoid NSAIDs - Use acetaminophen for pain'
  },
  {
    allergen: 'ibuprofen',
    crossReactive: ['aspirin', 'naproxen', 'diclofenac', 'celecoxib'],
    severity: 'moderate',
    reaction: 'Gastrointestinal irritation, asthma exacerbation',
    alternatives: ['acetaminophen', 'tramadol', 'codeine'],
    action: 'Avoid NSAIDs - Use acetaminophen for pain'
  },

  // Opioid allergies
  {
    allergen: 'morphine',
    crossReactive: ['codeine', 'hydrocodone', 'oxycodone', 'fentanyl'],
    severity: 'severe',
    reaction: 'Respiratory depression, severe itching, anaphylaxis',
    alternatives: ['acetaminophen', 'tramadol', 'gabapentin'],
    action: 'CONTRAINDICATED - Use alternative pain management'
  },
  {
    allergen: 'codeine',
    crossReactive: ['morphine', 'hydrocodone', 'oxycodone'],
    severity: 'moderate',
    reaction: 'Respiratory depression, severe itching',
    alternatives: ['acetaminophen', 'tramadol', 'gabapentin'],
    action: 'Avoid opioids - Use alternative pain management'
  },

  // Anticonvulsant allergies
  {
    allergen: 'phenytoin',
    crossReactive: ['carbamazepine', 'oxcarbazepine', 'lamotrigine'],
    severity: 'severe',
    reaction: 'Stevens-Johnson syndrome, toxic epidermal necrolysis',
    alternatives: ['valproic acid', 'levetiracetam', 'gabapentin'],
    action: 'CONTRAINDICATED - Use alternative anticonvulsant'
  },
  {
    allergen: 'carbamazepine',
    crossReactive: ['phenytoin', 'oxcarbazepine', 'lamotrigine'],
    severity: 'severe',
    reaction: 'Severe skin reactions, blood disorders',
    alternatives: ['valproic acid', 'levetiracetam', 'gabapentin'],
    action: 'CONTRAINDICATED - Use alternative anticonvulsant'
  },

  // ACE inhibitor allergies
  {
    allergen: 'lisinopril',
    crossReactive: ['enalapril', 'ramipril', 'captopril', 'benazepril'],
    severity: 'moderate',
    reaction: 'Angioedema, persistent cough, hyperkalemia',
    alternatives: ['amlodipine', 'losartan', 'metoprolol'],
    action: 'Avoid ACE inhibitors - Use ARB or calcium channel blocker'
  },

  // Statin allergies
  {
    allergen: 'atorvastatin',
    crossReactive: ['simvastatin', 'lovastatin', 'pravastatin', 'rosuvastatin'],
    severity: 'moderate',
    reaction: 'Muscle pain, liver enzyme elevation, rash',
    alternatives: ['ezetimibe', 'colesevelam', 'niacin'],
    action: 'Avoid statins - Use alternative cholesterol medication'
  }
];

export class AllergyCheckerService {
  static checkAllergies(medications: Medication[], patient: PatientInfo): AllergyAlert[] {
    const alerts: AllergyAlert[] = [];
    
    if (patient.allergies.length === 0) {
      return alerts;
    }

    medications.forEach(medication => {
      const medicationName = medication.name.toLowerCase();
      const genericName = medication.genericName.toLowerCase();
      
      // Check each patient allergy
      patient.allergies.forEach(allergy => {
        const allergyLower = allergy.toLowerCase();
        
        // Find matching allergy rules
        const matchingRules = ALLERGY_DATABASE.filter(rule => 
          this.matchesAllergen(allergyLower, rule.allergen) ||
          this.matchesAllergen(allergyLower, rule.crossReactive)
        );
        
        matchingRules.forEach(rule => {
          // Check if medication matches the allergen or cross-reactive drugs
          const isDirectMatch = this.matchesMedication(medicationName, genericName, rule.allergen);
          const isCrossReactive = rule.crossReactive.some(crossReactive => 
            this.matchesMedication(medicationName, genericName, crossReactive)
          );
          
          if (isDirectMatch || isCrossReactive) {
            alerts.push({
              medication: medication.name,
              allergen: allergy,
              severity: rule.severity,
              reaction: rule.reaction,
              alternative: rule.alternatives.join(', '),
              action: rule.action
            });
          }
        });
      });
    });

    return alerts;
  }

  private static matchesAllergen(allergy: string, allergen: string): boolean {
    return allergy.includes(allergen) || allergen.includes(allergy);
  }

  private static matchesMedication(medName: string, genericName: string, target: string): boolean {
    return medName.includes(target) || genericName.includes(target);
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'life-threatening':
        return 'bg-red-200 text-red-900 border-red-400';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'mild':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  static getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'life-threatening':
        return '🚨';
      case 'severe':
        return '⚠️';
      case 'moderate':
        return '⚡';
      case 'mild':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  }

  static getCommonAllergies(): string[] {
    return [
      'Penicillin',
      'Amoxicillin',
      'Sulfa',
      'Aspirin',
      'Ibuprofen',
      'Morphine',
      'Codeine',
      'Phenytoin',
      'Carbamazepine',
      'Lisinopril',
      'Atorvastatin',
      'Latex',
      'Shellfish',
      'Peanuts',
      'Eggs',
      'Dairy'
    ];
  }
}
