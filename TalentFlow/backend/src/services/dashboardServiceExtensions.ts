import { Repository, Between } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Job, JobStatus } from '../models/Job';
import { Application } from '../models/Application';
import { CandidateProfile } from '../models/CandidateProfile';
import { Interview } from '../models/Interview';

export class DashboardServiceExtensions {

  constructor() {
    // Lazy initialization - отримуємо репозиторії тільки коли потрібно
  }

  private getUserRepository() {
    return AppDataSource.getRepository(User);
  }

  private getJobRepository() {
    return AppDataSource.getRepository(Job);
  }

  private getApplicationRepository() {
    return AppDataSource.getRepository(Application);
  }

  private getCandidateProfileRepository() {
    return AppDataSource.getRepository(CandidateProfile);
  }

  private getInterviewRepository() {
    return AppDataSource.getRepository(Interview);
  }

  /**
   * Форматування часу "тому" - повертає структуровані дані
   */
  private formatTimeAgo(date: Date): { timeValue: number; timeUnit: string } {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return { timeValue: diffInSeconds, timeUnit: 'seconds' };
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return { timeValue: minutes, timeUnit: 'minutes' };
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return { timeValue: hours, timeUnit: 'hours' };
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return { timeValue: days, timeUnit: 'days' };
    }
  }

  /**
   * Розрахунок тренду
   */

  /**
   * Отримання статистики для конкретного користувача
   */
  async getUserDashboardStats(userId: string, role: string): Promise<{
    activeJobs: number;
    candidates: number;
    applications: number;
    interviews: number;
    views: number;
    offers: number;
    hired: number;
    conversionRate: number;
    activeJobsTrend?: number;
    candidatesTrend?: number;
    applicationsTrend?: number;
    interviewsTrend?: number;
    viewsTrend?: number;
    offersTrend?: number;
    hiredTrend?: number;
    conversionRateTrend?: number;
  }> {
    try {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      if (role === 'employer') {
        // Реальні запити до бази даних для роботодавця
        const [
          activeJobs,
          activeJobsPrevious,
          candidates,
          candidatesPrevious,
          applications,
          applicationsPrevious,
          interviews,
          interviewsPrevious,
          hired,
          hiredPrevious
        ] = await Promise.all([
          this.getJobRepository().count({
            where: {
              createdByUserId: userId,
              isActive: true,
              status: JobStatus.ACTIVE
            }
          }),
          this.getJobRepository().count({
            where: {
              createdByUserId: userId,
              isActive: true,
              status: JobStatus.ACTIVE,
              createdAt: Between(twoMonthsAgo, monthAgo)
            }
          }),
          this.getCandidateProfileRepository().count({
            where: { isActive: true }
          }),
          this.getCandidateProfileRepository().count({
            where: {
              isActive: true,
              createdAt: Between(twoMonthsAgo, monthAgo)
            }
          }),
          this.getApplicationRepository().count({
            where: {
              job: { createdByUserId: userId }
            }
          }),
          this.getApplicationRepository().count({
            where: {
              job: { createdByUserId: userId },
              createdAt: Between(twoMonthsAgo, monthAgo)
            }
          }),
          this.getInterviewRepository().count({
            where: {
              application: {
                job: { createdByUserId: userId }
              }
            }
          }),
          this.getInterviewRepository().count({
            where: {
              application: {
                job: { createdByUserId: userId }
              },
              createdAt: Between(twoMonthsAgo, monthAgo)
            }
          }),
          this.getApplicationRepository().count({
            where: {
              job: { createdByUserId: userId },
              status: 'hired' as any
            }
          }),
          this.getApplicationRepository().count({
            where: {
              job: { createdByUserId: userId },
              status: 'hired' as any,
              hiredAt: Between(twoMonthsAgo, monthAgo)
            }
          })
        ]);

        const conversionRate = applications > 0 ? (hired / applications) * 100 : 0;
        const conversionRatePrevious = applicationsPrevious > 0 ? (hiredPrevious / applicationsPrevious) * 100 : 0;

        return {
          activeJobs,
          candidates,
          applications,
          interviews,
          views: 0, // Поки що 0, можна додати пізніше
          offers: 0, // Поки що 0, можна додати пізніше
          hired: hired,
          conversionRate: parseFloat(conversionRate.toFixed(1)),
          activeJobsTrend: this.calculateTrend(activeJobs, activeJobsPrevious),
          candidatesTrend: this.calculateTrend(candidates, candidatesPrevious),
          applicationsTrend: this.calculateTrend(applications, applicationsPrevious),
          interviewsTrend: this.calculateTrend(interviews, interviewsPrevious),
          viewsTrend: 0,
          offersTrend: 0,
          hiredTrend: this.calculateTrend(hired, hiredPrevious),
          conversionRateTrend: this.calculateTrend(conversionRate, conversionRatePrevious)
        };
      } else {
        // Реальні запити до бази даних для кандидата
        const [
          applications,
          applicationsPrevious,
          interviews,
          interviewsPrevious,
          hired,
          hiredPrevious
        ] = await Promise.all([
          this.getApplicationRepository().count({
            where: { userId: userId }
          }),
          this.getApplicationRepository().count({
            where: {
              userId: userId,
              createdAt: Between(twoMonthsAgo, monthAgo)
            }
          }),
          this.getInterviewRepository().count({
            where: {
              application: {
                userId: userId
              }
            }
          }),
          this.getInterviewRepository().count({
            where: {
              application: {
                userId: userId
              },
              createdAt: Between(twoMonthsAgo, monthAgo)
            }
          }),
          this.getApplicationRepository().count({
            where: {
              userId: userId,
              status: 'hired' as any
            }
          }),
          this.getApplicationRepository().count({
            where: {
              userId: userId,
              status: 'hired' as any,
              hiredAt: Between(twoMonthsAgo, monthAgo)
            }
          })
        ]);

        return {
          activeJobs: 0,
          candidates: 0,
          applications,
          interviews,
          views: 0, // Поки що 0, можна додати пізніше
          offers: 0, // Поки що 0, можна додати пізніше
          hired: hired,
          conversionRate: applications > 0 ? parseFloat(((hired / applications) * 100).toFixed(1)) : 0,
          applicationsTrend: this.calculateTrend(applications, applicationsPrevious),
          interviewsTrend: this.calculateTrend(interviews, interviewsPrevious),
          hiredTrend: this.calculateTrend(hired, hiredPrevious),
          conversionRateTrend: 0
        };
      }
    } catch (error) {
      console.error('Error getting user dashboard stats:', error);
      throw new Error(`Failed to get user dashboard stats: ${error.message}`);
    }
  }

  /**
   * Отримання активності для конкретного користувача
   */
  async getUserActivities(userId: string, role: string, limit: number = 10): Promise<Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
  }>> {
    try {
      const activities = [];

      if (role === 'employer') {
        // Реальні дані для роботодавця - останні заявки
        const recentApplications = await this.getApplicationRepository().find({
          where: {
            job: { createdByUserId: userId }
          },
          relations: ['user', 'job'],
          order: { createdAt: 'DESC' },
          take: limit
        });

        for (const application of recentApplications) {
          activities.push({
            id: application.id,
            type: 'application',
            title: 'Нова заявка на вакансію',
            description: `${application.job.title} - ${application.user?.firstName || 'Невідомо'} ${application.user?.lastName || ''}`,
            time: this.formatTimeAgo(application.createdAt)
          });
        }

        // Останні інтерв'ю
        const recentInterviews = await this.getInterviewRepository().find({
          where: {
            application: {
              job: { createdByUserId: userId }
            }
          },
          relations: ['application', 'application.user', 'application.job'],
          order: { createdAt: 'DESC' },
          take: Math.max(0, limit - activities.length)
        });

        for (const interview of recentInterviews) {
          activities.push({
            id: interview.id,
            type: 'interview',
            title: 'Заплановане інтерв\'ю',
            description: `${interview.application?.user?.firstName || 'Невідомо'} ${interview.application?.user?.lastName || ''} - ${interview.scheduledDate ? new Date(interview.scheduledDate).toLocaleString() : 'Час не вказано'}`,
            time: this.formatTimeAgo(interview.createdAt)
          });
        }
      } else {
        // Реальні дані для кандидата - останні заявки
        const recentApplications = await this.getApplicationRepository().find({
          where: {
            userId: userId
          },
          relations: ['job'],
          order: { createdAt: 'DESC' },
          take: limit
        });

        for (const application of recentApplications) {
          activities.push({
            id: application.id,
            type: 'application',
            title: 'Заявка розглядається',
            description: `${application.job.title} в ${application.job.company?.name || 'Невідома компанія'}`,
            time: this.formatTimeAgo(application.createdAt)
          });
        }

        // Останні інтерв'ю
        const recentInterviews = await this.getInterviewRepository().find({
          where: {
            application: {
              userId: userId
            }
          },
          relations: ['application', 'application.job'],
          order: { createdAt: 'DESC' },
          take: Math.max(0, limit - activities.length)
        });

        for (const interview of recentInterviews) {
          activities.push({
            id: interview.id,
            type: 'interview',
            title: 'Заплановане інтерв\'ю',
            description: `${interview.application?.job?.company?.name || 'Невідома компанія'} - ${interview.scheduledDate ? new Date(interview.scheduledDate).toLocaleString() : 'Час не вказано'}`,
            time: this.formatTimeAgo(interview.createdAt)
          });
        }
      }

      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error getting user activities:', error);
      throw new Error(`Failed to get user activities: ${error.message}`);
    }
  }

  /**
   * Отримання вакансій для конкретного користувача
   */
  async getUserJobs(userId: string, role: string, limit: number = 5): Promise<Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    status: string;
    applicationsCount: number;
    createdAt: Date;
  }>> {
    try {
      if (role === 'employer') {
        // Реальні дані для роботодавця - останні вакансії
        const jobs = await this.getJobRepository().find({
          where: {
            createdByUserId: userId,
            isActive: true
          },
          order: { createdAt: 'DESC' },
          take: limit
        });

        return jobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company?.name || 'Невідома компанія',
          location: job.location,
          type: job.type,
          status: job.status,
          applicationsCount: 0, // Поки що 0, можна додати пізніше
          createdAt: job.createdAt
        }));
      } else {
        // Реальні дані для кандидата - активні вакансії
        const jobs = await this.getJobRepository().find({
          where: {
            isActive: true,
            status: JobStatus.ACTIVE
          },
          order: { createdAt: 'DESC' },
          take: limit
        });

        return jobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company?.name || 'Невідома компанія',
          location: job.location,
          type: job.type,
          status: job.status,
          applicationsCount: 0,
          createdAt: job.createdAt
        }));
      }
    } catch (error) {
      console.error('Error getting user jobs:', error);
      throw new Error(`Failed to get user jobs: ${error.message}`);
    }
  }

  /**
   * Отримання інсайтів для конкретного користувача
   */
  async getUserInsights(userId: string, role: string): Promise<Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    priority: string;
    action?: string;
  }>> {
    try {
      const insights = [];

      if (role === 'employer') {
        // Реальні інсайти для роботодавця на основі даних
        const activeJobsCount = await this.getJobRepository().count({
          where: {
            createdByUserId: userId,
            isActive: true,
            status: JobStatus.ACTIVE
          }
        });

        const applicationsCount = await this.getApplicationRepository().count({
          where: {
            job: { createdByUserId: userId }
          }
        });

        if (activeJobsCount === 0) {
          insights.push({
            id: '1',
            title: 'Створіть першу вакансію',
            description: 'Почніть з створення вакансії для пошуку кандидатів',
            type: 'suggestion',
            priority: 'high',
            action: 'Створити вакансію'
          });
        } else if (applicationsCount === 0) {
          insights.push({
            id: '2',
            title: 'Покращте описи вакансій',
            description: 'Додайте більше деталей до описів вакансій для привабливості',
            type: 'suggestion',
            priority: 'medium',
            action: 'Редагувати вакансії'
          });
        } else {
          insights.push({
            id: '3',
            title: 'Активуйте пошук кандидатів',
            description: 'Використовуйте AI-пошук для знаходження найкращих кандидатів',
            type: 'suggestion',
            priority: 'high',
            action: 'Почати пошук'
          });
        }
      } else {
        // Реальні інсайти для кандидата на основі даних
        const applicationsCount = await this.getApplicationRepository().count({
          where: {
            userId: userId
          }
        });

        if (applicationsCount === 0) {
          insights.push({
            id: '1',
            title: 'Подайте першу заявку',
            description: 'Перегляньте доступні вакансії та подайте заявку',
            type: 'suggestion',
            priority: 'high',
            action: 'Переглянути вакансії'
          });
        } else {
          insights.push({
            id: '2',
            title: 'Оновіть профіль',
            description: 'Додайте нові навички та досвід для кращого пошуку роботи',
            type: 'suggestion',
            priority: 'medium',
            action: 'Редагувати профіль'
          });
        }
      }

      return insights;
    } catch (error) {
      console.error('Error getting user insights:', error);
      throw new Error(`Failed to get user insights: ${error.message}`);
    }
  }

  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100 * 100) / 100;
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'щойно';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} хвилин тому`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} годин тому`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} днів тому`;
    }
  }

  /**
   * Отримання рекомендацій для користувача
   */
  async getUserRecommendations(userId: string, limit: number = 5): Promise<any[]> {
    try {
      // Отримуємо користувача
      const user = await this.getUserRepository().findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Якщо користувач - кандидат, отримуємо рекомендовані вакансії
      if (user.role === 'candidate') {
        const jobs = await this.getJobRepository().find({
          where: { status: JobStatus.ACTIVE },
          take: limit,
          order: { createdAt: 'DESC' }
        });

        return jobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salaryMin ? `${job.salaryMin} - ${job.salaryMax}` : 'Not specified',
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits,
          matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
          createdAt: job.createdAt,
          updatedAt: job.updatedAt
        }));
      }

      // Якщо користувач - роботодавець, отримуємо рекомендованих кандидатів
      if (user.role === 'employer') {
        const candidates = await this.getCandidateProfileRepository().find({
          take: limit,
          order: { createdAt: 'DESC' }
        });

        return candidates.map(candidate => ({
          id: candidate.id,
          name: candidate.user?.firstName + ' ' + candidate.user?.lastName || 'Unknown',
          email: candidate.user?.email || 'No email',
          location: candidate.location,
          experience: candidate.yearsOfExperience,
          skills: candidate.skills,
          education: candidate.education,
          matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
          createdAt: candidate.createdAt,
          updatedAt: candidate.updatedAt
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      throw new Error(`Failed to get user recommendations: ${error.message}`);
    }
  }
}

export const dashboardServiceExtensions = new DashboardServiceExtensions();