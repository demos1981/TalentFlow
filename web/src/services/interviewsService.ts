import { apiClient } from '../utils/apiClient';

export interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  company: string;
  interviewer: string;
  interviewerEmail: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string;
  videoUrl?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  stage: 'screening' | 'technical' | 'final' | 'offer';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface InterviewStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  rescheduled: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface InterviewDetails {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateProfile: {
    experience: string;
    skills: string[];
    education: string;
    portfolio: string;
  };
  jobTitle: string;
  company: string;
  interviewer: string;
  interviewerEmail: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  videoUrl?: string;
  notes?: string;
  stage: 'screening' | 'technical' | 'final' | 'offer';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  questions: string[];
  feedback?: string;
  rating?: number;
  nextSteps?: string;
}

export interface InterviewCalendar {
  month: number;
  year: number;
  interviews: Array<{
    id: string;
    date: string;
    time: string;
    candidateName: string;
    jobTitle: string;
    type: 'video' | 'phone' | 'in-person';
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  }>;
}

export interface CreateInterviewData {
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  company: string;
  interviewer: string;
  interviewerEmail: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  stage: 'screening' | 'technical' | 'final' | 'offer';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  location?: string;
  videoUrl?: string;
}

export interface InterviewFeedback {
  rating: number;
  feedback: string;
  nextSteps?: string;
}

export interface InterviewStatusUpdate {
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  reason?: string;
}

export class InterviewsService {
  // Отримання всіх інтерв'ю
  static async getAllInterviews(): Promise<Interview[]> {
    const response = await apiClient.get('/interviews');
    return response.data.data;
  }

  // Отримання статистики інтерв'ю
  static async getInterviewStats(): Promise<InterviewStats> {
    const response = await apiClient.get('/interviews/stats');
    return response.data.data;
  }

  // Отримання деталей інтерв'ю
  static async getInterviewDetails(interviewId: string): Promise<InterviewDetails> {
    const response = await apiClient.get(`/interviews/${interviewId}`);
    return response.data.data;
  }

  // Створення нового інтерв'ю
  static async createInterview(data: CreateInterviewData): Promise<Interview> {
    const response = await apiClient.post('/interviews', data);
    return response.data.data;
  }

  // Оновлення інтерв'ю
  static async updateInterview(interviewId: string, data: Partial<Interview>): Promise<Interview> {
    const response = await apiClient.put(`/interviews/${interviewId}`, data);
    return response.data.data;
  }

  // Видалення інтерв'ю
  static async deleteInterview(interviewId: string): Promise<void> {
    await apiClient.delete(`/interviews/${interviewId}`);
  }

  // Додавання відгуку про інтерв'ю
  static async addInterviewFeedback(interviewId: string, feedback: InterviewFeedback): Promise<any> {
    const response = await apiClient.post(`/interviews/${interviewId}/feedback`, feedback);
    return response.data.data;
  }

  // Зміна статусу інтерв'ю
  static async updateInterviewStatus(interviewId: string, statusUpdate: InterviewStatusUpdate): Promise<any> {
    const response = await apiClient.patch(`/interviews/${interviewId}/status`, statusUpdate);
    return response.data.data;
  }

  // Отримання календаря інтерв'ю
  static async getInterviewCalendar(month?: number, year?: number): Promise<InterviewCalendar> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await apiClient.get('/interviews/calendar', { params });
    return response.data.data;
  }
}

export default InterviewsService;


