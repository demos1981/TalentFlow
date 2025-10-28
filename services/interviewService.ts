import api from './api';

// Types based on backend DTOs
export interface Interview {
  id: string;
  title: string;
  description?: string;
  applicationId: string;
  createdById: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral' | 'final' | 'screening' | 'panel';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
  result?: 'passed' | 'failed' | 'pending' | 'on-hold' | 'withdrawn';
  scheduledDate: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: string;
  overallRating?: number;
  technicalSkills?: number;
  communicationSkills?: number;
  culturalFit?: number;
  wouldRecommend?: boolean;
  nextSteps?: string;
  reason?: string;
  cancellationReason?: string;
  isActive: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  
  // Relations
  application?: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
    job: {
      id: string;
      title: string;
      company: {
        id: string;
        name: string;
      };
    };
  };
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  interviewers?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

export interface InterviewStats {
  totalInterviews: number;
  interviewsByStatus: Array<{
    status: string;
    count: number;
  }>;
  interviewsByType: Array<{
    type: string;
    count: number;
  }>;
  interviewsByResult: Array<{
    result: string;
    count: number;
  }>;
  upcomingInterviews: number;
  completedInterviews: number;
  averageRating: number;
  successRate: number;
  timestamp: string;
}

export interface InterviewSearchParams {
  search?: string;
  type?: string;
  status?: string;
  result?: string;
  applicationId?: string;
  candidateId?: string;
  jobId?: string;
  interviewerId?: string;
  createdById?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface InterviewResponse {
  interviews: Interview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateInterviewData {
  title: string;
  description?: string;
  applicationId: string;
  type: string;
  status?: string;
  scheduledDate: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
  interviewerIds?: string[];
  isActive?: boolean;
  metadata?: any;
}

export interface UpdateInterviewData {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  result?: string;
  scheduledDate?: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: string;
  overallRating?: number;
  technicalSkills?: number;
  communicationSkills?: number;
  culturalFit?: number;
  wouldRecommend?: boolean;
  nextSteps?: string;
  reason?: string;
  cancellationReason?: string;
  interviewerIds?: string[];
  isActive?: boolean;
  metadata?: any;
}

export interface InterviewFeedbackData {
  feedback: string;
  overallRating: number;
  technicalSkills?: number;
  communicationSkills?: number;
  culturalFit?: number;
  wouldRecommend?: boolean;
  nextSteps?: string;
  result: string;
}

export interface UpdateInterviewStatusData {
  status: string;
  reason?: string;
  notes?: string;
  cancellationReason?: string;
}

export const interviewService = {
  // Get all interviews with filters
  async getInterviews(params?: InterviewSearchParams): Promise<InterviewResponse> {
    const response = await api.get('/interviews', { params });
    return response.data.data;
  },

  // Get interview by ID
  async getInterview(id: string): Promise<Interview> {
    const response = await api.get(`/interviews/${id}`);
    return response.data.data;
  },

  // Create new interview
  async createInterview(data: CreateInterviewData): Promise<Interview> {
    const response = await api.post('/interviews', data);
    return response.data.data;
  },

  // Update interview
  async updateInterview(id: string, data: UpdateInterviewData): Promise<Interview> {
    const response = await api.put(`/interviews/${id}`, data);
    return response.data.data;
  },

  // Delete interview
  async deleteInterview(id: string): Promise<boolean> {
    await api.delete(`/interviews/${id}`);
    return true;
  },

  // Add interview feedback
  async addFeedback(id: string, data: InterviewFeedbackData): Promise<Interview> {
    const response = await api.post(`/interviews/${id}/feedback`, data);
    return response.data.data;
  },

  // Update interview status
  async updateStatus(id: string, data: UpdateInterviewStatusData): Promise<Interview> {
    const response = await api.patch(`/interviews/${id}/status`, data);
    return response.data.data;
  },

  // Get interview calendar
  async getCalendar(params: {
    startDate: string;
    endDate: string;
    type?: string;
    status?: string;
    interviewerId?: string;
  }): Promise<Interview[]> {
    const response = await api.get('/interviews/calendar/events', { params });
    return response.data.data;
  },

  // Get interview statistics
  async getStats(params?: {
    period?: string;
    status?: string;
    type?: string;
    applicationId?: string;
    candidateId?: string;
    jobId?: string;
    interviewerId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<InterviewStats> {
    const response = await api.get('/interviews/stats/overview', { params });
    return response.data.data;
  }
};
