import { JobParsingService } from '../services/jobParsingService';

describe('JobParsingService', () => {
  let service: JobParsingService;

  beforeEach(() => {
    service = new JobParsingService();
  });

  describe('detectPlatform', () => {
    it('should detect LinkedIn platform', () => {
      const url = 'https://www.linkedin.com/jobs/view/1234567890';
      const result = service['detectPlatform'](url);
      expect(result).toBe('linkedin');
    });

    it('should detect Djinni platform', () => {
      const url = 'https://djinni.co/jobs/1234567890/';
      const result = service['detectPlatform'](url);
      expect(result).toBe('djinni');
    });

    it('should detect Robota.ua platform', () => {
      const url = 'https://robota.ua/vacancy/1234567890';
      const result = service['detectPlatform'](url);
      expect(result).toBe('robota');
    });

    it('should detect Work.ua platform', () => {
      const url = 'https://www.work.ua/jobs/1234567890/';
      const result = service['detectPlatform'](url);
      expect(result).toBe('workua');
    });

    it('should detect Indeed platform', () => {
      const url = 'https://www.indeed.com/viewjob?jk=1234567890';
      const result = service['detectPlatform'](url);
      expect(result).toBe('indeed');
    });

    it('should detect Glassdoor platform', () => {
      const url = 'https://www.glassdoor.com/job-listing/1234567890';
      const result = service['detectPlatform'](url);
      expect(result).toBe('glassdoor');
    });

    it('should return null for unsupported platform', () => {
      const url = 'https://unsupported-site.com/job/123';
      const result = service['detectPlatform'](url);
      expect(result).toBeNull();
    });
  });

  describe('extractExperienceLevel', () => {
    it('should extract senior level', () => {
      const text = 'We are looking for a Senior Developer with 5+ years experience';
      const result = service['extractExperienceLevel'](text);
      expect(result).toBe('senior');
    });

    it('should extract middle level', () => {
      const text = 'Middle Developer position available';
      const result = service['extractExperienceLevel'](text);
      expect(result).toBe('middle');
    });

    it('should extract junior level', () => {
      const text = 'Junior Developer needed for our team';
      const result = service['extractExperienceLevel'](text);
      expect(result).toBe('junior');
    });

    it('should extract trainee level', () => {
      const text = 'Стажер для розвитку навичок';
      const result = service['extractExperienceLevel'](text);
      expect(result).toBe('trainee');
    });

    it('should return undefined for no level found', () => {
      const text = 'Regular developer position';
      const result = service['extractExperienceLevel'](text);
      expect(result).toBeUndefined();
    });
  });

  describe('extractSkills', () => {
    it('should extract common programming skills', () => {
      const text = 'We need JavaScript, React, Node.js developer with PostgreSQL experience';
      const result = service['extractSkills'](text);
      expect(result).toContain('JavaScript');
      expect(result).toContain('React');
      expect(result).toContain('Node.js');
      expect(result).toContain('PostgreSQL');
    });

    it('should limit skills to 10 items', () => {
      const text = 'JavaScript TypeScript React Vue Angular Node.js Python Java C# PHP Ruby Go Rust Docker Kubernetes AWS Azure';
      const result = service['extractSkills'](text);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should return empty array for no skills found', () => {
      const text = 'Simple job description without technical skills';
      const result = service['extractSkills'](text);
      expect(result).toEqual([]);
    });
  });

  describe('extractJobType', () => {
    it('should extract full-time job', () => {
      const text = 'Full-time position available';
      const result = service['extractJobType'](text);
      expect(result).toBe('full_time');
    });

    it('should extract part-time job', () => {
      const text = 'Part-time work opportunity';
      const result = service['extractJobType'](text);
      expect(result).toBe('part_time');
    });

    it('should extract contract job', () => {
      const text = 'Contract position for 6 months';
      const result = service['extractJobType'](text);
      expect(result).toBe('contract');
    });

    it('should extract remote job', () => {
      const text = 'Remote work opportunity';
      const result = service['extractJobType'](text);
      expect(result).toBe('remote');
    });

    it('should default to full_time', () => {
      const text = 'Regular job description';
      const result = service['extractJobType'](text);
      expect(result).toBe('full_time');
    });
  });

  describe('parseSalary', () => {
    it('should parse salary range', () => {
      const salaryText = '$3000 - $5000 USD';
      const result = service['parseSalary'](salaryText);
      expect(result.salaryMin).toBe(3000);
      expect(result.salaryMax).toBe(5000);
      expect(result.currency).toBe('USD');
    });

    it('should parse single salary', () => {
      const salaryText = '$4000 USD';
      const result = service['parseSalary'](salaryText);
      expect(result.salaryMin).toBe(4000);
      expect(result.currency).toBe('USD');
    });

    it('should detect EUR currency', () => {
      const salaryText = '€3000 - €5000';
      const result = service['parseSalary'](salaryText);
      expect(result.currency).toBe('EUR');
    });

    it('should detect UAH currency', () => {
      const salaryText = '₴50000 - ₴80000';
      const result = service['parseSalary'](salaryText);
      expect(result.currency).toBe('UAH');
    });

    it('should return empty object for invalid salary', () => {
      const salaryText = 'Salary negotiable';
      const result = service['parseSalary'](salaryText);
      expect(result).toEqual({});
    });
  });

  describe('detectCurrency', () => {
    it('should detect USD', () => {
      const text = '$3000 USD';
      const result = service['detectCurrency'](text);
      expect(result).toBe('USD');
    });

    it('should detect EUR', () => {
      const text = '€3000 EUR';
      const result = service['detectCurrency'](text);
      expect(result).toBe('EUR');
    });

    it('should detect UAH', () => {
      const text = '₴50000 UAH';
      const result = service['detectCurrency'](text);
      expect(result).toBe('UAH');
    });

    it('should default to USD', () => {
      const text = '3000';
      const result = service['detectCurrency'](text);
      expect(result).toBe('USD');
    });
  });

  describe('parseToCreateJobDto', () => {
    it('should convert parsed data to CreateJobDto format', () => {
      const parsedData = {
        title: 'Senior Developer',
        description: 'Job description',
        requirements: 'Requirements',
        benefits: 'Benefits',
        location: 'Kyiv, Ukraine',
        city: 'Kyiv',
        country: 'Ukraine',
        remote: true,
        type: 'full_time',
        experienceLevel: 'senior',
        salaryMin: 3000,
        salaryMax: 5000,
        currency: 'USD',
        industry: 'IT',
        skills: ['JavaScript', 'React'],
        tags: ['frontend'],
        companyName: 'Test Company',
        sourceUrl: 'https://example.com/job/123',
        sourcePlatform: 'LinkedIn'
      };

      const result = service.parseToCreateJobDto(parsedData);

      expect(result.title).toBe('Senior Developer');
      expect(result.description).toBe('Job description');
      expect(result.requirements).toBe('Requirements');
      expect(result.benefits).toBe('Benefits');
      expect(result.location).toBe('Kyiv, Ukraine');
      expect(result.city).toBe('Kyiv');
      expect(result.country).toBe('Ukraine');
      expect(result.remote).toBe(true);
      expect(result.type).toBe('full_time');
      expect(result.experienceLevel).toBe('senior');
      expect(result.salaryMin).toBe(3000);
      expect(result.salaryMax).toBe(5000);
      expect(result.currency).toBe('USD');
      expect(result.industry).toBe('IT');
      expect(result.skills).toEqual(['JavaScript', 'React']);
      expect(result.tags).toEqual(['frontend']);
    });
  });
});
