// Medication database and search service
export interface MedicationOption {
  name: string;
  genericName: string;
  commonDosages: string[];
  forms: string[];
  category: string;
  description: string;
}

// Comprehensive medication database
const MEDICATION_DATABASE: MedicationOption[] = [
  // Antidepressants
  {
    name: 'Wellbutrin',
    genericName: 'Bupropion',
    commonDosages: ['75mg', '100mg', '150mg', '300mg'],
    forms: ['tablet', 'extended-release tablet'],
    category: 'Antidepressant',
    description: 'Atypical antidepressant used for depression and smoking cessation'
  },
  {
    name: 'Prozac',
    genericName: 'Fluoxetine',
    commonDosages: ['10mg', '20mg', '40mg'],
    forms: ['tablet', 'capsule', 'liquid'],
    category: 'SSRI Antidepressant',
    description: 'Selective serotonin reuptake inhibitor for depression and anxiety'
  },
  {
    name: 'Zoloft',
    genericName: 'Sertraline',
    commonDosages: ['25mg', '50mg', '100mg', '200mg'],
    forms: ['tablet', 'liquid'],
    category: 'SSRI Antidepressant',
    description: 'SSRI used for depression, anxiety, and panic disorders'
  },
  {
    name: 'Lexapro',
    genericName: 'Escitalopram',
    commonDosages: ['5mg', '10mg', '20mg'],
    forms: ['tablet', 'liquid'],
    category: 'SSRI Antidepressant',
    description: 'SSRI for depression and generalized anxiety disorder'
  },

  // ADHD Medications
  {
    name: 'Strattera',
    genericName: 'Atomoxetine',
    commonDosages: ['10mg', '18mg', '25mg', '40mg', '60mg', '80mg', '100mg'],
    forms: ['capsule'],
    category: 'ADHD Medication',
    description: 'Non-stimulant medication for attention deficit hyperactivity disorder'
  },
  {
    name: 'Adderall',
    genericName: 'Amphetamine/Dextroamphetamine',
    commonDosages: ['5mg', '10mg', '15mg', '20mg', '30mg'],
    forms: ['tablet', 'extended-release capsule'],
    category: 'ADHD Medication',
    description: 'Stimulant medication for ADHD and narcolepsy'
  },
  {
    name: 'Ritalin',
    genericName: 'Methylphenidate',
    commonDosages: ['5mg', '10mg', '15mg', '20mg'],
    forms: ['tablet', 'extended-release tablet'],
    category: 'ADHD Medication',
    description: 'Stimulant for ADHD and narcolepsy'
  },

  // Anticoagulants
  {
    name: 'Warfarin',
    genericName: 'Warfarin',
    commonDosages: ['1mg', '2mg', '2.5mg', '3mg', '4mg', '5mg', '6mg', '7.5mg', '10mg'],
    forms: ['tablet'],
    category: 'Anticoagulant',
    description: 'Blood thinner used to prevent blood clots'
  },
  {
    name: 'Eliquis',
    genericName: 'Apixaban',
    commonDosages: ['2.5mg', '5mg'],
    forms: ['tablet'],
    category: 'Anticoagulant',
    description: 'Direct oral anticoagulant for stroke prevention'
  },
  {
    name: 'Xarelto',
    genericName: 'Rivaroxaban',
    commonDosages: ['10mg', '15mg', '20mg'],
    forms: ['tablet'],
    category: 'Anticoagulant',
    description: 'Direct oral anticoagulant for blood clot prevention'
  },

  // Pain Medications
  {
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    commonDosages: ['81mg', '325mg', '500mg'],
    forms: ['tablet', 'chewable tablet'],
    category: 'NSAID/Antiplatelet',
    description: 'Pain reliever and blood thinner'
  },
  {
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    commonDosages: ['200mg', '400mg', '600mg', '800mg'],
    forms: ['tablet', 'liquid', 'gel'],
    category: 'NSAID',
    description: 'Nonsteroidal anti-inflammatory drug for pain and inflammation'
  },
  {
    name: 'Tylenol',
    genericName: 'Acetaminophen',
    commonDosages: ['325mg', '500mg', '650mg'],
    forms: ['tablet', 'liquid', 'suppository'],
    category: 'Analgesic',
    description: 'Pain reliever and fever reducer'
  },
  {
    name: 'Morphine',
    genericName: 'Morphine',
    commonDosages: ['5mg', '10mg', '15mg', '30mg'],
    forms: ['tablet', 'injection', 'liquid'],
    category: 'Opioid Analgesic',
    description: 'Strong pain medication for severe pain'
  },

  // Diabetes Medications
  {
    name: 'Metformin',
    genericName: 'Metformin',
    commonDosages: ['500mg', '850mg', '1000mg'],
    forms: ['tablet', 'extended-release tablet'],
    category: 'Antidiabetic',
    description: 'First-line medication for type 2 diabetes'
  },
  {
    name: 'Insulin',
    genericName: 'Insulin',
    commonDosages: ['10 units', '20 units', '30 units'],
    forms: ['injection', 'pen'],
    category: 'Antidiabetic',
    description: 'Hormone for blood sugar control in diabetes'
  },

  // Blood Pressure Medications
  {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    commonDosages: ['2.5mg', '5mg', '10mg', '20mg', '40mg'],
    forms: ['tablet'],
    category: 'ACE Inhibitor',
    description: 'ACE inhibitor for high blood pressure and heart failure'
  },
  {
    name: 'Amlodipine',
    genericName: 'Amlodipine',
    commonDosages: ['2.5mg', '5mg', '10mg'],
    forms: ['tablet'],
    category: 'Calcium Channel Blocker',
    description: 'Calcium channel blocker for hypertension and chest pain'
  },

  // Cholesterol Medications
  {
    name: 'Lipitor',
    genericName: 'Atorvastatin',
    commonDosages: ['10mg', '20mg', '40mg', '80mg'],
    forms: ['tablet'],
    category: 'Statin',
    description: 'Statin medication for high cholesterol'
  },
  {
    name: 'Crestor',
    genericName: 'Rosuvastatin',
    commonDosages: ['5mg', '10mg', '20mg', '40mg'],
    forms: ['tablet'],
    category: 'Statin',
    description: 'Statin for cholesterol management'
  }
];

export class MedicationSearchService {
  static searchMedications(query: string): MedicationOption[] {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    
    return MEDICATION_DATABASE.filter(med => 
      med.name.toLowerCase().includes(searchTerm) ||
      med.genericName.toLowerCase().includes(searchTerm) ||
      med.category.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // Limit to 10 results
  }
  
  static getMedicationByName(name: string): MedicationOption | undefined {
    return MEDICATION_DATABASE.find(med => 
      med.name.toLowerCase() === name.toLowerCase() ||
      med.genericName.toLowerCase() === name.toLowerCase()
    );
  }
  
  static getMedicationsByCategory(category: string): MedicationOption[] {
    return MEDICATION_DATABASE.filter(med => 
      med.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  static getAllCategories(): string[] {
    const categories = new Set(MEDICATION_DATABASE.map(med => med.category));
    return Array.from(categories).sort();
  }
}
