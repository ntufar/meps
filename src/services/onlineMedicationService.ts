import { Medication } from '../types/medical';

// FDA Drug API response interfaces
interface FDADrugResult {
  openfda: {
    brand_name: string[];
    generic_name: string[];
    product_type: string[];
    route: string[];
    dosage_form: string[];
    active_ingredient: string[];
    manufacturer_name: string[];
  };
  products: Array<{
    product_number: string;
    product_ndc: string;
    product_type: string;
    brand_name: string;
    generic_name: string;
    dosage_form: string;
    route: string;
    active_ingredient: string;
    strength: string;
  }>;
}

// RxNorm API response interfaces
interface RxNormConcept {
  rxcui: number;
  name: string;
  synonym: string;
  tty: string;
  language: string;
  suppress: string;
  umlscui: string;
}

// DrugBank API response interfaces (simulated)
interface DrugBankResult {
  name: string;
  description: string;
  category: string;
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  monitoring: string[];
  image: string;
}

export class OnlineMedicationService {
  private static readonly FDA_API_BASE = 'https://api.fda.gov/drug/label.json';
  private static readonly RXNORM_API_BASE = 'https://rxnav.nlm.nih.gov/REST';

  // Search medications using multiple APIs
  static async searchMedications(query: string): Promise<Medication[]> {
    try {
      // Search FDA database for approved drugs
      const fdaResults = await this.searchFDADatabase(query);
      
      // Search RxNorm for standardized drug names
      const rxNormResults = await this.searchRxNorm(query);
      
      // Combine and deduplicate results
      const combinedResults = this.combineSearchResults(fdaResults, rxNormResults);
      
      // Enhance with additional drug information
      const enhancedResults = await this.enhanceWithDrugInfo(combinedResults);
      
      return enhancedResults.slice(0, 20); // Limit to 20 results
    } catch (error) {
      console.error('Error searching medications online:', error);
      // Fallback to local database if online search fails
      return this.getFallbackMedications(query);
    }
  }

  // Search FDA database
  private static async searchFDADatabase(query: string): Promise<Medication[]> {
    try {
      const response = await fetch(
        `${this.FDA_API_BASE}?search=openfda.brand_name:"${query}"+OR+openfda.generic_name:"${query}"&limit=10`
      );
      
      if (!response.ok) {
        throw new Error(`FDA API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseFDAResults(data.results || []);
    } catch (error) {
      console.error('FDA API search failed:', error);
      return [];
    }
  }

  // Search RxNorm database
  private static async searchRxNorm(query: string): Promise<Medication[]> {
    try {
      // First, get drug suggestions
      const suggestResponse = await fetch(
        `${this.RXNORM_API_BASE}/drugs.json?name=${encodeURIComponent(query)}`
      );
      
      if (!suggestResponse.ok) {
        throw new Error(`RxNorm API error: ${suggestResponse.status}`);
      }
      
      const suggestData = await suggestResponse.json();
      const drugSuggestions = suggestData.drugGroup?.conceptGroup?.[0]?.conceptProperties || [];
      
      if (drugSuggestions.length === 0) {
        return [];
      }
      
      // Get detailed information for the first few suggestions
      const detailedResults: Medication[] = [];
      for (const suggestion of drugSuggestions.slice(0, 5)) {
        try {
          const detailResponse = await fetch(
            `${this.RXNORM_API_BASE}/rxcui/${suggestion.rxcui}/properties.json`
          );
          
          if (detailResponse.ok) {
            const medication = this.parseRxNormResult(suggestion);
            if (medication) {
              detailedResults.push(medication);
            }
          }
        } catch (error) {
          console.error('Error fetching RxNorm details:', error);
        }
      }
      
      return detailedResults;
    } catch (error) {
      console.error('RxNorm API search failed:', error);
      return [];
    }
  }

  // Parse FDA API results
  private static parseFDAResults(results: FDADrugResult[]): Medication[] {
    return results.map((result, index) => {
      const product = result.products?.[0];
      const openfda = result.openfda;
      
      return {
        id: `fda-${index}-${Date.now()}`,
        name: product?.brand_name || openfda.brand_name?.[0] || 'Unknown',
        genericName: product?.generic_name || openfda.generic_name?.[0] || 'Unknown',
        dosage: this.extractDosage(product?.strength || ''),
        unit: this.extractUnit(product?.strength || ''),
        frequency: 'As directed',
        route: this.mapRoute(product?.route || openfda.route?.[0] || 'oral'),
        strength: this.extractStrength(product?.strength || ''),
        form: this.mapDosageForm(product?.dosage_form || openfda.dosage_form?.[0] || 'tablet'),
        category: this.mapProductType(openfda.product_type?.[0] || ''),
        manufacturer: openfda.manufacturer_name?.[0] || 'Unknown',
        description: `FDA-approved medication: ${openfda.active_ingredient?.[0] || 'Active ingredient not specified'}`,
        image: this.generateMedicationImage(openfda.brand_name?.[0] || 'Unknown')
      };
    });
  }

  // Parse RxNorm results
  private static parseRxNormResult(suggestion: RxNormConcept): Medication | null {
    if (!suggestion.name) return null;
    
    return {
      id: `rxnorm-${suggestion.rxcui}-${Date.now()}`,
      name: suggestion.name,
      genericName: suggestion.synonym || suggestion.name,
      dosage: 'As directed',
      unit: 'mg',
      frequency: 'As directed',
      route: 'oral',
      strength: 0,
      form: 'tablet',
      category: this.mapRxNormType(suggestion.tty),
      description: `RxNorm standardized medication: ${suggestion.name}`,
      image: this.generateMedicationImage(suggestion.name)
    };
  }

  // Combine search results and remove duplicates
  private static combineSearchResults(fdaResults: Medication[], rxNormResults: Medication[]): Medication[] {
    const combined = [...fdaResults, ...rxNormResults];
    const unique = new Map();
    
    combined.forEach(med => {
      const key = med.name.toLowerCase();
      if (!unique.has(key) || (med.description && unique.get(key).description && unique.get(key).description.length < med.description.length)) {
        unique.set(key, med);
      }
    });
    
    return Array.from(unique.values());
  }

  // Enhance results with additional drug information
  private static async enhanceWithDrugInfo(medications: Medication[]): Promise<Medication[]> {
    return Promise.all(medications.map(async (med) => {
      try {
        // Simulate DrugBank API call for additional information
        const drugInfo = await this.getDrugBankInfo(med.name);
        
        return {
          ...med,
          description: drugInfo.description || med.description,
          category: drugInfo.category || med.category,
          indications: drugInfo.indications || [],
          contraindications: drugInfo.contraindications || [],
          sideEffects: drugInfo.sideEffects || [],
          monitoring: drugInfo.monitoring || [],
          image: drugInfo.image || med.image
        };
      } catch (error) {
        console.error('Error enhancing drug info:', error);
        return med;
      }
    }));
  }

  // Simulate DrugBank API call (in real implementation, this would be a real API)
  private static async getDrugBankInfo(drugName: string): Promise<Partial<DrugBankResult>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock data based on common medications
    const mockData: Record<string, Partial<DrugBankResult>> = {
      'aspirin': {
        description: 'Nonsteroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, and as an antiplatelet agent.',
        category: 'NSAID/Antiplatelet',
        indications: ['Pain relief', 'Fever reduction', 'Heart attack prevention', 'Stroke prevention'],
        contraindications: ['Active bleeding', 'Peptic ulcer disease', 'Severe liver disease', 'Pregnancy (3rd trimester)'],
        sideEffects: ['Stomach upset', 'Bleeding', 'Nausea', 'Heartburn'],
        monitoring: ['Bleeding signs', 'Gastrointestinal symptoms', 'Kidney function'],
        image: 'https://images.drugs.com/prodrug/aspirin-81mg-tablet.jpg'
      },
      'warfarin': {
        description: 'Anticoagulant medication used to prevent blood clots. Warfarin works by blocking the formation of vitamin K-dependent clotting factors.',
        category: 'Anticoagulant',
        indications: ['Atrial fibrillation', 'Deep vein thrombosis', 'Pulmonary embolism', 'Heart valve replacement'],
        contraindications: ['Active bleeding', 'Severe liver disease', 'Pregnancy', 'Recent surgery'],
        sideEffects: ['Bleeding', 'Bruising', 'Nausea', 'Hair loss'],
        monitoring: ['INR levels', 'Bleeding signs', 'Liver function tests'],
        image: 'https://images.drugs.com/prodrug/warfarin-5mg-tablet.jpg'
      },
      'metformin': {
        description: 'First-line medication for type 2 diabetes. Metformin works by reducing glucose production in the liver and improving insulin sensitivity.',
        category: 'Antidiabetic',
        indications: ['Type 2 diabetes', 'Prediabetes', 'Polycystic ovary syndrome'],
        contraindications: ['Severe kidney disease', 'Severe liver disease', 'Heart failure', 'Contrast media procedures'],
        sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
        monitoring: ['Blood glucose', 'Kidney function', 'Lactate levels', 'B12 levels'],
        image: 'https://images.drugs.com/prodrug/metformin-500mg-tablet.jpg'
      }
    };
    
    const lowerName = drugName.toLowerCase();
    return mockData[lowerName] || {
      description: `Prescription medication: ${drugName}`,
      category: 'Prescription Drug',
      indications: ['As prescribed by healthcare provider'],
      contraindications: ['See prescribing information'],
      sideEffects: ['See prescribing information'],
      monitoring: ['As directed by healthcare provider'],
      image: this.generateMedicationImage(drugName)
    };
  }

  // Fallback to local database if online search fails
  private static getFallbackMedications(_query: string): Medication[] {
    // This would return medications from the local database
    // For now, return empty array
    return [];
  }

  // Helper methods
  private static extractDosage(strength: string): string {
    const match = strength.match(/(\d+(?:\.\d+)?)/);
    return match ? match[1] : '1';
  }

  private static extractUnit(strength: string): 'mg' | 'ml' | 'mcg' | 'g' | 'units' | 'tablets' | 'capsules' {
    if (strength.toLowerCase().includes('mg')) return 'mg';
    if (strength.toLowerCase().includes('ml')) return 'ml';
    if (strength.toLowerCase().includes('mcg')) return 'mcg';
    if (strength.toLowerCase().includes('g')) return 'g';
    if (strength.toLowerCase().includes('unit')) return 'units';
    return 'mg';
  }

  private static extractStrength(strength: string): number {
    const match = strength.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 1;
  }

  private static mapDosageForm(form: string): 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'patch' | 'inhaler' {
    const lowerForm = form.toLowerCase();
    if (lowerForm.includes('tablet')) return 'tablet';
    if (lowerForm.includes('capsule')) return 'capsule';
    if (lowerForm.includes('liquid') || lowerForm.includes('solution')) return 'liquid';
    if (lowerForm.includes('injection') || lowerForm.includes('injectable')) return 'injection';
    if (lowerForm.includes('cream') || lowerForm.includes('ointment')) return 'cream';
    if (lowerForm.includes('patch')) return 'patch';
    if (lowerForm.includes('inhaler') || lowerForm.includes('aerosol')) return 'inhaler';
    return 'tablet';
  }

  private static mapRoute(route: string): 'oral' | 'injection' | 'topical' | 'inhalation' | 'rectal' | 'vaginal' {
    const lowerRoute = route.toLowerCase();
    if (lowerRoute.includes('oral') || lowerRoute.includes('by mouth')) return 'oral';
    if (lowerRoute.includes('injection') || lowerRoute.includes('injectable') || lowerRoute.includes('iv') || lowerRoute.includes('im') || lowerRoute.includes('subcutaneous')) return 'injection';
    if (lowerRoute.includes('topical') || lowerRoute.includes('skin')) return 'topical';
    if (lowerRoute.includes('inhalation') || lowerRoute.includes('inhaled') || lowerRoute.includes('aerosol')) return 'inhalation';
    if (lowerRoute.includes('rectal') || lowerRoute.includes('suppository')) return 'rectal';
    if (lowerRoute.includes('vaginal') || lowerRoute.includes('vagina')) return 'vaginal';
    return 'oral';
  }

  private static mapProductType(type: string): string {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('human')) return 'Prescription Drug';
    if (lowerType.includes('otc')) return 'Over-the-Counter';
    if (lowerType.includes('homeopathic')) return 'Homeopathic';
    return 'Prescription Drug';
  }

  private static mapRxNormType(tty: string): string {
    const typeMap: Record<string, string> = {
      'BN': 'Brand Name',
      'IN': 'Ingredient',
      'PIN': 'Precise Ingredient',
      'SCD': 'Semantic Clinical Drug',
      'GPCK': 'Generic Pack',
      'BPCK': 'Brand Pack'
    };
    return typeMap[tty] || 'Drug';
  }

  private static generateMedicationImage(name: string): string {
    // Generate a data URI placeholder image
    const firstLetter = name.charAt(0).toUpperCase();
    const svg = `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#4F46E5"/>
      <text x="32" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}
