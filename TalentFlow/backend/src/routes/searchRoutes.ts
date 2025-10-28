import { Router } from 'express';
import { searchController } from '../controllers/searchController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import { JobSearchDto, CandidateSearchDto, CompanySearchDto, UniversalSearchDto, SearchFilterDto, SearchSuggestionDto, SearchAnalyticsDto, SearchHistoryDto, SearchStatsDto, SearchParamDto, SearchTypeParamDto } from '../dto/SearchDto';
import { UuidParamDto } from '../dto/CommonDto';

const router = Router();

// Публічні маршрути (не потребують авторизації)
router.get('/jobs',
  validateDto(JobSearchDto, true),
  searchController.searchJobs
);

router.get('/candidates',
  validateDto(CandidateSearchDto, true),
  searchController.searchCandidates
);

router.get('/companies',
  validateDto(CompanySearchDto, true),
  searchController.searchCompanies
);

router.get('/types',
  searchController.getSearchTypes
);

router.get('/fields/:type',
  validateDto(SearchTypeParamDto, true),
  searchController.getSearchFields
);

router.get('/filters/:type',
  validateDto(SearchTypeParamDto, true),
  searchController.getSearchFilters
);

// Маршрути, що потребують авторизації
router.use(authenticateToken);

router.get('/universal',
  validateDto(UniversalSearchDto, true),
  searchController.universalSearch
);

router.get('/suggestions',
  searchController.getSearchSuggestions
);

router.get('/stats',
  validateDto(SearchStatsDto, true),
  searchController.getSearchStats
);

export default router;
