import { Candidate } from './candidateService';

export class PDFService {
  static async generateCandidateCV(candidate: Candidate): Promise<void> {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('PDF generation is only available in browser environment');
    }

    try {
      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      
      const candidateName = `${candidate.user?.firstName} ${candidate.user?.lastName}`;
      const email = candidate.user?.email || '';
      const phone = candidate.phone || '';
      const location = candidate.location || '';
      const title = candidate.title || '';
      const bio = candidate.bio || '';
      const skills = candidate.skills || [];
      const experience = candidate.yearsOfExperience || 0;
      const education = candidate.education || [];
      const linkedin = candidate.linkedin || '';
      const github = candidate.github || '';
      const website = candidate.website || '';

      // Create new PDF document
      const doc = new jsPDF();
      let yPosition = 20;

      // Helper function to add text with line wrapping
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);
        
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        yPosition += 5;
      };

      // Header
      addText(candidateName, 24, true);
      addText(title, 16);
      
      // Contact info
      const contactInfo: string[] = [];
      if (email) contactInfo.push(`Email: ${email}`);
      if (phone) contactInfo.push(`Phone: ${phone}`);
      if (location) contactInfo.push(`Location: ${location}`);
      if (linkedin) contactInfo.push(`LinkedIn: ${linkedin}`);
      if (github) contactInfo.push(`GitHub: ${github}`);
      if (website) contactInfo.push(`Website: ${website}`);
      
      if (contactInfo.length > 0) {
        addText(contactInfo.join(' | '), 10);
      }

      yPosition += 10;

      // About section
      if (bio) {
        addText('ABOUT', 14, true);
        addText(bio, 12);
        yPosition += 5;
      }

      // Experience section
      if (experience > 0) {
        addText('EXPERIENCE', 14, true);
        addText(`${experience} years of professional experience`, 12);
        yPosition += 5;
      }

      // Skills section
      if (skills.length > 0) {
        addText('SKILLS', 14, true);
        addText(skills.join(', '), 12);
        yPosition += 5;
      }

      // Education section
      if (education.length > 0) {
        addText('EDUCATION', 14, true);
        addText(education.join(', '), 12);
        yPosition += 5;
      }

      // Download the PDF
      const fileName = `${candidate.user?.firstName}_${candidate.user?.lastName}_CV.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }
}
