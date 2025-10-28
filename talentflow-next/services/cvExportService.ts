import jsPDF from 'jspdf';

export interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: string[];
  certifications: string[];
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export class CVExportService {
  /**
   * Конвертує український текст для PDF
   */
  private static convertCyrillicToLatin(text: string): string {
    if (!text) return '';
    
    const cyrillicMap: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh',
      'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
      'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Ґ': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'Ye', 'Ж': 'Zh',
      'З': 'Z', 'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
      'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
      'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ь': '', 'Ю': 'Yu', 'Я': 'Ya'
    };
    
    return text.split('').map(char => cyrillicMap[char] || char).join('');
  }

  /**
   * Безпечно додає текст до PDF з підтримкою кирилиці
   */
  private static addTextToPDF(doc: jsPDF, text: string, x: number, y: number, options?: any): void {
    try {
      doc.text(text, x, y, options);
    } catch (error) {
      const convertedText = this.convertCyrillicToLatin(text);
      doc.text(convertedText, x, y, options);
    }
  }

  /**
   * Експорт CV кандидата в PDF з підтримкою кирилиці (pdfmake)
   */
  static async exportCVToPDFWithCyrillic(candidate: CandidateProfile): Promise<void> {
    try {
      // Динамічний імпорт pdfmake
      const pdfMake = (await import('pdfmake/build/pdfmake')).default;
      const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
      
      // Налаштовуємо шрифти
      (pdfMake as any).vfs = pdfFonts;

      const docDefinition: any = {
        content: [
          // Заголовок
          {
            text: `${candidate.firstName} ${candidate.lastName}`,
            style: 'header'
          },
          {
            text: candidate.headline || 'Candidate',
            style: 'subheader'
          },
          
          // Контактна інформація
          {
            text: 'Contact Information',
            style: 'sectionHeader'
          },
          {
            columns: [
              {
                width: '*',
                text: [
                  { text: 'Email: ', bold: true },
                  candidate.email
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'Phone: ', bold: true },
                  candidate.phone || 'N/A'
                ]
              }
            ]
          },
          {
            text: [
              { text: 'Location: ', bold: true },
              candidate.location || 'N/A'
            ],
            margin: [0, 5, 0, 10]
          },

          // Професійний профіль
          candidate.summary ? {
            text: 'Professional Summary',
            style: 'sectionHeader'
          } : null,
          candidate.summary ? {
            text: candidate.summary,
            margin: [0, 0, 0, 10]
          } : null,

          // Досвід роботи
          candidate.experience && candidate.experience.length > 0 ? {
            text: 'Work Experience',
            style: 'sectionHeader'
          } : null,
          ...(candidate.experience?.map(exp => ({
            text: [
              { text: `${exp.position} at ${exp.company}`, bold: true },
              { text: `\n${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate || '')}`, italics: true }
            ],
            margin: [0, 5, 0, 5]
          })) || []),
          ...(candidate.experience?.map(exp => ({
            text: exp.description,
            margin: [0, 0, 0, 5]
          })) || []),

          // Освіта
          candidate.education && candidate.education.length > 0 ? {
            text: 'Education',
            style: 'sectionHeader'
          } : null,
          ...(candidate.education?.map(edu => ({
            text: [
              { text: `${edu.degree} in ${edu.field}`, bold: true },
              { text: `\n${edu.institution}`, italics: true },
              { text: `\n${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate || '')}`, italics: true }
            ],
            margin: [0, 5, 0, 5]
          })) || []),

          // Навички
          candidate.skills && candidate.skills.length > 0 ? {
            text: 'Skills',
            style: 'sectionHeader'
          } : null,
          candidate.skills && candidate.skills.length > 0 ? {
            text: candidate.skills.join(', '),
            margin: [0, 0, 0, 10]
          } : null,

          // Мови
          candidate.languages && candidate.languages.length > 0 ? {
            text: 'Languages',
            style: 'sectionHeader'
          } : null,
          candidate.languages && candidate.languages.length > 0 ? {
            text: candidate.languages.join(', '),
            margin: [0, 0, 0, 10]
          } : null,

          // Сертифікати
          candidate.certifications && candidate.certifications.length > 0 ? {
            text: 'Certifications',
            style: 'sectionHeader'
          } : null,
          candidate.certifications && candidate.certifications.length > 0 ? {
            text: candidate.certifications.join(', '),
            margin: [0, 0, 0, 10]
          } : null,

          // Посилання
          (candidate.portfolio || candidate.linkedin || candidate.github) ? {
            text: 'Links',
            style: 'sectionHeader'
          } : null,
          candidate.portfolio ? {
            text: [
              { text: 'Portfolio: ', bold: true },
              candidate.portfolio
            ],
            margin: [0, 5, 0, 5]
          } : null,
          candidate.linkedin ? {
            text: [
              { text: 'LinkedIn: ', bold: true },
              candidate.linkedin
            ],
            margin: [0, 5, 0, 5]
          } : null,
          candidate.github ? {
            text: [
              { text: 'GitHub: ', bold: true },
              candidate.github
            ],
            margin: [0, 5, 0, 5]
          } : null
        ].filter(Boolean),
        
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            italics: true,
            margin: [0, 0, 0, 20]
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5]
          }
        },
        defaultStyle: {
          fontSize: 12,
          font: 'Roboto'
        }
      };

      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.download(`${candidate.firstName}_${candidate.lastName}_CV.pdf`);
    } catch (error) {
      console.error('Error with pdfMake, falling back to HTML export:', error);
      await this.exportCVToHTML(candidate);
    }
  }

  /**
   * Експорт CV в HTML формат
   */
  static async exportCVToHTML(candidate: CandidateProfile): Promise<void> {
    const htmlContent = `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${candidate.firstName} ${candidate.lastName} - CV</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .name { 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 5px;
        }
        .headline { 
            font-size: 18px; 
            color: #666; 
            font-style: italic;
        }
        .section { 
            margin-bottom: 25px; 
        }
        .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 10px;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .contact-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .contact-item {
            margin-bottom: 5px;
        }
        .contact-label {
            font-weight: bold;
        }
        .experience-item, .education-item {
            margin-bottom: 15px;
        }
        .job-title {
            font-weight: bold;
            font-size: 16px;
        }
        .company {
            font-style: italic;
            color: #666;
        }
        .date {
            font-size: 14px;
            color: #888;
        }
        .description {
            margin-top: 5px;
        }
        .skills-list, .languages-list, .certifications-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill-tag, .language-tag, .cert-tag {
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 14px;
        }
        .links {
            display: flex;
            gap: 20px;
            margin-top: 10px;
        }
        .link {
            color: #0066cc;
            text-decoration: none;
        }
        .link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${candidate.firstName} ${candidate.lastName}</div>
        <div class="headline">${candidate.headline || 'Professional'}</div>
    </div>

    <div class="section">
        <div class="section-title">Contact Information</div>
        <div class="contact-info">
            <div>
                <div class="contact-item">
                    <span class="contact-label">Email:</span> ${candidate.email}
                </div>
                <div class="contact-item">
                    <span class="contact-label">Phone:</span> ${candidate.phone || 'N/A'}
                </div>
            </div>
            <div>
                <div class="contact-item">
                    <span class="contact-label">Location:</span> ${candidate.location || 'N/A'}
                </div>
            </div>
        </div>
    </div>

    ${candidate.summary ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="description">${candidate.summary}</div>
    </div>
    ` : ''}

    ${candidate.experience && candidate.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Work Experience</div>
        ${candidate.experience.map(exp => `
        <div class="experience-item">
            <div class="job-title">${exp.position}</div>
            <div class="company">${exp.company}</div>
            <div class="date">${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate || '')}</div>
            <div class="description">${exp.description}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${candidate.education && candidate.education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${candidate.education.map(edu => `
        <div class="education-item">
            <div class="job-title">${edu.degree} in ${edu.field}</div>
            <div class="company">${edu.institution}</div>
            <div class="date">${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate || '')}</div>
            ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${candidate.skills && candidate.skills.length > 0 ? `
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">
            ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${candidate.languages && candidate.languages.length > 0 ? `
    <div class="section">
        <div class="section-title">Languages</div>
        <div class="languages-list">
            ${candidate.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${candidate.certifications && candidate.certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Certifications</div>
        <div class="certifications-list">
            ${candidate.certifications.map(cert => `<span class="cert-tag">${cert}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${(candidate.portfolio || candidate.linkedin || candidate.github) ? `
    <div class="section">
        <div class="section-title">Links</div>
        <div class="links">
            ${candidate.portfolio ? `<a href="${candidate.portfolio}" class="link" target="_blank">Portfolio</a>` : ''}
            ${candidate.linkedin ? `<a href="${candidate.linkedin}" class="link" target="_blank">LinkedIn</a>` : ''}
            ${candidate.github ? `<a href="${candidate.github}" class="link" target="_blank">GitHub</a>` : ''}
        </div>
    </div>
    ` : ''}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.firstName}_${candidate.lastName}_CV.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Форматує дату для відображення
   */
  private static formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Експорт CV в PDF (старий метод з jsPDF)
   */
  static async exportCVToPDF(candidate: CandidateProfile): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 20;

    // Заголовок
    doc.setFontSize(20);
    this.addTextToPDF(doc, `${candidate.firstName} ${candidate.lastName}`, 20, yPosition);
    yPosition += 10;

    if (candidate.headline) {
      doc.setFontSize(14);
      this.addTextToPDF(doc, candidate.headline, 20, yPosition);
      yPosition += 15;
    }

    // Контактна інформація
    doc.setFontSize(12);
    this.addTextToPDF(doc, 'Contact Information', 20, yPosition);
    yPosition += 10;

    this.addTextToPDF(doc, `Email: ${candidate.email}`, 20, yPosition);
    yPosition += 7;
    
    if (candidate.phone) {
      this.addTextToPDF(doc, `Phone: ${candidate.phone}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (candidate.location) {
      this.addTextToPDF(doc, `Location: ${candidate.location}`, 20, yPosition);
      yPosition += 10;
    }

    // Професійний профіль
    if (candidate.summary) {
      doc.setFontSize(12);
      this.addTextToPDF(doc, 'Professional Summary', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(candidate.summary, 170);
      this.addTextToPDF(doc, summaryLines, 20, yPosition);
      yPosition += summaryLines.length * 5 + 10;
    }

    // Досвід роботи
    if (candidate.experience && candidate.experience.length > 0) {
      doc.setFontSize(12);
      this.addTextToPDF(doc, 'Work Experience', 20, yPosition);
      yPosition += 10;

      candidate.experience.forEach(exp => {
        doc.setFontSize(10);
        this.addTextToPDF(doc, `${exp.position} at ${exp.company}`, 20, yPosition);
        yPosition += 7;
        
        const dateRange = `${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate || '')}`;
        this.addTextToPDF(doc, dateRange, 20, yPosition);
        yPosition += 7;
        
        const descLines = doc.splitTextToSize(exp.description, 170);
        this.addTextToPDF(doc, descLines, 20, yPosition);
        yPosition += descLines.length * 5 + 10;
      });
    }

    // Навички
    if (candidate.skills && candidate.skills.length > 0) {
      doc.setFontSize(12);
      this.addTextToPDF(doc, 'Skills', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      this.addTextToPDF(doc, candidate.skills.join(', '), 20, yPosition);
      yPosition += 10;
    }

    // Збереження файлу
    doc.save(`${candidate.firstName}_${candidate.lastName}_CV.pdf`);
  }

  /**
   * Універсальна функція експорту CV
   */
  static async exportCV(candidate: CandidateProfile, format: 'pdf' | 'pdf-cyrillic' | 'html' = 'pdf-cyrillic'): Promise<void> {
    switch (format) {
      case 'pdf':
        await this.exportCVToPDF(candidate);
        break;
      case 'pdf-cyrillic':
        await this.exportCVToPDFWithCyrillic(candidate);
        break;
      case 'html':
        await this.exportCVToHTML(candidate);
        break;
      default:
        await this.exportCVToPDFWithCyrillic(candidate);
    }
  }
}

export default CVExportService;
