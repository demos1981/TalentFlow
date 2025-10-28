import axios from 'axios';
import * as cheerio from 'cheerio';
import { CreateJobDto } from '../dto/JobDto';

export interface ParsedJobData {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  location?: string;
  city?: string;
  country?: string;
  remote?: boolean;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  industry?: string;
  skills?: string[];
  tags?: string[];
  companyName?: string;
  sourceUrl: string;
  sourcePlatform: string;
}

export interface JobParsingResult {
  success: boolean;
  data?: ParsedJobData;
  error?: string;
  platform: string;
}

export class JobParsingService {
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  
  /**
   * Основний метод для парсингу вакансії за URL
   */
  async parseJobFromUrl(url: string): Promise<JobParsingResult> {
    try {
      // Визначаємо платформу за URL
      const platform = this.detectPlatform(url);
      if (!platform) {
        return {
          success: false,
          error: 'Непідтримувана платформа або невалідний URL',
          platform: 'unknown'
        };
      }

      // Отримуємо HTML сторінки
      const html = await this.fetchPageContent(url);
      if (!html) {
        return {
          success: false,
          error: 'Не вдалося завантажити сторінку',
          platform
        };
      }

      // Парсимо відповідно до платформи
      const parsedData = await this.parseByPlatform(platform, html, url);
      
      return {
        success: true,
        data: parsedData,
        platform
      };
    } catch (error) {
      console.error('Error parsing job:', error);
      return {
        success: false,
        error: error.message || 'Помилка парсингу вакансії',
        platform: 'unknown'
      };
    }
  }

  /**
   * Визначає платформу за URL
   */
  private detectPlatform(url: string): string | null {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('linkedin.com/jobs')) return 'linkedin';
    if (urlLower.includes('djinni.co')) return 'djinni';
    if (urlLower.includes('robota.ua')) return 'robota';
    if (urlLower.includes('work.ua')) return 'workua';
    if (urlLower.includes('indeed.com')) return 'indeed';
    if (urlLower.includes('glassdoor.com')) return 'glassdoor';
    
    return null;
  }

  /**
   * Завантажує контент сторінки
   */
  private async fetchPageContent(url: string): Promise<string | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        timeout: 10000,
        maxRedirects: 5
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching page content:', error);
      return null;
    }
  }

  /**
   * Парсинг залежно від платформи
   */
  private async parseByPlatform(platform: string, html: string, url: string): Promise<ParsedJobData> {
    const $ = cheerio.load(html);
    
    switch (platform) {
      case 'linkedin':
        return this.parseLinkedIn($ as any, url);
      case 'djinni':
        return this.parseDjinni($ as any, url);
      case 'robota':
        return this.parseRobota($ as any, url);
      case 'workua':
        return this.parseWorkua($ as any, url);
      case 'indeed':
        return this.parseIndeed($ as any, url);
      case 'glassdoor':
        return this.parseGlassdoor($ as any, url);
      default:
        throw new Error('Непідтримувана платформа');
    }
  }

  /**
   * Парсинг LinkedIn
   */
  private parseLinkedIn($: cheerio.CheerioAPI, url: string): ParsedJobData {
    const title = $('.top-card-layout__title').text().trim() || 
                  $('h1').first().text().trim();
    
    const companyName = $('.topcard__org-name-link').text().trim() ||
                       $('.top-card-layout__company-name').text().trim();
    
    const location = $('.topcard__flavor--bullet').text().trim() ||
                    $('.top-card-layout__first-subline').text().trim();
    
    const description = $('.description__text').text().trim() ||
                       $('.show-more-less-html__markup').text().trim() ||
                       $('.jobs-description-content__text').text().trim();
    
    const salary = $('.salary-insights__salary').text().trim() ||
                  $('.compensation__salary').text().trim();
    
    const experienceLevel = this.extractExperienceLevel(description);
    const skills = this.extractSkills(description);
    const jobType = this.extractJobType(description);
    const salaryRange = this.parseSalary(salary);

    return {
      title,
      description,
      location,
      companyName,
      ...salaryRange,
      type: jobType,
      experienceLevel,
      skills,
      sourceUrl: url,
      sourcePlatform: 'LinkedIn'
    };
  }

  /**
   * Парсинг Djinni - розумний парсинг з витягуванням всієї інформації
   */
  private parseDjinni($: cheerio.CheerioAPI, url: string): ParsedJobData {
    console.log('🔍 Starting intelligent Djinni parsing...');
    
    // 1. Отримуємо основний контент
    const mainContent = this.extractMainContent($);
    
    // 2. Витягуємо базову інформацію
    const basicInfo = this.extractBasicInfo($);
    
    // 3. Розумно парсимо всі секції
    const sections = this.intelligentSectionParsing($, mainContent);
    
    // 4. Витягуємо додаткову інформацію
    const additionalInfo = this.extractAdditionalInfo(sections);
    
    console.log('📊 Parsed sections:', Object.keys(sections));
    console.log('💰 Salary info:', additionalInfo.salaryRange);
    
    return {
      title: basicInfo.title,
      description: sections.jobDescription || sections.tasks || sections.generalDescription,
      requirements: sections.requirements,
      benefits: sections.benefits,
      location: basicInfo.location,
      companyName: basicInfo.companyName,
      ...additionalInfo.salaryRange,
      type: additionalInfo.jobType,
      experienceLevel: additionalInfo.experienceLevel,
      skills: additionalInfo.skills,
      industry: additionalInfo.industry,
      sourceUrl: url,
      sourcePlatform: 'Djinni'
    };
  }

  /**
   * Витягує основний контент з різних можливих місць
   */
  private extractMainContent($: cheerio.CheerioAPI): string {
    const contentSelectors = [
      '.profile-page-section__content',
      '.job-description', 
      '.vacancy-content',
      '.profile-page-section',
      '.job-details',
      '.vacancy-details',
      '.content',
      'main',
      '.main-content'
    ];

    for (const selector of contentSelectors) {
      const content = $(selector).html();
      if (content && content.length > 100) {
        console.log(`✅ Found content in: ${selector}`);
        return content;
      }
    }

    // Fallback - весь body
    const bodyContent = $('body').html();
    if (bodyContent) {
      console.log('⚠️ Using body content as fallback');
      return bodyContent;
    }

    throw new Error('Не вдалося знайти контент вакансії');
  }

  /**
   * Витягує базову інформацію (заголовок, компанія, локація)
   */
  private extractBasicInfo($: cheerio.CheerioAPI): { title: string; companyName: string; location: string } {
    // Заголовок з різних місць
    const titleSelectors = [
      '.profile-page-section__title',
      '.job-title',
      'h1',
      '.vacancy-title',
      '.job-header h1'
    ];

    let title = '';
    for (const selector of titleSelectors) {
      const text = $(selector).text().trim();
      if (text && text.length > 3) {
        title = text;
        break;
      }
    }

    // Очищуємо заголовок
    title = this.cleanJobTitle(title);

    // Компанія
    const companySelectors = [
      '.company-profile__name',
      '.profile-page-section__company-name',
      '.company-name',
      '.employer-name',
      '.job-company'
    ];

    let companyName = '';
    for (const selector of companySelectors) {
      const text = $(selector).text().trim();
      if (text && text.length > 1) {
        companyName = text;
        break;
      }
    }

    // Локація
    const locationSelectors = [
      '.location',
      '.profile-page-section__location',
      '.job-location',
      '.vacancy-location'
    ];

    let location = '';
    for (const selector of locationSelectors) {
      const text = $(selector).text().trim();
      if (text && text.length > 1) {
        location = text;
        break;
      }
    }

    console.log(`📝 Basic info - Title: "${title}", Company: "${companyName}", Location: "${location}"`);

    return { title, companyName, location };
  }

  /**
   * Розумний парсинг секцій з використанням різних стратегій
   */
  private intelligentSectionParsing($: cheerio.CheerioAPI, mainContent: string): any {
    console.log('🧠 Starting intelligent section parsing...');
    
    const sections: any = {};
    const $content = cheerio.load(mainContent);

    // Стратегія 1: Пошук за заголовками
    this.parseByHeaders($, sections);
    
    // Стратегія 2: Пошук за списками
    this.parseByLists($, sections);
    
    // Стратегія 3: Пошук за ключовими словами в тексті
    this.parseByKeywords($, sections);
    
    // Стратегія 4: Пошук зарплати в різних місцях
    sections.salary = this.extractSalaryFromMultipleSources($);
    
    // Стратегія 5: Пошук додаткової інформації
    sections.additionalInfo = this.extractAdditionalInfoFromPage($);

    // Стратегія 6: Fallback - якщо не знайшли структуровані секції, витягуємо весь текст
    if (!sections.requirements && !sections.benefits && !sections.tasks) {
      console.log('⚠️ No structured sections found, extracting general content...');
      const generalText = $('body').text().trim();
      if (generalText.length > 100) {
        sections.generalDescription = generalText;
      }
    }

    console.log('📋 Found sections:', Object.keys(sections).filter(key => sections[key]));
    
    return sections;
  }

  /**
   * Парсинг за заголовками
   */
  private parseByHeaders($: cheerio.CheerioAPI, sections: any): void {
    const headerPatterns = {
      requirements: [
        'очікування від кандидата', 'вимоги до кандидата', 'вимоги', 'требования', 
        'requirements', 'кандидат повинен', 'необхідно', 'потрібно'
      ],
      benefits: [
        'компанія пропонує', 'ми пропонуємо', 'переваги', 'benefits', 
        'що пропонує', 'умови роботи', 'компенсація', 'зарплата'
      ],
      tasks: [
        'ключові завдання', 'завдання', 'tasks', 'обов\'язки', 
        'що робити', 'функціональні обов\'язки', 'responsibilities'
      ],
      jobDescription: [
        'опис роботи', 'про роботу', 'job description', 'вакансія',
        'про компанію', 'про нас', 'наша команда'
      ]
    };

    $('h1, h2, h3, h4, h5, h6, strong, b').each((_, element) => {
      const header = $(element).text().trim().toLowerCase();
      
      for (const [sectionType, patterns] of Object.entries(headerPatterns)) {
        if (patterns.some(pattern => header.includes(pattern))) {
          const content = this.extractContentAfterHeader($, element, headerPatterns);
          if (content && content.length > 10) {
            sections[sectionType] = content;
            console.log(`✅ Found ${sectionType} section: "${header}"`);
            break;
          }
        }
      }
    });
  }

  /**
   * Парсинг за списками
   */
  private parseByLists($: cheerio.CheerioAPI, sections: any): void {
    $('ul, ol').each((_, listElement) => {
      const listText = $(listElement).text().toLowerCase();
      const listItems = $(listElement).find('li').map((_, li) => $(li).text().trim()).get();
      
      if (listItems.length === 0) return;
      
      // Визначаємо тип списку за ключовими словами
      if (this.containsRequirements(listText)) {
        if (!sections.requirements || sections.requirements.length < listItems.join('\n').length) {
          sections.requirements = listItems.join('\n');
          console.log('✅ Found requirements list');
        }
      } else if (this.containsBenefits(listText)) {
        if (!sections.benefits || sections.benefits.length < listItems.join('\n').length) {
          sections.benefits = listItems.join('\n');
          console.log('✅ Found benefits list');
        }
      } else if (this.containsTasks(listText)) {
        if (!sections.tasks || sections.tasks.length < listItems.join('\n').length) {
          sections.tasks = listItems.join('\n');
          console.log('✅ Found tasks list');
        }
      }
    });
  }

  /**
   * Парсинг за ключовими словами
   */
  private parseByKeywords($: cheerio.CheerioAPI, sections: any): void {
    const allText = $('body').text().toLowerCase();
    
    // Якщо не знайшли секції через заголовки, намагаємося знайти за ключовими словами
    if (!sections.requirements) {
      const requirementsText = this.extractTextByKeywords(allText, this.getRequirementKeywords());
      if (requirementsText) {
        sections.requirements = requirementsText;
        console.log('✅ Found requirements by keywords');
      }
    }
    
    if (!sections.benefits) {
      const benefitsText = this.extractTextByKeywords(allText, this.getBenefitKeywords());
      if (benefitsText) {
        sections.benefits = benefitsText;
        console.log('✅ Found benefits by keywords');
      }
    }
  }

  /**
   * Витягує контент після заголовка
   */
  private extractContentAfterHeader($: cheerio.CheerioAPI, headerElement: cheerio.Element, allPatterns: any): string {
    const content: string[] = [];
    let currentElement = $(headerElement).next();
    
    while (currentElement.length > 0) {
      const tagName = currentElement.prop('tagName')?.toLowerCase();
      
      // Перевіряємо, чи це наступний заголовок
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        const headerText = currentElement.text().trim().toLowerCase();
        // Перевіряємо, чи це заголовок іншої секції
        const isOtherSection = Object.values(allPatterns).some((patterns: any) => 
          patterns.some((pattern: string) => headerText.includes(pattern))
        );
        if (isOtherSection) break;
      }
      
      // Перевіряємо, чи це список
      if (tagName === 'ul' || tagName === 'ol') {
        const listItems = currentElement.find('li').map((_, li) => $(li).text().trim()).get();
        content.push(...listItems);
      } else {
        const text = currentElement.text().trim();
        if (text && !text.match(/^\s*$/) && text.length > 10) {
          content.push(text);
        }
      }
      
      currentElement = currentElement.next();
    }
    
    return content.join('\n').trim();
  }

  /**
   * Перевіряє, чи текст містить вимоги
   */
  private containsRequirements(text: string): boolean {
    const keywords = this.getRequirementKeywords();
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Перевіряє, чи текст містить переваги
   */
  private containsBenefits(text: string): boolean {
    const keywords = this.getBenefitKeywords();
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Перевіряє, чи текст містить завдання
   */
  private containsTasks(text: string): boolean {
    const keywords = this.getTaskKeywords();
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Повертає ключові слова для вимог
   */
  private getRequirementKeywords(): string[] {
    return [
      'досвід', 'знання', 'уміння', 'требования', 'requirements', 'платформою',
      'роботи з', 'навички', 'skills', 'кваліфікація', 'освіта', 'education'
    ];
  }

  /**
   * Повертає ключові слова для переваг
   */
  private getBenefitKeywords(): string[] {
    return [
      'пропонує', 'переваги', 'benefits', 'зарплата', 'офіс', 'робота',
      'працевлаштування', 'безкоштовне', 'стабільна', 'компенсація',
      'відпустка', 'лікарняні', 'бонуси', 'команда', 'розвиток'
    ];
  }

  /**
   * Повертає ключові слова для завдань
   */
  private getTaskKeywords(): string[] {
    return [
      'налаштування', 'розробка', 'тестування', 'передача', 'обслуговування',
      'завдання', 'tasks', 'обов\'язки', 'функції', 'responsibilities',
      'аналіз', 'планування', 'координація', 'управління'
    ];
  }

  /**
   * Парсить структуровані секції Djinni
   */
  private parseDjinniSections(html: string): { requirements?: string; benefits?: string; tasks?: string } {
    const $ = cheerio.load(html);
    const sections: any = {};

    // Спочатку шукаємо за точними заголовками
    $('h1, h2, h3, h4, h5, h6, strong, b').each((_, element) => {
      const header = $(element).text().trim();
      const headerLower = header.toLowerCase();
      
      // Вимоги до кандидата
      if (headerLower.includes('очікування від кандидата') || 
          headerLower.includes('вимоги до кандидата') ||
          headerLower.includes('требования') ||
          headerLower.includes('requirements') ||
          headerLower.includes('вимоги')) {
        
        const content = this.extractSectionContent($, element, [
          'компанія пропонує', 'переваги', 'benefits', 'ми пропонуємо',
          'ключові завдання', 'завдання', 'tasks', 'обов\'язки'
        ]);
        if (content && content.length > 10) {
          sections.requirements = content;
        }
      }
      
      // Переваги та пропозиції компанії
      if (headerLower.includes('компанія пропонує') || 
          headerLower.includes('ми пропонуємо') ||
          headerLower.includes('переваги') || 
          headerLower.includes('benefits') ||
          headerLower.includes('що пропонує')) {
        
        const content = this.extractSectionContent($, element, [
          'очікування', 'вимоги', 'requirements', 'требования',
          'ключові завдання', 'завдання', 'tasks', 'обов\'язки'
        ]);
        if (content && content.length > 10) {
          sections.benefits = content;
        }
      }
      
      // Ключові завдання
      if (headerLower.includes('ключові завдання') || 
          headerLower.includes('завдання') || 
          headerLower.includes('tasks') ||
          headerLower.includes('обов\'язки') ||
          headerLower.includes('що робити')) {
        
        const content = this.extractSectionContent($, element, [
          'очікування', 'вимоги', 'requirements', 'требования',
          'компанія пропонує', 'переваги', 'benefits'
        ]);
        if (content && content.length > 10) {
          sections.tasks = content;
        }
      }
    });

    // Якщо не знайшли структуровані секції, намагаємося знайти списки
    if (!sections.requirements && !sections.benefits && !sections.tasks) {
      const lists = this.extractListsFromContent($);
      if (lists.requirements) sections.requirements = lists.requirements;
      if (lists.benefits) sections.benefits = lists.benefits;
      if (lists.tasks) sections.tasks = lists.tasks;
    }

    return sections;
  }

  /**
   * Витягує контент секції від заголовка до наступного заголовка
   */
  private extractSectionContent($: any, headerElement: cheerio.Element, stopKeywords: string[]): string {
    const content: string[] = [];
    let currentElement = $(headerElement).next();
    
    while (currentElement.length > 0) {
      const tagName = currentElement.prop('tagName')?.toLowerCase();
      
      // Перевіряємо, чи це наступний заголовок
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        const headerText = currentElement.text().trim().toLowerCase();
        if (stopKeywords.some(keyword => headerText.includes(keyword))) {
          break;
        }
      }
      
      // Перевіряємо, чи це список
      if (tagName === 'ul' || tagName === 'ol') {
        const listItems = currentElement.find('li').map((_, li) => $(li).text().trim()).get();
        content.push(...listItems);
      } else {
        const text = currentElement.text().trim();
        if (text && !text.match(/^\s*$/)) {
          content.push(text);
        }
      }
      
      currentElement = currentElement.next();
    }
    
    return content.join('\n').trim();
  }

  /**
   * Витягує списки з контенту
   */
  private extractListsFromContent($: any): { requirements?: string; benefits?: string; tasks?: string } {
    const lists: any = {};
    
    $('ul, ol').each((_, listElement) => {
      const listText = $(listElement).text().toLowerCase();
      const listItems = $(listElement).find('li').map((_, li) => $(li).text().trim()).get();
      
      if (listItems.length === 0) return;
      
      // Визначаємо тип списку за ключовими словами
      if (listText.includes('досвід') || 
          listText.includes('знання') || 
          listText.includes('уміння') ||
          listText.includes('требования') ||
          listText.includes('requirements') ||
          listText.includes('платформою') ||
          listText.includes('роботи з')) {
        lists.requirements = listItems.join('\n');
      } else if (listText.includes('пропонує') || 
                 listText.includes('переваги') || 
                 listText.includes('benefits') ||
                 listText.includes('зарплата') ||
                 listText.includes('офіс') ||
                 listText.includes('робота') ||
                 listText.includes('працевлаштування') ||
                 listText.includes('безкоштовне') ||
                 listText.includes('стабільна')) {
        lists.benefits = listItems.join('\n');
      } else if (listText.includes('налаштування') ||
                 listText.includes('розробка') ||
                 listText.includes('тестування') ||
                 listText.includes('передача') ||
                 listText.includes('обслуговування') ||
                 listText.includes('завдання')) {
        lists.tasks = listItems.join('\n');
      }
    });
    
    return lists;
  }

  /**
   * Формує опис роботи з усіх секцій
   */
  private buildDescription(sections: { requirements?: string; benefits?: string; tasks?: string }): string {
    const parts: string[] = [];
    
    // Додаємо тільки загальний опис, без дублювання секцій
    if (sections.tasks) {
      parts.push(sections.tasks);
    }
    
    return parts.join('\n\n');
  }

  /**
   * Витягує індустрію з тексту
   */
  private extractIndustry(text: string): string | undefined {
    const industries = [
      'IT', 'Software Development', 'Web Development', 'Mobile Development',
      'Data Science', 'AI/ML', 'DevOps', 'QA', 'Design', 'Marketing',
      'Sales', 'HR', 'Finance', 'Healthcare', 'Education', 'E-commerce',
      'ERP Systems', '1C', 'SAP', 'Odoo', 'MS Dynamics'
    ];
    
    const textLower = text.toLowerCase();
    
    for (const industry of industries) {
      if (textLower.includes(industry.toLowerCase())) {
        return industry;
      }
    }
    
    return undefined;
  }

  /**
   * Очищує заголовок вакансії від зарплати та статусу
   */
  private cleanJobTitle(title: string): string {
    if (!title) return '';
    
    // Видаляємо зарплату (до $2000, $1500-2000, etc.)
    let cleanTitle = title.replace(/\s*(до|up to|max)\s*[$€₴₽£]?\d+/gi, '');
    cleanTitle = cleanTitle.replace(/\s*[$€₴₽£]?\d+\s*[-–—]\s*[$€₴₽£]?\d+/g, '');
    cleanTitle = cleanTitle.replace(/\s*[$€₴₽£]?\d+/g, '');
    
    // Видаляємо статуси (Неактивна, Активна, etc.)
    cleanTitle = cleanTitle.replace(/\s*(неактивна|активна|inactive|active|закрита|closed)/gi, '');
    
    // Видаляємо зайві пробіли та знаки пунктуації в кінці
    cleanTitle = cleanTitle.replace(/\s*[,;:.]*\s*$/, '').trim();
    
    return cleanTitle;
  }

  /**
   * Витягує зарплату з заголовка вакансії
   */
  private extractSalaryFromTitle(title: string): string {
    if (!title) return '';
    
    // Шукаємо зарплату в заголовку
    const salaryMatch = title.match(/(?:до|up to|max)\s*[$€₴₽£]?(\d+)|[$€₴₽£]?(\d+)\s*[-–—]\s*[$€₴₽£]?(\d+)|[$€₴₽£]?(\d+)/i);
    
    if (salaryMatch) {
      return salaryMatch[0].trim();
    }
    
    return '';
  }

  /**
   * Витягує зарплату з різних джерел на сторінці
   */
  private extractSalaryFromMultipleSources($: cheerio.CheerioAPI): string {
    const salarySelectors = [
      '.salary', '.job-salary', '.vacancy-salary', '[class*="salary"]',
      '.profile-page-section__salary', '.compensation', '.pay'
    ];

    // Спочатку шукаємо в спеціальних елементах
    for (const selector of salarySelectors) {
      const salary = $(selector).text().trim();
      if (salary && salary.length > 0) {
        console.log(`💰 Found salary in ${selector}: "${salary}"`);
        return salary;
      }
    }

    // Потім шукаємо в заголовку
    const title = $('.profile-page-section__title, h1, .job-title').text().trim();
    const titleSalary = this.extractSalaryFromTitle(title);
    if (titleSalary) {
      console.log(`💰 Found salary in title: "${titleSalary}"`);
      return titleSalary;
    }

    // Шукаємо в тексті сторінки
    const bodyText = $('body').text();
    const salaryMatches = bodyText.match(/(?:до|up to|max)\s*[$€₴₽£]?\d+|[$€₴₽£]?\d+\s*[-–—]\s*[$€₴₽£]?\d+/gi);
    if (salaryMatches && salaryMatches.length > 0) {
      console.log(`💰 Found salary in body text: "${salaryMatches[0]}"`);
      return salaryMatches[0];
    }

    return '';
  }

  /**
   * Витягує додаткову інформацію зі сторінки
   */
  private extractAdditionalInfoFromPage($: cheerio.CheerioAPI): any {
    const info: any = {};

    // Досвід роботи
    const experienceText = $('body').text();
    const experienceMatch = experienceText.match(/(?:від|from|от)\s*(\d+)\s*(?:років|years|лет)|(\d+)\+\s*(?:років|years|лет)/i);
    if (experienceMatch) {
      info.experienceYears = parseInt(experienceMatch[1] || experienceMatch[2]);
    }

    // Тип роботи (remote, office, hybrid)
    if (experienceText.toLowerCase().includes('віддалено') || experienceText.toLowerCase().includes('remote')) {
      info.workType = 'remote';
    } else if (experienceText.toLowerCase().includes('офіс') || experienceText.toLowerCase().includes('office')) {
      info.workType = 'office';
    } else if (experienceText.toLowerCase().includes('гібрид') || experienceText.toLowerCase().includes('hybrid')) {
      info.workType = 'hybrid';
    }

    // Мови
    const languageMatches = experienceText.match(/(?:українська|англійська|російська|український|англійський|російський)/gi);
    if (languageMatches) {
      info.languages = [...new Set(languageMatches.map(lang => lang.toLowerCase()))];
    }

    console.log('📋 Additional info:', info);
    return info;
  }

  /**
   * Витягує текст за ключовими словами
   */
  private extractTextByKeywords(text: string, keywords: string[]): string {
    // Простий пошук речень, що містять ключові слова
    const sentences = text.split(/[.!?]/);
    const relevantSentences = sentences.filter(sentence => 
      keywords.some(keyword => sentence.toLowerCase().includes(keyword))
    );
    
    return relevantSentences.join('. ').trim();
  }

  /**
   * Витягує додаткову інформацію з секцій
   */
  private extractAdditionalInfo(sections: any): any {
    const allText = [
      sections.requirements || '',
      sections.benefits || '',
      sections.tasks || '',
      sections.jobDescription || ''
    ].join(' ');

    return {
      salaryRange: this.parseSalary(sections.salary || ''),
      experienceLevel: this.extractExperienceLevel(allText),
      skills: this.extractSkills(allText),
      jobType: this.extractJobType(allText),
      industry: this.extractIndustry(allText)
    };
  }

  /**
   * Парсинг Robota.ua
   */
  private parseRobota($: cheerio.CheerioAPI, url: string): ParsedJobData {
    const title = $('.b-vacancy__title').text().trim() ||
                  $('.vacancy-title').text().trim() ||
                  $('h1').first().text().trim();
    
    const companyName = $('.b-vacancy__company-name').text().trim() ||
                       $('.company-name').text().trim();
    
    const location = $('.b-vacancy__location').text().trim() ||
                    $('.vacancy-location').text().trim();
    
    const description = $('.b-vacancy__description').text().trim() ||
                       $('.vacancy-description').text().trim();
    
    const salary = $('.b-vacancy__salary').text().trim() ||
                  $('.vacancy-salary').text().trim();
    
    const experienceLevel = this.extractExperienceLevel(description);
    const skills = this.extractSkills(description);
    const jobType = this.extractJobType(description);
    const salaryRange = this.parseSalary(salary);

    return {
      title,
      description,
      location,
      companyName,
      ...salaryRange,
      type: jobType,
      experienceLevel,
      skills,
      sourceUrl: url,
      sourcePlatform: 'Robota.ua'
    };
  }

  /**
   * Парсинг Work.ua
   */
  private parseWorkua($: cheerio.CheerioAPI, url: string): ParsedJobData {
    const title = $('.job-title').text().trim() ||
                  $('h1').first().text().trim();
    
    const companyName = $('.company-name').text().trim() ||
                       $('.employer-name').text().trim();
    
    const location = $('.job-location').text().trim() ||
                    $('.location').text().trim();
    
    const description = $('.job-description').text().trim() ||
                       $('.vacancy-description').text().trim();
    
    const salary = $('.salary').text().trim() ||
                  $('.job-salary').text().trim();
    
    const experienceLevel = this.extractExperienceLevel(description);
    const skills = this.extractSkills(description);
    const jobType = this.extractJobType(description);
    const salaryRange = this.parseSalary(salary);

    return {
      title,
      description,
      location,
      companyName,
      ...salaryRange,
      type: jobType,
      experienceLevel,
      skills,
      sourceUrl: url,
      sourcePlatform: 'Work.ua'
    };
  }

  /**
   * Парсинг Indeed
   */
  private parseIndeed($: cheerio.CheerioAPI, url: string): ParsedJobData {
    const title = $('.jobsearch-JobInfoHeader-title').text().trim() ||
                  $('h1').first().text().trim();
    
    const companyName = $('.icl-u-lg-mr--sm').text().trim() ||
                       $('.companyName').text().trim();
    
    const location = $('.jobsearch-JobInfoHeader-subtitle').text().trim() ||
                    $('.jobLocation').text().trim();
    
    const description = $('.jobsearch-jobDescriptionText').text().trim() ||
                       $('.jobDescription').text().trim();
    
    const salary = $('.salary-snippet').text().trim() ||
                  $('.salaryText').text().trim();
    
    const experienceLevel = this.extractExperienceLevel(description);
    const skills = this.extractSkills(description);
    const jobType = this.extractJobType(description);
    const salaryRange = this.parseSalary(salary);

    return {
      title,
      description,
      location,
      companyName,
      ...salaryRange,
      type: jobType,
      experienceLevel,
      skills,
      sourceUrl: url,
      sourcePlatform: 'Indeed'
    };
  }

  /**
   * Парсинг Glassdoor
   */
  private parseGlassdoor($: cheerio.CheerioAPI, url: string): ParsedJobData {
    const title = $('.jobTitle').text().trim() ||
                  $('h1').first().text().trim();
    
    const companyName = $('.employerName').text().trim() ||
                       $('.company-name').text().trim();
    
    const location = $('.location').text().trim() ||
                    $('.jobLocation').text().trim();
    
    const description = $('.jobDescriptionContent').text().trim() ||
                       $('.job-description').text().trim();
    
    const salary = $('.salaryText').text().trim() ||
                  $('.salary').text().trim();
    
    const experienceLevel = this.extractExperienceLevel(description);
    const skills = this.extractSkills(description);
    const jobType = this.extractJobType(description);
    const salaryRange = this.parseSalary(salary);

    return {
      title,
      description,
      location,
      companyName,
      ...salaryRange,
      type: jobType,
      experienceLevel,
      skills,
      sourceUrl: url,
      sourcePlatform: 'Glassdoor'
    };
  }

  /**
   * Витягує рівень досвіду з тексту
   */
  private extractExperienceLevel(text: string): string | undefined {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('senior') || textLower.includes('lead') || textLower.includes('архітектор')) {
      return 'senior';
    }
    if (textLower.includes('middle') || textLower.includes('мідл')) {
      return 'middle';
    }
    if (textLower.includes('junior') || textLower.includes('джуніор')) {
      return 'junior';
    }
    if (textLower.includes('trainee') || textLower.includes('стажер')) {
      return 'trainee';
    }
    
    return undefined;
  }

  /**
   * Витягує навички з тексту
   */
  private extractSkills(text: string): string[] {
    const commonSkills = [
      // Web Development
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
      'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
      // Databases
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'MS SQL', 'SQL Server',
      // DevOps & Cloud
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
      // Tools & Methodologies
      'Git', 'Jenkins', 'CI/CD', 'Agile', 'Scrum',
      // Frontend
      'HTML', 'CSS', 'SASS', 'LESS', 'Webpack', 'Vite',
      // ERP & Business Systems
      '1C', '1С', 'SAP', 'Odoo', 'MS Dynamics', 'ERP',
      'BAS', 'УТП', 'УПП', 'Бухгалтерія', 'Зарплата та кадри',
      // Other Technologies
      'Linux', 'Windows', 'macOS', 'REST API', 'GraphQL',
      'Microservices', 'API', 'JSON', 'XML'
    ];
    
    const foundSkills: string[] = [];
    const textLower = text.toLowerCase();
    
    for (const skill of commonSkills) {
      if (textLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }
    
    // Додатково шукаємо технології в тексті
    const techPatterns = [
      /\b(\d+\.\d+)\b/g, // Версії (1C 8.3)
      /\b([A-Z]{2,}\s+[A-Z]{2,})\b/g, // Абревіатури (BAS, УТП)
      /\b(API|REST|JSON|XML|HTTP|HTTPS)\b/gi // Веб-технології
    ];
    
    for (const pattern of techPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        foundSkills.push(...matches.map(m => m.trim()));
      }
    }
    
    // Видаляємо дублікати та обмежуємо кількість
    const uniqueSkills = [...new Set(foundSkills)];
    return uniqueSkills.slice(0, 15);
  }

  /**
   * Витягує тип роботи з тексту
   */
  private extractJobType(text: string): string | undefined {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('full-time') || textLower.includes('повна зайнятість')) {
      return 'full_time';
    }
    if (textLower.includes('part-time') || textLower.includes('часткова зайнятість')) {
      return 'part_time';
    }
    if (textLower.includes('contract') || textLower.includes('контракт')) {
      return 'contract';
    }
    if (textLower.includes('remote') || textLower.includes('віддалено')) {
      return 'remote';
    }
    if (textLower.includes('internship') || textLower.includes('стажування')) {
      return 'internship';
    }
    
    return 'full_time'; // За замовчуванням
  }

  /**
   * Парсить зарплату з тексту
   */
  private parseSalary(salaryText: string): { salaryMin?: number; salaryMax?: number; currency?: string } {
    if (!salaryText) return {};
    
    const currency = this.detectCurrency(salaryText);
    const textLower = salaryText.toLowerCase();
    
    console.log(`💰 Parsing salary from: "${salaryText}"`);
    
    // Шукаємо різні формати зарплати
    const patterns = [
      // "до 2000 дол", "до $2000", "up to $2000", "максимум 2000"
      /(?:до|up\s+to|max|максимум|maximum)\s*[$€₴₽£]?(\d+)\s*(?:дол|доларів|dollars?|usd)?/i,
      // "$1500-2000", "$1500 - 2000", "1500-2000 дол"
      /[$€₴₽£]?(\d+)\s*[-–—]\s*[$€₴₽£]?(\d+)\s*(?:дол|доларів|dollars?|usd)?/i,
      // "від 1500 дол", "від $1500", "from $1500", "от $1500"
      /(?:від|from|от|min|мінімум|minimum)\s*[$€₴₽£]?(\d+)\s*(?:дол|доларів|dollars?|usd)?/i,
      // "2000 дол", "2000 доларів", "$2000"
      /[$€₴₽£]?(\d+)\s*(?:дол|доларів|dollars?|usd)/i,
      // Просто число "$2000", "2000"
      /[$€₴₽£]?(\d+)/i
    ];
    
    for (const pattern of patterns) {
      const match = salaryText.match(pattern);
      if (match) {
        console.log(`💰 Found match with pattern: ${pattern}, groups:`, match);
        
        const numbers = match.slice(1).map(n => parseInt(n)).filter(n => !isNaN(n));
        console.log(`💰 Extracted numbers:`, numbers);
        
        if (numbers.length === 1) {
          // Якщо це "до" або "максимум"
          if (textLower.includes('до') || textLower.includes('up to') || textLower.includes('max') || textLower.includes('максимум')) {
            console.log(`💰 Setting salaryMax: ${numbers[0]}`);
            return {
              salaryMax: numbers[0],
              currency: currency || 'USD'
            };
          }
          // Якщо це "від" або "мінімум"
          if (textLower.includes('від') || textLower.includes('from') || textLower.includes('от') || textLower.includes('мінімум')) {
            console.log(`💰 Setting salaryMin: ${numbers[0]}`);
            return {
              salaryMin: numbers[0],
              currency: currency || 'USD'
            };
          }
          // За замовчуванням - мінімальна зарплата
          console.log(`💰 Setting salaryMin (default): ${numbers[0]}`);
          return {
            salaryMin: numbers[0],
            currency: currency || 'USD'
          };
        }
        
        if (numbers.length >= 2) {
          console.log(`💰 Setting salary range: ${Math.min(numbers[0], numbers[1])} - ${Math.max(numbers[0], numbers[1])}`);
          return {
            salaryMin: Math.min(numbers[0], numbers[1]),
            salaryMax: Math.max(numbers[0], numbers[1]),
            currency: currency || 'USD'
          };
        }
      }
    }
    
    console.log(`💰 No salary pattern matched for: "${salaryText}"`);
    
    return {};
  }

  /**
   * Визначає валюту з тексту
   */
  private detectCurrency(text: string): string {
    const textUpper = text.toUpperCase();
    const textLower = text.toLowerCase();
    
    // Перевіряємо на долари (різні варіанти)
    if (textUpper.includes('$') || textUpper.includes('USD') || 
        textLower.includes('дол') || textLower.includes('долар')) {
      return 'USD';
    }
    
    // Інші валюти
    if (textUpper.includes('€') || textUpper.includes('EUR')) return 'EUR';
    if (textUpper.includes('₴') || textUpper.includes('UAH')) return 'UAH';
    if (textUpper.includes('₽') || textUpper.includes('RUB')) return 'RUB';
    if (textUpper.includes('£') || textUpper.includes('GBP')) return 'GBP';
    
    return 'USD'; // За замовчуванням долари
  }

  /**
   * Перетворює спарсені дані в DTO для створення вакансії
   */
  parseToCreateJobDto(parsedData: ParsedJobData): Partial<CreateJobDto> {
    return {
      title: parsedData.title,
      description: parsedData.description,
      requirements: parsedData.requirements,
      benefits: parsedData.benefits,
      location: parsedData.location,
      city: parsedData.city,
      country: parsedData.country || 'Україна',
      remote: parsedData.remote || false,
      type: parsedData.type as any,
      experienceLevel: parsedData.experienceLevel as any,
      salaryMin: parsedData.salaryMin,
      salaryMax: parsedData.salaryMax,
      currency: parsedData.currency || 'USD',
      industry: parsedData.industry,
      skills: parsedData.skills || [],
      tags: parsedData.tags || []
    };
  }
}

export const jobParsingService = new JobParsingService();
