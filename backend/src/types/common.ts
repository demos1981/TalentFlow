// Common types used across the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchQuery {
  query?: string;
  filters?: Record<string, any>;
  location?: string;
  radius?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface FileUploadResult {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Address {
  street?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface DateRange {
  startDate: string;
  endDate?: string;
}

export interface Skill {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  verified?: boolean;
}

export interface Achievement {
  title: string;
  description?: string;
  date?: string;
  organization?: string;
  url?: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: number;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LanguageSkill {
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  certified?: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  portfolio?: string;
}

export interface Location {
  city: string;
  state?: string;
  country: string;
  remote?: boolean;
  relocate?: boolean;
}

export interface Salary {
  min?: number;
  max?: number;
  currency: string;
  period: 'hour' | 'day' | 'month' | 'year';
  negotiable?: boolean;
}

export interface Benefits {
  healthInsurance?: boolean;
  dentalInsurance?: boolean;
  visionInsurance?: boolean;
  lifeInsurance?: boolean;
  retirement401k?: boolean;
  paidTimeOff?: boolean;
  flexibleHours?: boolean;
  remoteWork?: boolean;
  professionalDevelopment?: boolean;
  tuitionReimbursement?: boolean;
  gymMembership?: boolean;
  transportationAllowance?: boolean;
  mealAllowance?: boolean;
  childcare?: boolean;
  stockOptions?: boolean;
  bonuses?: boolean;
  other?: string[];
}

export interface Company {
  name: string;
  description?: string;
  industry?: string;
  size?: string;
  founded?: number;
  website?: string;
  logo?: string;
  address?: Address;
  socialLinks?: SocialLinks;
}

export interface Job {
  title: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: Skill[];
  experience?: string;
  education?: string;
  location?: Location;
  salary?: Salary;
  benefits?: Benefits;
  type?: string;
  remote?: boolean;
  urgent?: boolean;
  featured?: boolean;
}

export interface ErrorDetails {
  code?: string;
  field?: string;
  message: string;
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface DatabaseConnectionInfo {
  host: string;
  port: number;
  database: string;
  username: string;
  connected: boolean;
  connectionTime?: number;
}

export interface SystemMetrics {
  memory: NodeJS.MemoryUsage;
  uptime: number;
  cpuUsage: NodeJS.CpuUsage;
  loadAverage?: number[];
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services?: Record<string, 'healthy' | 'unhealthy' | 'unknown'>;
  details?: Record<string, any>;
}
