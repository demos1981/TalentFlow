import { Request, Response } from 'express';
import { searchService } from '../services/searchService';
import { validateDto } from '../middleware/dtoValidation';
import { JobSearchDto, CandidateSearchDto, CompanySearchDto, UniversalSearchDto, SearchStatsDto } from '../dto/SearchDto';

export const searchController = {
  /**
   * Пошук вакансій
   */
  async searchJobs(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(JobSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      const searchFilters: JobSearchDto = req.query as any;
      const result = await searchService.searchJobs(searchFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Jobs search completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error searching jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching jobs',
        error: error.message
      });
    }
  },

  /**
   * Пошук кандидатів
   */
  async searchCandidates(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CandidateSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      const searchFilters: CandidateSearchDto = req.query as any;
      const result = await searchService.searchCandidates(searchFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Candidates search completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error searching candidates:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching candidates',
        error: error.message
      });
    }
  },

  /**
   * Пошук компаній
   */
  async searchCompanies(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CompanySearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      const searchFilters: CompanySearchDto = req.query as any;
      const result = await searchService.searchCompanies(searchFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Companies search completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error searching companies:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching companies',
        error: error.message
      });
    }
  },

  /**
   * Універсальний пошук
   */
  async universalSearch(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UniversalSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: UniversalSearchDto = req.query as any;
      const result = await searchService.universalSearch(searchFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Universal search completed successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in universal search:', error);
      res.status(500).json({
        success: false,
        message: 'Error in universal search',
        error: error.message
      });
    }
  },

  /**
   * Отримання пропозицій пошуку
   */
  async getSearchSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { query, types } = req.query;
      if (!query) {
        res.status(400).json({
          success: false,
          message: 'Query parameter is required'
        });
        return;
      }

      const searchTypes = types ? (Array.isArray(types) ? types : [types]) : ['universal'];
      const suggestions = await searchService.getSearchSuggestions(query as string, searchTypes as any);
      
      res.status(200).json({
        success: true,
        message: 'Search suggestions retrieved successfully',
        data: suggestions
      });
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting search suggestions',
        error: error.message
      });
    }
  },

  /**
   * Отримання фільтрів пошуку
   */
  async getSearchFilters(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      if (!type) {
        res.status(400).json({
          success: false,
          message: 'Type parameter is required'
        });
        return;
      }

      const filters = await searchService.getSearchFilters(type as any);
      
      res.status(200).json({
        success: true,
        message: 'Search filters retrieved successfully',
        data: filters
      });
    } catch (error) {
      console.error('Error getting search filters:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting search filters',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики пошуку
   */
  async getSearchStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(SearchStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const statsFilters: SearchStatsDto = req.query as any;
      const stats = await searchService.getSearchStats(statsFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Search statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting search stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting search statistics',
        error: error.message
      });
    }
  },

  /**
   * Отримання доступних типів пошуку
   */
  async getSearchTypes(req: Request, res: Response): Promise<void> {
    try {
      const searchTypes = [
        {
          type: 'jobs',
          name: 'Jobs',
          description: 'Search for job opportunities',
          icon: 'briefcase',
          color: 'blue'
        },
        {
          type: 'candidates',
          name: 'Candidates',
          description: 'Search for job candidates',
          icon: 'user',
          color: 'green'
        },
        {
          type: 'companies',
          name: 'Companies',
          description: 'Search for companies',
          icon: 'building',
          color: 'purple'
        },
        {
          type: 'universal',
          name: 'Universal',
          description: 'Search across all content',
          icon: 'search',
          color: 'orange'
        }
      ];
      
      res.status(200).json({
        success: true,
        message: 'Search types retrieved successfully',
        data: searchTypes
      });
    } catch (error) {
      console.error('Error getting search types:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting search types',
        error: error.message
      });
    }
  },

  /**
   * Отримання доступних полів для пошуку
   */
  async getSearchFields(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      if (!type) {
        res.status(400).json({
          success: false,
          message: 'Type parameter is required'
        });
        return;
      }

      let fields = [];
      
      switch (type) {
        case 'jobs':
          fields = [
            { field: 'title', label: 'Job Title', type: 'text', required: false },
            { field: 'description', label: 'Description', type: 'text', required: false },
            { field: 'company', label: 'Company', type: 'text', required: false },
            { field: 'location', label: 'Location', type: 'text', required: false },
            { field: 'jobType', label: 'Job Type', type: 'select', required: false },
            { field: 'workMode', label: 'Work Mode', type: 'select', required: false },
            { field: 'experienceLevel', label: 'Experience Level', type: 'select', required: false },
            { field: 'salaryMin', label: 'Minimum Salary', type: 'number', required: false },
            { field: 'salaryMax', label: 'Maximum Salary', type: 'number', required: false },
            { field: 'skills', label: 'Skills', type: 'multi_select', required: false }
          ];
          break;
        case 'candidates':
          fields = [
            { field: 'firstName', label: 'First Name', type: 'text', required: false },
            { field: 'lastName', label: 'Last Name', type: 'text', required: false },
            { field: 'title', label: 'Job Title', type: 'text', required: false },
            { field: 'location', label: 'Location', type: 'text', required: false },
            { field: 'experienceMin', label: 'Minimum Experience', type: 'number', required: false },
            { field: 'experienceMax', label: 'Maximum Experience', type: 'number', required: false },
            { field: 'skills', label: 'Skills', type: 'multi_select', required: false },
            { field: 'education', label: 'Education', type: 'text', required: false }
          ];
          break;
        case 'companies':
          fields = [
            { field: 'name', label: 'Company Name', type: 'text', required: false },
            { field: 'industry', label: 'Industry', type: 'text', required: false },
            { field: 'location', label: 'Location', type: 'text', required: false },
            { field: 'size', label: 'Company Size', type: 'select', required: false },
            { field: 'isVerified', label: 'Verified', type: 'boolean', required: false },
            { field: 'isHiring', label: 'Currently Hiring', type: 'boolean', required: false }
          ];
          break;
        default:
          fields = [];
      }
      
      res.status(200).json({
        success: true,
        message: 'Search fields retrieved successfully',
        data: fields
      });
    } catch (error) {
      console.error('Error getting search fields:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting search fields',
        error: error.message
      });
    }
  }
};