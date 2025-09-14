import React from 'react';

const About: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About MEPS</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Medical Error Prevention System - A comprehensive tool designed to prevent medication errors and improve patient safety through real-time analysis and intelligent recommendations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Mission & Vision */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">🎯</span>
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To reduce medication errors and improve patient safety by providing healthcare professionals with real-time, intelligent medication safety checks, dosage calculations, and comprehensive risk assessments.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">👁️</span>
            Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            A world where medication errors are eliminated through intelligent technology, comprehensive safety checks, and seamless integration into healthcare workflows.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">💊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drug Interaction Checking</h3>
            <p className="text-gray-600 text-sm">
              Real-time analysis of medication combinations with severity-based warnings and detailed interaction information.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🧮</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dosage Calculator</h3>
            <p className="text-gray-600 text-sm">
              Patient-specific dosage recommendations based on age, weight, height, and medical conditions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Allergy Alerts</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive allergy checking with detailed alerts and alternative medication suggestions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contraindication Check</h3>
            <p className="text-gray-600 text-sm">
              Advanced contraindication detection based on patient medical history and current conditions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
            <p className="text-gray-600 text-sm">
              Fully responsive design optimized for mobile devices and tablets for point-of-care use.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Management</h3>
            <p className="text-gray-600 text-sm">
              Secure local storage with export/import capabilities for patient data and medication lists.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How to Use MEPS</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Medications</h3>
              <p className="text-gray-600">Start by adding the medications you want to check. Use the search function to find specific drugs or add them manually.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Patient Information</h3>
              <p className="text-gray-600">Provide patient details including age, weight, height, allergies, and medical conditions for accurate analysis.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Run Safety Check</h3>
              <p className="text-gray-600">Click "Run Safety Check" to analyze drug interactions, calculate dosages, check allergies, and identify contraindications.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Results</h3>
              <p className="text-gray-600">Examine the comprehensive results including interaction warnings, dosage recommendations, and safety alerts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Information */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
        <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
          <span className="text-3xl mr-3">⚠️</span>
          Important Safety Notice
        </h2>
        <div className="space-y-4 text-red-700">
          <p className="font-semibold">
            MEPS is designed to assist healthcare professionals but should not replace clinical judgment.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Always verify medication information with current drug references</li>
            <li>Consult with pharmacists or other healthcare professionals when in doubt</li>
            <li>Consider patient-specific factors not captured in the system</li>
            <li>Use as a supplementary tool, not the sole basis for clinical decisions</li>
          </ul>
        </div>
      </div>

      {/* Technical Information */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Version</h3>
            <p className="text-gray-600">1.0.0</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Updated</h3>
            <p className="text-gray-600">September 2024</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Source</h3>
            <p className="text-gray-600">Comprehensive medical database with real-time updates</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy</h3>
            <p className="text-gray-600">All data stored locally, no external data transmission</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-4">
          For technical support, feature requests, or general inquiries about MEPS, please contact our support team.
        </p>
        <div className="flex justify-center space-x-6">
          <a href="mailto:support@meps.health" className="text-blue-600 hover:text-blue-800 font-medium">
            📧 support@meps.health
          </a>
          <a href="https://github.com/ntufar/meps" className="text-blue-600 hover:text-blue-800 font-medium">
            🔗 GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
