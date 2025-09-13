# MEPS - Medical Error Prevention System

A comprehensive React-based application for preventing medical errors through real-time medication interaction checking, dosage calculations, and allergy alerts.

## 🏥 Features

- **Drug Interaction Checking**: Real-time analysis of medication combinations
- **Dosage Calculations**: Patient-specific dosage recommendations
- **Allergy Alerts**: Comprehensive allergy checking with cross-reactivity detection
- **Patient Management**: Complete patient information and medical history
- **Data Persistence**: Local storage for patient data and medications
- **PDF Export**: Generate safety reports for medical records
- **Modern UI**: Beautiful, responsive design with glass morphism effects

## 🚀 Live Demo

**Access the live application at: [https://ntufar.github.io/meps/](https://ntufar.github.io/meps/)**

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
git clone https://github.com/ntufar/meps.git
cd meps
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Production Build
```bash
npm run build
```
This creates a `dist/` folder with static files ready for deployment.

### Static Server
```bash
cd dist
python3 -m http.server 8080
```
Or use any static file server to serve the `dist/` folder.

## 📦 Deployment

### GitHub Pages (Automatic)
The app automatically deploys to GitHub Pages when you push to the `main` branch.

### Manual Deployment
```bash
npm run deploy
```

### Other Static Hosts
Upload the contents of the `dist/` folder to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Apache/Nginx

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Services**: Modular architecture for medical calculations

## 🧪 Medical Features

### Drug Interactions
- Comprehensive interaction database
- Severity-based warnings (minor, moderate, severe, life-threatening)
- Alternative medication suggestions

### Dosage Calculations
- Patient-specific calculations based on age, weight, height
- Renal/hepatic function considerations
- Pediatric and geriatric adjustments

### Allergy Checking
- 15+ common allergy patterns
- Cross-reactivity detection
- Severity-based alerts with action recommendations

## 📱 Usage

1. **Add Patient Information**: Enter patient demographics and allergies
2. **Add Medications**: Search and add current medications
3. **Run Safety Check**: Get comprehensive safety analysis
4. **Review Results**: Check interactions, dosages, and allergy alerts
5. **Export Report**: Generate PDF safety reports

## 🔧 Technical Details

- **TypeScript**: Full type safety
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized bundles and lazy loading
- **PWA Ready**: Can be installed as a web app

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Medical Disclaimer

This application is for educational and demonstration purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.