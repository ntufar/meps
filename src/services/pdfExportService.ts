// PDF export service for safety reports
import { MEPSState, DrugInteraction, DosageCalculation, AllergyAlert } from '../types/medical';

export class PDFExportService {
  static generateSafetyReport(state: MEPSState): string {
    const reportDate = new Date().toLocaleDateString();
    const reportTime = new Date().toLocaleTimeString();
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>MEPS Safety Report - ${reportDate}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .subtitle { color: #666; margin-top: 5px; }
          .section { margin: 20px 0; }
          .section-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 10px; border-left: 4px solid #2563eb; padding-left: 10px; }
          .alert { padding: 10px; margin: 10px 0; border-radius: 5px; }
          .alert-danger { background-color: #fee; border: 1px solid #fcc; color: #c33; }
          .alert-warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
          .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
          .alert-success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
          .medication-item { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #2563eb; }
          .severity-badge { padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .severity-critical { background-color: #dc3545; color: white; }
          .severity-major { background-color: #fd7e14; color: white; }
          .severity-moderate { background-color: #ffc107; color: black; }
          .severity-minor { background-color: #17a2b8; color: white; }
          .summary { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MEPS</div>
          <div class="subtitle">Medical Error Prevention System</div>
          <div>Safety Report Generated: ${reportDate} at ${reportTime}</div>
        </div>
    `;

    // Patient Information
    html += `
      <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="medication-item">
          <strong>Age:</strong> ${state.patientInfo.age} years<br>
          <strong>Weight:</strong> ${state.patientInfo.weight} kg<br>
          <strong>Height:</strong> ${state.patientInfo.height} cm<br>
          <strong>Gender:</strong> ${state.patientInfo.gender}<br>
          <strong>Pregnancy Status:</strong> ${state.patientInfo.pregnancyStatus}<br>
          <strong>Allergies:</strong> ${state.patientInfo.allergies.length > 0 ? state.patientInfo.allergies.join(', ') : 'None reported'}<br>
          <strong>Medical Conditions:</strong> ${state.patientInfo.medicalConditions.length > 0 ? state.patientInfo.medicalConditions.join(', ') : 'None reported'}
        </div>
      </div>
    `;

    // Current Medications
    html += `
      <div class="section">
        <div class="section-title">Current Medications (${state.medications.length})</div>
    `;
    
    if (state.medications.length === 0) {
      html += '<div class="alert alert-info">No medications added</div>';
    } else {
      state.medications.forEach(med => {
        html += `
          <div class="medication-item">
            <strong>${med.name}</strong> (${med.genericName})<br>
            <strong>Dosage:</strong> ${med.dosage} ${med.unit}<br>
            <strong>Frequency:</strong> ${med.frequency}<br>
            <strong>Route:</strong> ${med.route}<br>
            <strong>Form:</strong> ${med.form}
          </div>
        `;
      });
    }
    html += '</div>';

    // Allergy Alerts
    html += `
      <div class="section">
        <div class="section-title">Allergy Alerts (${state.allergyAlerts.length})</div>
    `;
    
    if (state.allergyAlerts.length === 0) {
      html += '<div class="alert alert-success">✅ No allergy alerts - All medications appear safe for this patient</div>';
    } else {
      state.allergyAlerts.forEach(alert => {
        const severityClass = `severity-${alert.severity === 'life-threatening' ? 'critical' : alert.severity}`;
        html += `
          <div class="alert alert-danger">
            <strong>🚨 ALLERGY ALERT: ${alert.medication}</strong><br>
            <strong>Patient allergic to:</strong> ${alert.allergen}<br>
            <strong>Severity:</strong> <span class="severity-badge ${severityClass}">${alert.severity.toUpperCase()}</span><br>
            <strong>Potential Reaction:</strong> ${alert.reaction}<br>
            <strong>Action Required:</strong> ${alert.action}<br>
            <strong>Alternatives:</strong> ${alert.alternative}
          </div>
        `;
      });
    }
    html += '</div>';

    // Drug Interactions
    html += `
      <div class="section">
        <div class="section-title">Drug Interactions (${state.interactions.length})</div>
    `;
    
    if (state.interactions.length === 0) {
      html += '<div class="alert alert-success">✅ No drug interactions detected</div>';
    } else {
      state.interactions.forEach(interaction => {
        const severityClass = `severity-${interaction.severity}`;
        html += `
          <div class="alert alert-warning">
            <strong>${interaction.description}</strong><br>
            <strong>Severity:</strong> <span class="severity-badge ${severityClass}">${interaction.severity.toUpperCase()}</span><br>
            <strong>Clinical Effect:</strong> ${interaction.clinicalEffect}<br>
            <strong>Management:</strong> ${interaction.management}<br>
            <strong>Evidence:</strong> ${interaction.evidence.toUpperCase()}<br>
            <strong>References:</strong> ${interaction.references.join(', ')}
          </div>
        `;
      });
    }
    html += '</div>';

    // Dosage Calculations
    html += `
      <div class="section">
        <div class="section-title">Dosage Calculations (${state.dosageCalculations.length})</div>
    `;
    
    if (state.dosageCalculations.length === 0) {
      html += '<div class="alert alert-info">No dosage calculations available</div>';
    } else {
      state.dosageCalculations.forEach(calc => {
        html += `
          <div class="medication-item">
            <strong>${calc.medication.name}</strong> (${calc.medication.genericName})<br>
            <strong>Calculated Dose:</strong> ${calc.calculatedDose} ${calc.unit}<br>
            <strong>Frequency:</strong> ${calc.frequency}<br>
            <strong>Max Daily Dose:</strong> ${calc.maxDailyDose} ${calc.unit}<br>
            <strong>Warnings:</strong> ${calc.warnings.join(', ')}<br>
            <strong>Adjustments:</strong> ${calc.adjustments.join(', ')}
          </div>
        `;
      });
    }
    html += '</div>';

    // Summary
    const totalAlerts = state.allergyAlerts.length + state.interactions.length;
    const status = totalAlerts === 0 ? 'SAFE' : 'REVIEW REQUIRED';
    const statusClass = totalAlerts === 0 ? 'alert-success' : 'alert-danger';
    
    html += `
      <div class="summary">
        <div class="section-title">Safety Summary</div>
        <div class="alert ${statusClass}">
          <strong>Overall Status: ${status}</strong><br>
          <strong>Total Alerts:</strong> ${totalAlerts}<br>
          <strong>Allergy Alerts:</strong> ${state.allergyAlerts.length}<br>
          <strong>Drug Interactions:</strong> ${state.interactions.length}<br>
          <strong>Dosage Calculations:</strong> ${state.dosageCalculations.length}
        </div>
      </div>
    `;

    // Footer
    html += `
      <div class="footer">
        <p>This report was generated by MEPS (Medical Error Prevention System)</p>
        <p>For medical emergencies, contact emergency services immediately</p>
        <p>This report is for informational purposes only and should not replace professional medical judgment</p>
      </div>
      </body>
      </html>
    `;

    return html;
  }

  static downloadReport(state: MEPSState): void {
    const html = this.generateSafetyReport(state);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `meps-safety-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static printReport(state: MEPSState): void {
    const html = this.generateSafetyReport(state);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
