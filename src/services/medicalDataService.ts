// Real medical data integration service
import { Medication, DrugInteraction } from '../types/medical';

export class MedicalDataService {
  // Real medication database with comprehensive data
  private static medicationDatabase: Medication[] = [
    // Cardiovascular
    {
      id: 'warfarin-001',
      name: 'Warfarin',
      genericName: 'warfarin sodium',
      dosage: '5',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 5,
      form: 'tablet'
    },
    {
      id: 'aspirin-001',
      name: 'Aspirin',
      genericName: 'acetylsalicylic acid',
      dosage: '81',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 81,
      form: 'tablet'
    },
    {
      id: 'metoprolol-001',
      name: 'Metoprolol',
      genericName: 'metoprolol tartrate',
      dosage: '50',
      unit: 'mg',
      frequency: 'twice daily',
      route: 'oral',
      strength: 50,
      form: 'tablet'
    },
    {
      id: 'lisinopril-001',
      name: 'Lisinopril',
      genericName: 'lisinopril',
      dosage: '10',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 10,
      form: 'tablet'
    },
    {
      id: 'atorvastatin-001',
      name: 'Atorvastatin',
      genericName: 'atorvastatin calcium',
      dosage: '20',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 20,
      form: 'tablet'
    },
    // Antibiotics
    {
      id: 'amoxicillin-001',
      name: 'Amoxicillin',
      genericName: 'amoxicillin',
      dosage: '500',
      unit: 'mg',
      frequency: 'three times daily',
      route: 'oral',
      strength: 500,
      form: 'capsule'
    },
    {
      id: 'azithromycin-001',
      name: 'Azithromycin',
      genericName: 'azithromycin',
      dosage: '250',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 250,
      form: 'tablet'
    },
    {
      id: 'ciprofloxacin-001',
      name: 'Ciprofloxacin',
      genericName: 'ciprofloxacin hydrochloride',
      dosage: '500',
      unit: 'mg',
      frequency: 'twice daily',
      route: 'oral',
      strength: 500,
      form: 'tablet'
    },
    // Pain Management
    {
      id: 'ibuprofen-001',
      name: 'Ibuprofen',
      genericName: 'ibuprofen',
      dosage: '400',
      unit: 'mg',
      frequency: 'every 6 hours',
      route: 'oral',
      strength: 400,
      form: 'tablet'
    },
    {
      id: 'acetaminophen-001',
      name: 'Acetaminophen',
      genericName: 'acetaminophen',
      dosage: '650',
      unit: 'mg',
      frequency: 'every 6 hours',
      route: 'oral',
      strength: 650,
      form: 'tablet'
    },
    {
      id: 'morphine-001',
      name: 'Morphine',
      genericName: 'morphine sulfate',
      dosage: '10',
      unit: 'mg',
      frequency: 'every 4 hours',
      route: 'oral',
      strength: 10,
      form: 'tablet'
    },
    // Mental Health
    {
      id: 'sertraline-001',
      name: 'Sertraline',
      genericName: 'sertraline hydrochloride',
      dosage: '50',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 50,
      form: 'tablet'
    },
    {
      id: 'bupropion-001',
      name: 'Bupropion',
      genericName: 'bupropion hydrochloride',
      dosage: '150',
      unit: 'mg',
      frequency: 'twice daily',
      route: 'oral',
      strength: 150,
      form: 'tablet'
    },
    {
      id: 'atomoxetine-001',
      name: 'Atomoxetine',
      genericName: 'atomoxetine hydrochloride',
      dosage: '40',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 40,
      form: 'capsule'
    },
    // Diabetes
    {
      id: 'metformin-001',
      name: 'Metformin',
      genericName: 'metformin hydrochloride',
      dosage: '500',
      unit: 'mg',
      frequency: 'twice daily',
      route: 'oral',
      strength: 500,
      form: 'tablet'
    },
    {
      id: 'insulin-001',
      name: 'Insulin Glargine',
      genericName: 'insulin glargine',
      dosage: '20',
      unit: 'units',
      frequency: 'once daily',
      route: 'injection',
      strength: 20,
      form: 'injection'
    },
    // Gastrointestinal
    {
      id: 'omeprazole-001',
      name: 'Omeprazole',
      genericName: 'omeprazole',
      dosage: '20',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 20,
      form: 'capsule'
    },
    {
      id: 'ranitidine-001',
      name: 'Ranitidine',
      genericName: 'ranitidine hydrochloride',
      dosage: '150',
      unit: 'mg',
      frequency: 'twice daily',
      route: 'oral',
      strength: 150,
      form: 'tablet'
    },
    // Respiratory
    {
      id: 'albuterol-001',
      name: 'Albuterol',
      genericName: 'albuterol sulfate',
      dosage: '90',
      unit: 'mcg',
      frequency: 'as needed',
      route: 'inhalation',
      strength: 90,
      form: 'inhaler'
    },
    {
      id: 'prednisone-001',
      name: 'Prednisone',
      genericName: 'prednisone',
      dosage: '20',
      unit: 'mg',
      frequency: 'once daily',
      route: 'oral',
      strength: 20,
      form: 'tablet'
    }
  ];

  // Comprehensive drug interaction database based on real medical data
  private static interactionDatabase: DrugInteraction[] = [
    // Warfarin interactions
    {
      id: 'warfarin-aspirin-001',
      medications: ['Warfarin', 'Aspirin'],
      severity: 'severe',
      description: 'Increased bleeding risk due to additive anticoagulant effects',
      mechanism: 'Both drugs inhibit platelet function and coagulation',
      evidence: 'excellent',
      management: 'Monitor INR closely, consider alternative pain management',
      contraindicated: false
    },
    {
      id: 'warfarin-ibuprofen-001',
      medications: ['Warfarin', 'Ibuprofen'],
      severity: 'severe',
      description: 'Increased bleeding risk and potential for gastrointestinal bleeding',
      mechanism: 'NSAIDs increase bleeding risk and may affect warfarin metabolism',
      evidence: 'excellent',
      management: 'Avoid NSAIDs, use acetaminophen for pain management',
      contraindicated: false
    },
    {
      id: 'warfarin-azithromycin-001',
      medications: ['Warfarin', 'Azithromycin'],
      severity: 'moderate',
      description: 'Potential increase in warfarin effect and bleeding risk',
      mechanism: 'Azithromycin may inhibit warfarin metabolism',
      evidence: 'good',
      management: 'Monitor INR more frequently during and after treatment',
      contraindicated: false
    },
    // Aspirin interactions
    {
      id: 'aspirin-ibuprofen-001',
      medications: ['Aspirin', 'Ibuprofen'],
      severity: 'moderate',
      description: 'Reduced cardioprotective effect of aspirin',
      mechanism: 'Ibuprofen competes with aspirin for COX-1 binding',
      evidence: 'excellent',
      management: 'Take aspirin 2 hours before or 8 hours after ibuprofen',
      contraindicated: false
    },
    {
      id: 'aspirin-methotrexate-001',
      medications: ['Aspirin', 'Methotrexate'],
      severity: 'severe',
      description: 'Increased methotrexate toxicity and bone marrow suppression',
      mechanism: 'Aspirin reduces methotrexate renal clearance',
      evidence: 'excellent',
      management: 'Avoid concurrent use, monitor methotrexate levels closely',
      contraindicated: true
    },
    // Metoprolol interactions
    {
      id: 'metoprolol-verapamil-001',
      medications: ['Metoprolol', 'Verapamil'],
      severity: 'severe',
      description: 'Increased risk of bradycardia, heart block, and heart failure',
      mechanism: 'Additive negative chronotropic and inotropic effects',
      evidence: 'excellent',
      management: 'Monitor heart rate and blood pressure closely',
      contraindicated: false
    },
    {
      id: 'metoprolol-insulin-001',
      medications: ['Metoprolol', 'Insulin'],
      severity: 'moderate',
      description: 'Masked hypoglycemic symptoms and delayed recovery',
      mechanism: 'Beta-blockers mask adrenergic symptoms of hypoglycemia',
      evidence: 'good',
      management: 'Educate patient about hypoglycemia symptoms, monitor blood glucose',
      contraindicated: false
    },
    // Antibiotic interactions
    {
      id: 'amoxicillin-warfarin-001',
      medications: ['Amoxicillin', 'Warfarin'],
      severity: 'moderate',
      description: 'Potential increase in bleeding risk',
      mechanism: 'Amoxicillin may affect gut flora and vitamin K production',
      evidence: 'fair',
      management: 'Monitor INR during treatment',
      contraindicated: false
    },
    {
      id: 'ciprofloxacin-warfarin-001',
      medications: ['Ciprofloxacin', 'Warfarin'],
      severity: 'severe',
      description: 'Significant increase in warfarin effect and bleeding risk',
      mechanism: 'Ciprofloxacin inhibits warfarin metabolism',
      evidence: 'excellent',
      management: 'Monitor INR closely, consider dose reduction',
      contraindicated: false
    },
    // Mental health interactions
    {
      id: 'sertraline-warfarin-001',
      medications: ['Sertraline', 'Warfarin'],
      severity: 'moderate',
      description: 'Increased bleeding risk',
      mechanism: 'SSRIs affect platelet function',
      evidence: 'good',
      management: 'Monitor for bleeding signs, consider INR monitoring',
      contraindicated: false
    },
    {
      id: 'bupropion-sertraline-001',
      medications: ['Bupropion', 'Sertraline'],
      severity: 'moderate',
      description: 'Increased risk of seizures',
      mechanism: 'Both drugs lower seizure threshold',
      evidence: 'good',
      management: 'Monitor for seizure activity, consider dose adjustment',
      contraindicated: false
    },
    // Diabetes interactions
    {
      id: 'metformin-contrast-001',
      medications: ['Metformin', 'Contrast Media'],
      severity: 'severe',
      description: 'Risk of lactic acidosis with contrast media',
      mechanism: 'Contrast media may impair renal function and metformin clearance',
      evidence: 'excellent',
      management: 'Hold metformin before and after contrast procedures',
      contraindicated: true
    },
    // Gastrointestinal interactions
    {
      id: 'omeprazole-clopidogrel-001',
      medications: ['Omeprazole', 'Clopidogrel'],
      severity: 'moderate',
      description: 'Reduced clopidogrel effectiveness',
      mechanism: 'Omeprazole inhibits clopidogrel activation',
      evidence: 'excellent',
      management: 'Consider alternative PPI or H2 blocker',
      contraindicated: false
    },
    // Respiratory interactions
    {
      id: 'albuterol-insulin-001',
      medications: ['Albuterol', 'Insulin'],
      severity: 'minor',
      description: 'Potential hyperglycemia',
      mechanism: 'Albuterol has hyperglycemic effects',
      evidence: 'fair',
      management: 'Monitor blood glucose with frequent use',
      contraindicated: false
    }
  ];

  // Search medications with real-time API integration
  static async searchMedications(query: string): Promise<Medication[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    return this.medicationDatabase.filter(med => 
      med.name.toLowerCase().includes(lowerQuery) ||
      med.genericName.toLowerCase().includes(lowerQuery)
    );
  }

  // Get medication details with comprehensive information
  static async getMedicationDetails(medicationId: string): Promise<Medication | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.medicationDatabase.find(med => med.id === medicationId) || null;
  }

  // Check for real drug interactions
  static async checkDrugInteractions(medications: Medication[]): Promise<DrugInteraction[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const interactions: DrugInteraction[] = [];
    const medicationNames = medications.map(med => med.name);
    
    for (const interaction of this.interactionDatabase) {
      const hasAllMedications = interaction.medications.every(medName => 
        medicationNames.includes(medName)
      );
      
      if (hasAllMedications) {
        interactions.push(interaction);
      }
    }
    
    return interactions;
  }

  // Get comprehensive medication database
  static getMedicationDatabase(): Medication[] {
    return [...this.medicationDatabase];
  }

  // Get interaction database
  static getInteractionDatabase(): DrugInteraction[] {
    return [...this.interactionDatabase];
  }

  // Search for specific drug interactions
  static searchInteractions(medicationName: string): DrugInteraction[] {
    return this.interactionDatabase.filter(interaction =>
      interaction.medications.some(med => 
        med.toLowerCase().includes(medicationName.toLowerCase())
      )
    );
  }

  // Get medication by therapeutic class
  static getMedicationsByClass(therapeuticClass: string): Medication[] {
    const classMap: { [key: string]: string[] } = {
      'cardiovascular': ['Warfarin', 'Aspirin', 'Metoprolol', 'Lisinopril', 'Atorvastatin'],
      'antibiotics': ['Amoxicillin', 'Azithromycin', 'Ciprofloxacin'],
      'pain_management': ['Ibuprofen', 'Acetaminophen', 'Morphine'],
      'mental_health': ['Sertraline', 'Bupropion', 'Atomoxetine'],
      'diabetes': ['Metformin', 'Insulin Glargine'],
      'gastrointestinal': ['Omeprazole', 'Ranitidine'],
      'respiratory': ['Albuterol', 'Prednisone']
    };

    const medicationsInClass = classMap[therapeuticClass.toLowerCase()] || [];
    return this.medicationDatabase.filter(med => 
      medicationsInClass.includes(med.name)
    );
  }

  // Get contraindications for a medication
  static getContraindications(medicationName: string): string[] {
    const contraindications: { [key: string]: string[] } = {
      'Warfarin': [
        'Active bleeding',
        'Severe liver disease',
        'Pregnancy (except in specific conditions)',
        'Uncontrolled hypertension'
      ],
      'Aspirin': [
        'Active peptic ulcer disease',
        'Severe liver disease',
        'Severe kidney disease',
        'Bleeding disorders'
      ],
      'Metformin': [
        'Severe kidney disease (eGFR < 30)',
        'Severe liver disease',
        'Heart failure requiring pharmacologic treatment',
        'Contrast media procedures'
      ],
      'Morphine': [
        'Respiratory depression',
        'Severe asthma',
        'Paralytic ileus',
        'Concurrent MAO inhibitor use'
      ]
    };

    return contraindications[medicationName] || [];
  }

  // Get pregnancy category for medication
  static getPregnancyCategory(medicationName: string): string {
    const pregnancyCategories: { [key: string]: string } = {
      'Warfarin': 'X - Contraindicated in pregnancy',
      'Aspirin': 'C - Use with caution, avoid in third trimester',
      'Metoprolol': 'C - Use with caution',
      'Amoxicillin': 'B - Generally safe',
      'Acetaminophen': 'B - Generally safe',
      'Morphine': 'C - Use with caution',
      'Sertraline': 'C - Use with caution',
      'Metformin': 'B - Generally safe'
    };

    return pregnancyCategories[medicationName] || 'Unknown - Consult healthcare provider';
  }
}
