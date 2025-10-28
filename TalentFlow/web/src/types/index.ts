// User types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'candidate' | 'employer' | 'admin';
  is_verified: boolean;
  is_premium: boolean;
  phone?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  location: string;
  website?: string;
  logo_url?: string;
  founded_year?: number;
  employee_count?: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  company_id: string;
  company_name: string;
  company_logo?: string;
  location: string;
  remote_work: 'none' | 'partial' | 'full';
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  salary_min?: number;
  salary_max?: number;
  currency: string;
  skills: string[];
  benefits: string[];
  requirements: string[];
  responsibilities: string[];
  status: 'draft' | 'active' | 'paused' | 'closed';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  views_count: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

// Candidate Profile types
export interface CandidateProfile {
  id: string;
  user_id: string;
  headline: string;
  summary: string;
  experience_years: number;
  education: Education[];
  work_experience: WorkExperience[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url?: string;
  availability: 'immediate' | '2-weeks' | '1-month' | '3-months' | 'negotiable';
  expected_salary_min?: number;
  expected_salary_max?: number;
  preferred_work_type: 'on-site' | 'hybrid' | 'remote';
  created_at: string;
  updated_at: string;
}

// Application types
export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  company_id: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewing' | 'offered' | 'hired' | 'rejected';
  cover_letter?: string;
  resume_url?: string;
  expected_salary?: number;
  applied_at: string;
  updated_at: string;
  reviewed_at?: string;
  feedback?: string;
  rating?: number;
}

// Interview types
export interface Interview {
  id: string;
  application_id: string;
  job_id: string;
  candidate_id: string;
  company_id: string;
  type: 'phone' | 'video' | 'on-site' | 'technical' | 'final';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  video_url?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

// AI Match types
export interface AIMatch {
  id: string;
  job_id: string;
  candidate_id: string;
  match_score: number;
  skills_match: number;
  experience_match: number;
  location_match: number;
  salary_match: number;
  culture_match: number;
  reasoning: string;
  created_at: string;
}

// Payment types
export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'credit_card' | 'bank_transfer' | 'paypal' | 'stripe';
  transaction_id?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Subscription types
export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  start_date: string;
  end_date: string;
  trial_end_date?: string;
  auto_renew: boolean;
  features: string[];
  price_per_month: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Education types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  gpa?: number;
  description?: string;
}

// Work Experience types
export interface WorkExperience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills_used: string[];
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
  category: 'programming' | 'framework' | 'database' | 'cloud' | 'soft_skill' | 'other';
}

// Language types
export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

// Certification types
export interface Certification {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  type: 'application' | 'interview' | 'message' | 'system' | 'payment';
  title: string;
  message: string;
  is_read: boolean;
  data?: Record<string, any>;
  created_at: string;
}

// Message types
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'candidate' | 'employer';
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

// Search and Filter types
export interface SearchFilters {
  location?: string;
  experience_level?: string;
  employment_type?: string;
  remote_work?: string;
  salary_min?: number;
  salary_max?: number;
  skills?: string[];
  industry?: string;
  company_size?: string;
  date_posted?: 'today' | 'week' | 'month' | '3months';
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// Dashboard types
export interface DashboardStats {
  total_jobs: number;
  total_applications: number;
  total_candidates: number;
  total_companies: number;
  active_jobs: number;
  pending_applications: number;
  interviews_scheduled: number;
  hires_this_month: number;
}

export interface RecentActivity {
  id: string;
  type: 'job_posted' | 'application_received' | 'interview_scheduled' | 'candidate_hired';
  title: string;
  description: string;
  timestamp: string;
  data?: Record<string, any>;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}
