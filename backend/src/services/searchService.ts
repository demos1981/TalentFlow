import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { Job } from '../models/Job';
import { Company } from '../models/Company';
import { CandidateProfile } from '../models/CandidateProfile';
import {
  JobSearchDto,
  CandidateSearchDto,
  CompanySearchDto,
  UniversalSearchDto,
  SearchFilterDto,
  SearchSuggestionDto,
  SearchStatsDto,
  SearchType,
  SearchFilterType
} from '../dto/SearchDto';

export interface SearchResult {
  jobs?: any[];
  candidates?: any[];
  companies?: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  searchTime: number;
  filters?: any;
  suggestions?: SearchSuggestionDto[];
}

export interface UniversalSearchResult {
  results: {
    type: 'job' | 'candidate' | 'company';
    data: any;
    relevance: number;
    score: number;
  }[];
  total: number;
  searchTime: number;
  suggestions?: SearchSuggestionDto[];
  filters?: any;
}

export interface SearchStats {
  totalSearches: number;
  uniqueUsers: number;
  averageResults: number;
  averageSearchTime: number;
  clickThroughRate: number;
  conversionRate: number;
  topQueries: Array<{ query: string; count: number; type: string }>;
  topFilters: Array<{ field: string; value: string; count: number }>;
  topResults: Array<{ id: string; title: string; type: string; count: number }>;
  searchesByType: Array<{ type: string; count: number; percentage: number }>;
  searchesByDate: Array<{ date: string; count: number; users: number }>;
  popularSearches: Array<{ query: string; count: number; type: string; trend: string }>;
  searchTrends: Array<{ period: string; searches: number; users: number; results: number }>;
}

export class SearchService {
  private userRepository: Repository<User>;
  private jobRepository: Repository<Job>;
  private companyRepository: Repository<Company>;
  private candidateProfileRepository: Repository<CandidateProfile>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.jobRepository = AppDataSource.getRepository(Job);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.candidateProfileRepository = AppDataSource.getRepository(CandidateProfile);
  }

  /**
   * Пошук вакансій
   */
  async searchJobs(searchDto: JobSearchDto, userId?: string): Promise<SearchResult> {
    try {
      const startTime = Date.now();
      const {
        page = 1,
        limit = 20,
        search,
        title,
        description,
        company,
        industry,
        department,
        jobType,
        workMode,
        experienceLevel,
        salaryMin,
        salaryMax,
        salaryCurrency,
        isRemote,
        allowRemote,
        isUrgent,
        isFeatured,
        postedAfter,
        postedBefore,
        location,
        city,
        country,
        state,
        zipCode,
        skills,
        tags,
        benefits,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        includeInactive = false
      } = searchDto;

      const offset = (page - 1) * limit;

      const queryBuilder = this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('job.createdByUser', 'createdByUser')
        .where('job.isActive = :isActive', { isActive: true });

      if (!includeInactive) {
        queryBuilder.andWhere('job.status = :status', { status: 'active' });
      }

      // Текстовий пошук
      if (search) {
        queryBuilder.andWhere(
          '(job.title ILIKE :search OR job.description ILIKE :search OR job.requirements ILIKE :search OR job.benefits ILIKE :search OR company.name ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (title) {
        queryBuilder.andWhere('job.title ILIKE :title', { title: `%${title}%` });
      }

      if (description) {
        queryBuilder.andWhere('job.description ILIKE :description', { description: `%${description}%` });
      }

      if (company) {
        queryBuilder.andWhere('company.name ILIKE :company', { company: `%${company}%` });
      }

      if (industry) {
        queryBuilder.andWhere('company.industry ILIKE :industry', { industry: `%${industry}%` });
      }

      if (department) {
        queryBuilder.andWhere('job.department ILIKE :department', { department: `%${department}%` });
      }

      if (jobType) {
        queryBuilder.andWhere('job.jobType = :jobType', { jobType });
      }

      if (workMode) {
        queryBuilder.andWhere('job.workMode = :workMode', { workMode });
      }

      if (experienceLevel) {
        queryBuilder.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel });
      }

      if (salaryMin !== undefined) {
        queryBuilder.andWhere('job.salaryMin >= :salaryMin', { salaryMin });
      }

      if (salaryMax !== undefined) {
        queryBuilder.andWhere('job.salaryMax <= :salaryMax', { salaryMax });
      }

      if (salaryCurrency) {
        queryBuilder.andWhere('job.salaryCurrency = :salaryCurrency', { salaryCurrency });
      }

      if (isRemote !== undefined) {
        queryBuilder.andWhere('job.isRemote = :isRemote', { isRemote });
      }

      if (allowRemote !== undefined) {
        queryBuilder.andWhere('job.allowRemote = :allowRemote', { allowRemote });
      }

      if (isUrgent !== undefined) {
        queryBuilder.andWhere('job.isUrgent = :isUrgent', { isUrgent });
      }

      if (isFeatured !== undefined) {
        queryBuilder.andWhere('job.isFeatured = :isFeatured', { isFeatured });
      }

      if (postedAfter) {
        queryBuilder.andWhere('job.createdAt >= :postedAfter', { postedAfter: new Date(postedAfter) });
      }

      if (postedBefore) {
        queryBuilder.andWhere('job.createdAt <= :postedBefore', { postedBefore: new Date(postedBefore) });
      }

      if (location) {
        queryBuilder.andWhere('job.location ILIKE :location', { location: `%${location}%` });
      }

      if (city) {
        queryBuilder.andWhere('job.city ILIKE :city', { city: `%${city}%` });
      }

      if (country) {
        queryBuilder.andWhere('job.country ILIKE :country', { country: `%${country}%` });
      }

      if (state) {
        queryBuilder.andWhere('job.state ILIKE :state', { state: `%${state}%` });
      }

      if (zipCode) {
        queryBuilder.andWhere('job.zipCode = :zipCode', { zipCode });
      }

      if (skills && skills.length > 0) {
        queryBuilder.andWhere('job.skills && :skills', { skills });
      }

      if (tags && tags.length > 0) {
        queryBuilder.andWhere('job.tags && :tags', { tags });
      }

      if (benefits && benefits.length > 0) {
        queryBuilder.andWhere('job.benefits && :benefits', { benefits });
      }

      // Сортування
      queryBuilder.orderBy(`job.${sortBy}`, sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const jobs = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      const searchTime = Date.now() - startTime;

      return {
        jobs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        searchTime,
        filters: searchDto
      };
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error(`Failed to search jobs: ${error.message}`);
    }
  }

  /**
   * Пошук кандидатів
   */
  async searchCandidates(searchDto: CandidateSearchDto, userId?: string): Promise<SearchResult> {
    try {
      const startTime = Date.now();
      const {
        page = 1,
        limit = 20,
        search,
        firstName,
        lastName,
        email,
        title,
        bio,
        education,
        university,
        experienceMin,
        experienceMax,
        currentCompany,
        previousCompany,
        location,
        city,
        country,
        state,
        zipCode,
        skills,
        languages,
        certifications,
        interests,
        isAvailable,
        isOpenToWork,
        salaryMin,
        salaryMax,
        salaryCurrency,
        workModes,
        jobTypes,
        industries,
        departments,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        includeInactive = false
      } = searchDto;

      const offset = (page - 1) * limit;

      const queryBuilder = this.candidateProfileRepository
        .createQueryBuilder('profile')
        .leftJoinAndSelect('profile.user', 'user')
        .where('user.role = :role', { role: 'candidate' })
        .andWhere('user.isActive = :isActive', { isActive: true });

      if (!includeInactive) {
        queryBuilder.andWhere('profile.isActive = :profileActive', { profileActive: true });
      }

      // Текстовий пошук
      if (search) {
        queryBuilder.andWhere(
          '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR profile.title ILIKE :search OR profile.bio ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (firstName) {
        queryBuilder.andWhere('user.firstName ILIKE :firstName', { firstName: `%${firstName}%` });
      }

      if (lastName) {
        queryBuilder.andWhere('user.lastName ILIKE :lastName', { lastName: `%${lastName}%` });
      }

      if (email) {
        queryBuilder.andWhere('user.email ILIKE :email', { email: `%${email}%` });
      }

      if (title) {
        queryBuilder.andWhere('profile.title ILIKE :title', { title: `%${title}%` });
      }

      if (bio) {
        queryBuilder.andWhere('profile.bio ILIKE :bio', { bio: `%${bio}%` });
      }

      if (education) {
        queryBuilder.andWhere('profile.education ILIKE :education', { education: `%${education}%` });
      }

      if (university) {
        queryBuilder.andWhere('profile.education ILIKE :university', { university: `%${university}%` });
      }

      if (experienceMin !== undefined) {
        queryBuilder.andWhere('profile.yearsOfExperience >= :experienceMin', { experienceMin });
      }

      if (experienceMax !== undefined) {
        queryBuilder.andWhere('profile.yearsOfExperience <= :experienceMax', { experienceMax });
      }

      if (currentCompany) {
        queryBuilder.andWhere('profile.currentCompany ILIKE :currentCompany', { currentCompany: `%${currentCompany}%` });
      }

      if (previousCompany) {
        queryBuilder.andWhere('profile.previousCompany ILIKE :previousCompany', { previousCompany: `%${previousCompany}%` });
      }

      if (location) {
        queryBuilder.andWhere('profile.location ILIKE :location', { location: `%${location}%` });
      }

      if (city) {
        queryBuilder.andWhere('profile.city ILIKE :city', { city: `%${city}%` });
      }

      if (country) {
        queryBuilder.andWhere('profile.country ILIKE :country', { country: `%${country}%` });
      }

      if (state) {
        queryBuilder.andWhere('profile.state ILIKE :state', { state: `%${state}%` });
      }

      if (zipCode) {
        queryBuilder.andWhere('profile.zipCode = :zipCode', { zipCode });
      }

      if (skills && skills.length > 0) {
        queryBuilder.andWhere('profile.skills && :skills', { skills });
      }

      if (languages && languages.length > 0) {
        queryBuilder.andWhere('profile.languages && :languages', { languages });
      }

      if (certifications && certifications.length > 0) {
        queryBuilder.andWhere('profile.certifications && :certifications', { certifications });
      }

      if (interests && interests.length > 0) {
        queryBuilder.andWhere('profile.interests && :interests', { interests });
      }

      if (isAvailable !== undefined) {
        queryBuilder.andWhere('profile.isAvailable = :isAvailable', { isAvailable });
      }

      if (isOpenToWork !== undefined) {
        queryBuilder.andWhere('profile.isOpenToWork = :isOpenToWork', { isOpenToWork });
      }

      if (salaryMin !== undefined) {
        queryBuilder.andWhere('profile.expectedSalaryMin >= :salaryMin', { salaryMin });
      }

      if (salaryMax !== undefined) {
        queryBuilder.andWhere('profile.expectedSalaryMax <= :salaryMax', { salaryMax });
      }

      if (salaryCurrency) {
        queryBuilder.andWhere('profile.salaryCurrency = :salaryCurrency', { salaryCurrency });
      }

      if (workModes && workModes.length > 0) {
        queryBuilder.andWhere('profile.preferredWorkModes && :workModes', { workModes });
      }

      if (jobTypes && jobTypes.length > 0) {
        queryBuilder.andWhere('profile.preferredJobTypes && :jobTypes', { jobTypes });
      }

      if (industries && industries.length > 0) {
        queryBuilder.andWhere('profile.preferredIndustries && :industries', { industries });
      }

      if (departments && departments.length > 0) {
        queryBuilder.andWhere('profile.preferredDepartments && :departments', { departments });
      }

      // Сортування
      queryBuilder.orderBy(`profile.${sortBy}`, sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const candidates = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      const searchTime = Date.now() - startTime;

      return {
        candidates,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        searchTime,
        filters: searchDto
      };
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw new Error(`Failed to search candidates: ${error.message}`);
    }
  }

  /**
   * Пошук компаній
   */
  async searchCompanies(searchDto: CompanySearchDto, userId?: string): Promise<SearchResult> {
    try {
      const startTime = Date.now();
      const {
        page = 1,
        limit = 20,
        search,
        name,
        description,
        industry,
        website,
        email,
        phone,
        size,
        employeeCountMin,
        employeeCountMax,
        ratingMin,
        ratingMax,
        isVerified,
        isHiring,
        location,
        city,
        country,
        state,
        zipCode,
        skills,
        benefits,
        perks,
        technologies,
        departments,
        jobTypes,
        workModes,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        includeInactive = false
      } = searchDto;

      const offset = (page - 1) * limit;

      const queryBuilder = this.companyRepository
        .createQueryBuilder('company')
        .where('company.isActive = :isActive', { isActive: true });

      if (!includeInactive) {
        queryBuilder.andWhere('company.status = :status', { status: 'active' });
      }

      // Текстовий пошук
      if (search) {
        queryBuilder.andWhere(
          '(company.name ILIKE :search OR company.description ILIKE :search OR company.industry ILIKE :search OR company.website ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (name) {
        queryBuilder.andWhere('company.name ILIKE :name', { name: `%${name}%` });
      }

      if (description) {
        queryBuilder.andWhere('company.description ILIKE :description', { description: `%${description}%` });
      }

      if (industry) {
        queryBuilder.andWhere('company.industry ILIKE :industry', { industry: `%${industry}%` });
      }

      if (website) {
        queryBuilder.andWhere('company.website ILIKE :website', { website: `%${website}%` });
      }

      if (email) {
        queryBuilder.andWhere('company.email ILIKE :email', { email: `%${email}%` });
      }

      if (phone) {
        queryBuilder.andWhere('company.phone ILIKE :phone', { phone: `%${phone}%` });
      }

      if (size) {
        queryBuilder.andWhere('company.size = :size', { size });
      }

      if (employeeCountMin !== undefined) {
        queryBuilder.andWhere('company.employeeCount >= :employeeCountMin', { employeeCountMin });
      }

      if (employeeCountMax !== undefined) {
        queryBuilder.andWhere('company.employeeCount <= :employeeCountMax', { employeeCountMax });
      }

      if (ratingMin !== undefined) {
        queryBuilder.andWhere('company.rating >= :ratingMin', { ratingMin });
      }

      if (ratingMax !== undefined) {
        queryBuilder.andWhere('company.rating <= :ratingMax', { ratingMax });
      }

      if (isVerified !== undefined) {
        queryBuilder.andWhere('company.isVerified = :isVerified', { isVerified });
      }

      if (isHiring !== undefined) {
        queryBuilder.andWhere('company.isHiring = :isHiring', { isHiring });
      }

      if (location) {
        queryBuilder.andWhere('company.location ILIKE :location', { location: `%${location}%` });
      }

      if (city) {
        queryBuilder.andWhere('company.city ILIKE :city', { city: `%${city}%` });
      }

      if (country) {
        queryBuilder.andWhere('company.country ILIKE :country', { country: `%${country}%` });
      }

      if (state) {
        queryBuilder.andWhere('company.state ILIKE :state', { state: `%${state}%` });
      }

      if (zipCode) {
        queryBuilder.andWhere('company.zipCode = :zipCode', { zipCode });
      }

      if (skills && skills.length > 0) {
        queryBuilder.andWhere('company.skills && :skills', { skills });
      }

      if (benefits && benefits.length > 0) {
        queryBuilder.andWhere('company.benefits && :benefits', { benefits });
      }

      if (perks && perks.length > 0) {
        queryBuilder.andWhere('company.perks && :perks', { perks });
      }

      if (technologies && technologies.length > 0) {
        queryBuilder.andWhere('company.technologies && :technologies', { technologies });
      }

      if (departments && departments.length > 0) {
        queryBuilder.andWhere('company.departments && :departments', { departments });
      }

      if (jobTypes && jobTypes.length > 0) {
        queryBuilder.andWhere('company.jobTypes && :jobTypes', { jobTypes });
      }

      if (workModes && workModes.length > 0) {
        queryBuilder.andWhere('company.workModes && :workModes', { workModes });
      }

      // Сортування
      queryBuilder.orderBy(`company.${sortBy}`, sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const companies = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      const searchTime = Date.now() - startTime;

      return {
        companies,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        searchTime,
        filters: searchDto
      };
    } catch (error) {
      console.error('Error searching companies:', error);
      throw new Error(`Failed to search companies: ${error.message}`);
    }
  }

  /**
   * Універсальний пошук
   */
  async universalSearch(searchDto: UniversalSearchDto, userId: string): Promise<UniversalSearchResult> {
    try {
      const startTime = Date.now();
      const {
        search,
        types = [SearchType.JOBS, SearchType.CANDIDATES, SearchType.COMPANIES],
        limit = 10,
        location,
        skills,
        filters = {}
      } = searchDto;

      if (!search) {
        return {
          results: [],
          total: 0,
          searchTime: Date.now() - startTime,
          suggestions: []
        };
      }

      const results: UniversalSearchResult['results'] = [];

      // Пошук вакансій
      if (types.includes(SearchType.JOBS)) {
        const jobFilters = { ...filters.jobs, search, location, skills };
        const jobResult = await this.searchJobs(jobFilters as JobSearchDto, userId);
        
        if (jobResult.jobs) {
          jobResult.jobs.forEach(job => {
            results.push({
              type: 'job',
              data: job,
              relevance: this.calculateRelevance(search, job.title + ' ' + job.description),
              score: this.calculateScore(job, search)
            });
          });
        }
      }

      // Пошук кандидатів
      if (types.includes(SearchType.CANDIDATES)) {
        const candidateFilters = { ...filters.candidates, search, location, skills };
        const candidateResult = await this.searchCandidates(candidateFilters as CandidateSearchDto, userId);
        
        if (candidateResult.candidates) {
          candidateResult.candidates.forEach(candidate => {
            results.push({
              type: 'candidate',
              data: candidate,
              relevance: this.calculateRelevance(search, candidate.user.firstName + ' ' + candidate.user.lastName + ' ' + candidate.title),
              score: this.calculateScore(candidate, search)
            });
          });
        }
      }

      // Пошук компаній
      if (types.includes(SearchType.COMPANIES)) {
        const companyFilters = { ...filters.companies, search, location, skills };
        const companyResult = await this.searchCompanies(companyFilters as CompanySearchDto, userId);
        
        if (companyResult.companies) {
          companyResult.companies.forEach(company => {
            results.push({
              type: 'company',
              data: company,
              relevance: this.calculateRelevance(search, company.name + ' ' + company.description),
              score: this.calculateScore(company, search)
            });
          });
        }
      }

      // Сортування за релевантністю та оцінкою
      results.sort((a, b) => {
        const scoreA = a.relevance * 0.7 + a.score * 0.3;
        const scoreB = b.relevance * 0.7 + b.score * 0.3;
        return scoreB - scoreA;
      });

      const searchTime = Date.now() - startTime;

      return {
        results: results.slice(0, limit),
        total: results.length,
        searchTime,
        suggestions: [],
        filters: searchDto
      };
    } catch (error) {
      console.error('Error in universal search:', error);
      throw new Error(`Failed to perform universal search: ${error.message}`);
    }
  }

  /**
   * Отримання пропозицій пошуку (спрощена версія)
   */
  async getSearchSuggestions(query: string, types: SearchType[] = [SearchType.UNIVERSAL]): Promise<SearchSuggestionDto[]> {
    try {
      // Прості пропозиції на основі популярних запитів
      const suggestions: SearchSuggestionDto[] = [];
      
      if (query.length >= 2) {
        // Додаємо пропозиції на основі введеного тексту
        suggestions.push({
          text: query,
          type: SearchType.UNIVERSAL,
          category: 'exact',
          confidence: 1.0
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  /**
   * Отримання фільтрів пошуку (статичні)
   */
  async getSearchFilters(type: string): Promise<SearchFilterDto[]> {
    try {
      let filters: SearchFilterDto[] = [];
      
      switch (type) {
        case SearchType.JOBS:
          filters = [
            { field: 'title', type: SearchFilterType.TEXT, label: 'Job Title', required: false },
            { field: 'location', type: SearchFilterType.TEXT, label: 'Location', required: false },
            { field: 'jobType', type: SearchFilterType.SELECT, label: 'Job Type', required: false, options: ['full-time', 'part-time', 'contract', 'internship', 'freelance'] },
            { field: 'workMode', type: SearchFilterType.SELECT, label: 'Work Mode', required: false, options: ['remote', 'hybrid', 'onsite'] },
            { field: 'experienceLevel', type: SearchFilterType.SELECT, label: 'Experience Level', required: false, options: ['entry', 'mid', 'senior', 'lead', 'executive'] },
            { field: 'salaryMin', type: SearchFilterType.RANGE, label: 'Minimum Salary', required: false, min: 0, max: 1000000 },
            { field: 'salaryMax', type: SearchFilterType.RANGE, label: 'Maximum Salary', required: false, min: 0, max: 1000000 },
            { field: 'skills', type: SearchFilterType.MULTI_SELECT, label: 'Skills', required: false }
          ];
          break;
        case SearchType.CANDIDATES:
          filters = [
            { field: 'firstName', type: SearchFilterType.TEXT, label: 'First Name', required: false },
            { field: 'lastName', type: SearchFilterType.TEXT, label: 'Last Name', required: false },
            { field: 'title', type: SearchFilterType.TEXT, label: 'Job Title', required: false },
            { field: 'location', type: SearchFilterType.TEXT, label: 'Location', required: false },
            { field: 'experienceMin', type: SearchFilterType.RANGE, label: 'Minimum Experience', required: false, min: 0, max: 50 },
            { field: 'experienceMax', type: SearchFilterType.RANGE, label: 'Maximum Experience', required: false, min: 0, max: 50 },
            { field: 'skills', type: SearchFilterType.MULTI_SELECT, label: 'Skills', required: false },
            { field: 'education', type: SearchFilterType.TEXT, label: 'Education', required: false }
          ];
          break;
        case SearchType.COMPANIES:
          filters = [
            { field: 'name', type: SearchFilterType.TEXT, label: 'Company Name', required: false },
            { field: 'industry', type: SearchFilterType.TEXT, label: 'Industry', required: false },
            { field: 'location', type: SearchFilterType.TEXT, label: 'Location', required: false },
            { field: 'size', type: SearchFilterType.SELECT, label: 'Company Size', required: false, options: ['startup', 'small', 'medium', 'large', 'enterprise'] },
            { field: 'isVerified', type: SearchFilterType.BOOLEAN, label: 'Verified', required: false },
            { field: 'isHiring', type: SearchFilterType.BOOLEAN, label: 'Currently Hiring', required: false }
          ];
          break;
        default:
          filters = [];
      }

      return filters;
    } catch (error) {
      console.error('Error getting search filters:', error);
      return [];
    }
  }

  /**
   * Отримання статистики пошуку (спрощена версія)
   */
  async getSearchStats(statsDto: SearchStatsDto, userId: string): Promise<SearchStats> {
    try {
      // Проста статистика без збереження в БД
      return {
        totalSearches: 0,
        uniqueUsers: 0,
        averageResults: 0,
        averageSearchTime: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        topQueries: [],
        topFilters: [],
        topResults: [],
        searchesByType: [],
        searchesByDate: [],
        popularSearches: [],
        searchTrends: []
      };
    } catch (error) {
      console.error('Error getting search stats:', error);
      throw new Error(`Failed to get search stats: ${error.message}`);
    }
  }

  // Приватні методи для розрахунків

  private calculateRelevance(searchTerm: string, text: string): number {
    const searchLower = searchTerm.toLowerCase();
    const textLower = text.toLowerCase();
    
    let relevance = 0;
    
    if (textLower.includes(searchLower)) {
      relevance += 10;
    }
    
    const matches = (textLower.match(new RegExp(searchLower, 'g')) || []).length;
    relevance += matches * 2;
    
    relevance += Math.max(0, 5 - text.length / 100);
    
    return relevance;
  }

  private calculateScore(item: any, searchTerm: string): number {
    let score = 0;
    
    // Базовий бал за релевантність
    score += this.calculateRelevance(searchTerm, item.title || item.name || '');
    
    // Додаткові бали за важливі поля
    if (item.isFeatured) score += 5;
    if (item.isVerified) score += 3;
    if (item.isActive) score += 2;
    if (item.rating) score += item.rating * 2;
    if (item.experience) score += Math.min(item.experience, 10);
    
    return score;
  }
}

export const searchService = new SearchService();