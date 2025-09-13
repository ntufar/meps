# MEPS - Medical Error Prevention System

A modern, real-time medication interaction checker and dosage calculator designed to prevent medical errors and save lives.

![MEPS Screenshot](https://via.placeholder.com/800x400/2563eb/ffffff?text=MEPS+Medical+Error+Prevention+System)

## 🏥 Overview

MEPS is a comprehensive medical safety application that helps healthcare providers:

- **Check drug interactions** in real-time
- **Calculate personalized dosages** based on patient data
- **Manage patient information** including allergies and conditions
- **Generate safety reports** with severity indicators
- **Prevent medication errors** through comprehensive validation

## ✨ Features

### 🎨 **Modern UI/UX**
- **Glass morphism design** with beautiful gradients
- **Responsive layout** that works on all devices
- **Smooth animations** and hover effects
- **Professional medical styling** with appropriate color coding
- **Intuitive navigation** with tabbed interface

### 💊 **Medication Management**
- Add medications with detailed information
- Support for various dosage forms and routes
- Real-time validation and error handling
- Visual medication cards with comprehensive details

### 👤 **Patient Information**
- Complete patient demographics
- Allergy management with dynamic tags
- Medical conditions tracking
- Pregnancy status considerations

### 🔍 **Safety Features**
- **Drug interaction checking** with severity levels
- **Dosage calculations** based on patient data
- **Allergy alerts** and contraindications
- **Comprehensive safety reports**

### 📊 **Results & Reporting**
- Beautiful results display with color-coded severity
- Detailed interaction descriptions and management
- Dosage calculations with warnings and adjustments
- Professional medical reporting format

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/meps.git
   cd meps
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design
- **State Management**: React Hooks
- **Type Safety**: Full TypeScript implementation

## 📁 Project Structure

```
meps/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx      # Application header
│   │   ├── MedicationForm.tsx
│   │   ├── PatientForm.tsx
│   │   ├── ResultsDisplay.tsx
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   │   └── medical.ts      # Medical data types
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🎯 Key Components

### MedicationForm
- Comprehensive medication input with validation
- Support for various dosage forms and routes
- Real-time error handling and user feedback

### PatientForm
- Complete patient demographics collection
- Dynamic allergy and condition management
- Pregnancy status considerations

### ResultsDisplay
- Beautiful results presentation
- Severity-based color coding
- Comprehensive safety information

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 🏥 Medical Safety Features

### Drug Interaction Checking
- Real-time interaction detection
- Severity classification (Minor, Moderate, Major, Contraindicated)
- Clinical effects and management recommendations
- Evidence-based references

### Dosage Calculations
- Patient-specific calculations
- Weight and age considerations
- Maximum daily dose warnings
- Renal and hepatic adjustments

### Allergy Management
- Comprehensive allergy tracking
- Cross-reactivity warnings
- Alternative medication suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Healthcare professionals for their input and feedback
- Medical databases for interaction data
- The React and TypeScript communities
- Tailwind CSS for the beautiful design system

## 📞 Support

For support, email support@meps-medical.com or create an issue in this repository.

---

**⚠️ Medical Disclaimer**: This application is for educational and demonstration purposes. Always consult with qualified healthcare professionals for actual medical decisions.

---

Made with ❤️ for healthcare professionals
