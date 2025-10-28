import { Request, Response } from 'express';
import { companyService } from '../services/companyService';
import { 
  CreateCompanyDto, 
  UpdateCompanyDto
} from '../dto/CompanyDto';
import { CompanySearchDto as CompanySearchDtoFromSearch } from '../dto/SearchDto';
import { validateDto } from '../middleware/dtoValidation';

export const companyController = {
  async createCompany(req: Request, res: Response): Promise<void> {
    try {
      // Валідація DTO
      const validationResult = validateDto(CreateCompanyDto)(req, res, () => {});
      if (validationResult) return;

      const companyData = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const company = await companyService.createCompany(companyData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: company
      });
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating company',
        error: error.message
      });
    }
  },

  async getAllCompanies(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const companies = await companyService.getAllCompanies(filters);
      
      res.status(200).json({
        success: true,
        message: 'Companies retrieved successfully',
        data: companies
      });
    } catch (error) {
      console.error('Error getting companies:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting companies',
        error: error.message
      });
    }
  },

  async searchCompanies(req: Request, res: Response): Promise<void> {
    try {
      // Валідація DTO
      const validationResult = validateDto(CompanySearchDtoFromSearch)(req, res, () => {});
      if (validationResult) return;

      const filters = req.query;
      const page = Number(filters.page) || 1;
      const limit = Number(filters.limit) || 20;
      
      const result = await companyService.searchCompanies(filters, page, limit);
      
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

  async getCompanyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const company = await companyService.getCompanyById(id);
      
      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Company retrieved successfully',
        data: company
      });
    } catch (error) {
      console.error('Error getting company:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting company',
        error: error.message
      });
    }
  },

  async updateCompany(req: Request, res: Response): Promise<void> {
    try {
      // Валідація DTO
      const validationResult = validateDto(UpdateCompanyDto, true)(req, res, () => {});
      if (validationResult) return;

      const { id } = req.params;
      const updateData = req.body;
      
      const company = await companyService.updateCompany(id, updateData);
      
      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        data: company
      });
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating company',
        error: error.message
      });
    }
  },

  async deleteCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await companyService.deleteCompany(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting company',
        error: error.message
      });
    }
  },

  async verifyCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const company = await companyService.verifyCompany(id);
      
      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Company not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Company verified successfully',
        data: company
      });
    } catch (error) {
      console.error('Error verifying company:', error);
      res.status(400).json({
        success: false,
        message: 'Error verifying company',
        error: error.message
      });
    }
  },

  async getCompaniesByIndustry(req: Request, res: Response): Promise<void> {
    try {
      const { industry } = req.params;
      const companies = await companyService.getCompaniesByIndustry(industry);
      
      res.status(200).json({
        success: true,
        message: 'Companies retrieved successfully',
        data: companies
      });
    } catch (error) {
      console.error('Error getting companies by industry:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting companies by industry',
        error: error.message
      });
    }
  },

  async getCompaniesBySize(req: Request, res: Response): Promise<void> {
    try {
      const { size } = req.params;
      const companies = await companyService.getCompaniesBySize(size);
      
      res.status(200).json({
        success: true,
        message: 'Companies retrieved successfully',
        data: companies
      });
    } catch (error) {
      console.error('Error getting companies by size:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting companies by size',
        error: error.message
      });
    }
  },

  async getVerifiedCompanies(req: Request, res: Response): Promise<void> {
    try {
      const companies = await companyService.getVerifiedCompanies();
      
      res.status(200).json({
        success: true,
        message: 'Verified companies retrieved successfully',
        data: companies
      });
    } catch (error) {
      console.error('Error getting verified companies:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting verified companies',
        error: error.message
      });
    }
  },

  async getCompanyStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await companyService.getCompanyStats();
      
      res.status(200).json({
        success: true,
        message: 'Company statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting company stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting company stats',
        error: error.message
      });
    }
  },

  async getCompanyJobsStats(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Company ID is required'
        });
        return;
      }

      const stats = await companyService.getCompanyJobsStats(companyId);
      
      res.status(200).json({
        success: true,
        message: 'Company jobs statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting company jobs stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting company jobs stats',
        error: error.message
      });
    }
  }
};