export { BaseService } from './baseService';
export { AuthService, getAuthService } from './authService';
export { UserService, userService } from './userService';
export { CompanyService, companyService } from './companyService';
export { JobService, jobService } from './jobService';

// Експортуємо типи
export type { LoginCredentials, RegisterData, AuthResponse } from './authService';
export type { CreateJobDto, UpdateJobDto } from '../dto/JobDto';
