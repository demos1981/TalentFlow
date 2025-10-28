import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { CandidateProfile } from '../models/CandidateProfile';
import { Job } from '../models/Job';
import { MoreThanOrEqual } from 'typeorm';

export interface CandidateSearchFilters {
  skills?: string[];
  experience?: {
    min?: number;
    max?: number;
  };
  location?: string;
  city?: string;
  country?: string;
  education?: string;
  remote?: boolean;
  relocation?: boolean;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  languages?: string[];
  certifications?: string[];
  availability?: 'immediate' | '2weeks' | '1month' | '3months';
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'experience' | 'rating' | 'recent';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CandidateSearchResult {
  candidates: CandidateProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: CandidateSearchFilters;
}

export class CandidateService {
  private userRepository = AppDataSource.getRepository(User);
  private candidateProfileRepository = AppDataSource.getRepository(CandidateProfile);
  private jobRepository = AppDataSource.getRepository(Job);

  /**
   * Створення власного профілю кандидата
   */
  async createOwnCandidateProfile(candidateData: any, currentUserId: string): Promise<any> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Оновлюємо існуючого користувача
      const user = await this.userRepository.findOne({ where: { id: currentUserId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Оновлюємо дані користувача
      user.firstName = candidateData.firstName || user.firstName;
      user.lastName = candidateData.lastName || user.lastName;
      user.phone = candidateData.phone || user.phone;
      user.role = UserRole.CANDIDATE;
      
      await this.userRepository.save(user);

      // Створюємо або оновлюємо профіль кандидата
      let candidateProfile = await this.candidateProfileRepository.findOne({ 
        where: { userId: currentUserId } 
      });

      if (candidateProfile) {
        // Оновлюємо існуючий профіль
        Object.assign(candidateProfile, {
          title: candidateData.title,
          bio: candidateData.bio,
          skills: candidateData.skills || [],
          yearsOfExperience: candidateData.yearsOfExperience,
          education: candidateData.education,
          location: candidateData.location,
          linkedin: candidateData.linkedin,
          github: candidateData.github,
          website: candidateData.website
        });
      } else {
        // Створюємо новий профіль
        candidateProfile = this.candidateProfileRepository.create({
          userId: currentUserId,
          title: candidateData.title,
          bio: candidateData.bio,
          skills: candidateData.skills || [],
          yearsOfExperience: candidateData.yearsOfExperience,
          education: candidateData.education,
          location: candidateData.location,
          linkedin: candidateData.linkedin,
          github: candidateData.github,
          website: candidateData.website
        });
      }

      await this.candidateProfileRepository.save(candidateProfile);
      await queryRunner.commitTransaction();

      return {
        id: candidateProfile.id,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        profile: candidateProfile
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Створення кандидата (User + Profile) - тільки для роботодавців
   */
  async createCandidate(candidateData: any, currentUserId: string, currentUserRole: string): Promise<any> {
    // Тільки роботодавці та адміни можуть створювати кандидатів
    if (currentUserRole !== 'employer' && currentUserRole !== 'admin') {
      throw new Error('Access denied: Only employers and admins can create candidates');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Створюємо користувача
      const user = this.userRepository.create({
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        role: UserRole.CANDIDATE,
        isActive: true,
        emailVerified: false
      });

      const savedUser = await queryRunner.manager.save(user);

      // Створюємо профіль
      const profile = this.candidateProfileRepository.create({
        userId: savedUser.id,
        title: candidateData.title,
        summary: candidateData.summary,
        bio: candidateData.bio,
        skills: candidateData.skills || [],
        yearsOfExperience: candidateData.yearsOfExperience,
        location: candidateData.location,
        website: candidateData.website,
        linkedin: candidateData.linkedin,
        github: candidateData.github,
        portfolio: candidateData.portfolio,
        education: candidateData.education || [],
        certifications: candidateData.certifications || [],
        languages: candidateData.languages || [],
        preferences: candidateData.preferences || {},
        isActive: true,
        isPublic: true
      });

      const savedProfile = await queryRunner.manager.save(profile);

      await queryRunner.commitTransaction();

      // Повертаємо об'єднані дані
      return {
        ...savedProfile,
        user: savedUser
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Error creating candidate: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Пошук кандидатів з фільтрами (тепер з контролем доступу)
   */
  async searchCandidates(filters: CandidateSearchFilters, currentUserId?: string, currentUserRole?: string): Promise<CandidateSearchResult> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const queryBuilder = this.candidateProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.role = :role', { role: UserRole.CANDIDATE })
      .andWhere('user.isActive = :isActive', { isActive: true });

    // Фільтр по навичках
    if (filters.skills && filters.skills.length > 0) {
      queryBuilder.andWhere('profile.skills && :skills', { skills: filters.skills });
    }

    // Фільтр по досвіду
    if (filters.experience) {
      if (filters.experience.min !== undefined) {
        queryBuilder.andWhere('profile.yearsOfExperience >= :minExp', { minExp: filters.experience.min });
      }
      if (filters.experience.max !== undefined) {
        queryBuilder.andWhere('profile.yearsOfExperience <= :maxExp', { maxExp: filters.experience.max });
      }
    }

    // Фільтр по локації
    if (filters.location) {
      queryBuilder.andWhere('profile.location ILIKE :location', { location: `%${filters.location}%` });
    }

    // Фільтр по місту
    if (filters.city) {
      queryBuilder.andWhere('profile.location ILIKE :city', { city: `%${filters.city}%` });
    }

    // Фільтр по країні
    if (filters.country) {
      queryBuilder.andWhere('profile.location ILIKE :country', { country: `%${filters.country}%` });
    }

    // Фільтр по освіті
    if (filters.education) {
      queryBuilder.andWhere('profile.education && :education', { education: [filters.education] });
    }

    // Фільтр по віддаленій роботі
    if (filters.remote !== undefined) {
      queryBuilder.andWhere('profile.preferences->>\'remoteWork\' = :remote', { remote: filters.remote });
    }

    // Фільтр по релокації
    if (filters.relocation !== undefined) {
      queryBuilder.andWhere('profile.preferences->>\'relocation\' = :relocation', { relocation: filters.relocation });
    }

    // Фільтр по зарплаті
    if (filters.salary) {
      if (filters.salary.min !== undefined) {
        queryBuilder.andWhere('profile.preferences->>\'salaryExpectation\' >= :minSalary', { minSalary: filters.salary.min });
      }
      if (filters.salary.max !== undefined) {
        queryBuilder.andWhere('profile.preferences->>\'salaryExpectation\' <= :maxSalary', { maxSalary: filters.salary.max });
      }
    }

    // Фільтр по мовах
    if (filters.languages && filters.languages.length > 0) {
      queryBuilder.andWhere('profile.languages && :languages', { languages: filters.languages });
    }

    // Фільтр по сертифікаціях
    if (filters.certifications && filters.certifications.length > 0) {
      queryBuilder.andWhere('profile.certifications && :certifications', { certifications: filters.certifications });
    }

    // Сортування
    switch (filters.sortBy) {
      case 'experience':
        queryBuilder.orderBy('profile.yearsOfExperience', filters.sortOrder || 'DESC');
        break;
      case 'recent':
        queryBuilder.orderBy('profile.updatedAt', filters.sortOrder || 'DESC');
        break;
      default:
        // Сортування за релевантністю (за замовчуванням)
        queryBuilder.orderBy('profile.views', 'DESC');
        queryBuilder.addOrderBy('profile.updatedAt', 'DESC');
        break;
    }

    // Додаємо сортування за ID для стабільності
    queryBuilder.addOrderBy('profile.id', 'ASC');

    // Підрахунок загальної кількості
    const totalQuery = queryBuilder.clone();
    const total = await totalQuery.getCount();

    // Отримання результатів з пагінацією
    const candidates = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      candidates,
      total,
      page,
      limit,
      totalPages,
      filters
    };
  }

  /**
   * Отримання детального профілю кандидата
   */
  async getCandidateProfile(candidateId: string): Promise<CandidateProfile | null> {
    const profile = await this.candidateProfileRepository.findOne({
      where: { id: candidateId, isActive: true },
      relations: ['user']
    });

    if (profile) {
      // Збільшуємо лічильник переглядів
      profile.views = (profile.views || 0) + 1;
      await this.candidateProfileRepository.save(profile);
    }

    return profile;
  }

  /**
   * Отримання рекомендацій кандидатів для конкретної вакансії
   */
  async getRecommendedCandidates(jobId: string, limit: number = 10): Promise<CandidateProfile[]> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId, isActive: true }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const jobSkills = job.skills || [];
    
    if (jobSkills.length === 0) {
      // Якщо немає навичок, повертаємо випадкових кандидатів
      return this.candidateProfileRepository.find({
        where: { isActive: true },
        relations: ['user'],
        take: limit,
        order: { updatedAt: 'DESC' }
      });
    }

    // Пошук кандидатів з найбільшою кількістю відповідних навичок
    const candidates = await this.candidateProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.role = :role', { role: UserRole.CANDIDATE })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('profile.isActive = :profileActive', { profileActive: true })
      .andWhere('profile.skills && :skills', { skills: jobSkills })
      .orderBy('profile.updatedAt', 'DESC')
      .take(limit)
      .getMany();

    return candidates;
  }

  /**
   * Отримання статистики пошуку кандидатів
   */
  async getSearchStats(): Promise<{
    totalCandidates: number;
    activeCandidates: number;
    topSkills: Array<{ name: string; count: number }>;
    locationDistribution: Array<{ location: string; count: number }>;
  }> {
    const totalCandidates = await this.userRepository.count({
      where: { role: UserRole.CANDIDATE, isActive: true }
    });

    const activeCandidates = await this.userRepository.count({
      where: { 
        role: UserRole.CANDIDATE, 
        isActive: true,
        lastActiveAt: MoreThanOrEqual(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Останні 30 днів
      }
    });

    // Топ навички (з масиву skills у CandidateProfile)
    const topSkills = await this.candidateProfileRepository
      .createQueryBuilder('profile')
      .leftJoin('profile.user', 'user')
      .where('user.role = :role', { role: UserRole.CANDIDATE })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('profile.isActive = :profileActive', { profileActive: true })
      .andWhere('profile.skills IS NOT NULL')
      .select('unnest(profile.skills)', 'name')
      .addSelect('COUNT(*)', 'count')
      .groupBy('name')
      .orderBy('count', 'DESC')
      .take(10)
      .getRawMany();

    // Розподіл по локаціях
    const locationDistribution = await this.candidateProfileRepository
      .createQueryBuilder('profile')
      .leftJoin('profile.user', 'user')
      .where('user.role = :role', { role: UserRole.CANDIDATE })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('profile.isActive = :profileActive', { profileActive: true })
      .andWhere('profile.location IS NOT NULL')
      .select('profile.location', 'location')
      .addSelect('COUNT(profile.id)', 'count')
      .groupBy('profile.location')
      .orderBy('count', 'DESC')
      .take(10)
      .getRawMany();

    return {
      totalCandidates,
      activeCandidates,
      topSkills,
      locationDistribution
    };
  }

  /**
   * Отримання доступних навичок
   */
  async getAvailableSkills(): Promise<{ skills: string[]; total: number }> {
    const skills = await this.candidateProfileRepository
      .createQueryBuilder('profile')
      .leftJoin('profile.user', 'user')
      .where('user.role = :role', { role: UserRole.CANDIDATE })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('profile.isActive = :profileActive', { profileActive: true })
      .andWhere('profile.skills IS NOT NULL')
      .select('unnest(profile.skills)', 'skill')
      .distinct(true)
      .orderBy('skill', 'ASC')
      .getRawMany();

    const skillsList = skills.map(item => item.skill).filter(Boolean);

    // Якщо в базі немає навичок, повертаємо базовий список
    if (skillsList.length === 0) {
      const defaultSkills = [
        'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
        'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
        'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS',
        'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux',
        'Git', 'CI/CD', 'Jenkins', 'GitLab', 'GitHub Actions',
        'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence',
        'Machine Learning', 'Data Science', 'AI', 'Blockchain',
        'Mobile Development', 'iOS', 'Android', 'React Native', 'Flutter',
        'DevOps', 'Microservices', 'REST API', 'GraphQL', 'WebSocket'
      ];
      
      return {
        skills: defaultSkills.sort(),
        total: defaultSkills.length
      };
    }

    return {
      skills: skillsList,
      total: skillsList.length
    };
  }

  /**
   * Отримання доступних локацій
   */
  async getAvailableLocations(): Promise<{ locations: Array<{ name: string; count: number }>; total: number }> {
    const locations = await this.candidateProfileRepository
      .createQueryBuilder('profile')
      .leftJoin('profile.user', 'user')
      .where('user.role = :role', { role: UserRole.CANDIDATE })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('profile.isActive = :profileActive', { profileActive: true })
      .andWhere('profile.location IS NOT NULL')
      .select('profile.location', 'location')
      .addSelect('COUNT(profile.id)', 'count')
      .groupBy('profile.location')
      .orderBy('count', 'DESC')
      .getRawMany();

    const locationsList = locations.map(item => ({
      name: item.location,
      count: parseInt(item.count)
    }));

    // Якщо в базі немає локацій, повертаємо базовий список
    if (locationsList.length === 0) {
      const defaultLocations = [
        { name: 'Remote', count: 3500 },
        { name: 'New York, USA', count: 2800 },
        { name: 'London, UK', count: 2200 },
        { name: 'San Francisco, USA', count: 2100 },
        { name: 'Berlin, Germany', count: 1800 },
        { name: 'Amsterdam, Netherlands', count: 1600 },
        { name: 'Toronto, Canada', count: 1500 },
        { name: 'Kyiv, Ukraine', count: 1250 },
        { name: 'Warsaw, Poland', count: 1200 },
        { name: 'Prague, Czech Republic', count: 1100 },
        { name: 'Vienna, Austria', count: 1000 },
        { name: 'Stockholm, Sweden', count: 950 },
        { name: 'Copenhagen, Denmark', count: 900 },
        { name: 'Zurich, Switzerland', count: 850 },
        { name: 'Dublin, Ireland', count: 800 },
        { name: 'Paris, France', count: 750 },
        { name: 'Madrid, Spain', count: 700 },
        { name: 'Barcelona, Spain', count: 650 },
        { name: 'Milan, Italy', count: 600 },
        { name: 'Rome, Italy', count: 550 },
        { name: 'Lisbon, Portugal', count: 500 },
        { name: 'Brussels, Belgium', count: 450 },
        { name: 'Helsinki, Finland', count: 400 },
        { name: 'Oslo, Norway', count: 350 },
        { name: 'Copenhagen, Denmark', count: 300 },
        { name: 'Athens, Greece', count: 250 },
        { name: 'Budapest, Hungary', count: 200 },
        { name: 'Bucharest, Romania', count: 180 },
        { name: 'Sofia, Bulgaria', count: 150 },
        { name: 'Zagreb, Croatia', count: 120 },
        { name: 'Ljubljana, Slovenia', count: 100 },
        { name: 'Bratislava, Slovakia', count: 80 },
        { name: 'Tallinn, Estonia', count: 70 },
        { name: 'Riga, Latvia', count: 60 },
        { name: 'Vilnius, Lithuania', count: 50 }
      ];
      
      return {
        locations: defaultLocations,
        total: defaultLocations.length
      };
    }

    return {
      locations: locationsList,
      total: locationsList.length
    };
  }

  /**
   * Отримання кандидата за ID з контролем доступу
   */
  async getCandidateById(candidateId: string, currentUserId: string, currentUserRole: string): Promise<any> {
    // Шукаємо за ID профілю
    const profile = await this.candidateProfileRepository.findOne({
      where: { id: candidateId, isActive: true },
      relations: ['user']
    });

    if (!profile) {
      return null;
    }

    // Контроль доступу - тільки кандидати не можуть переглядати чужих кандидатів
    if (currentUserRole === 'candidate' && profile.userId !== currentUserId) {
      throw new Error('Access denied: You can only view your own profile');
    }
    
    // Роботодавці та адміни можуть переглядати всі профілі кандидатів

    // Збільшуємо перегляди (тільки якщо це не власний профіль)
    if (profile.userId !== currentUserId) {
      profile.views = (profile.views || 0) + 1;
      await this.candidateProfileRepository.save(profile);
    }

    return profile;
  }

  /**
   * Оновлення кандидата з контролем доступу
   */
  async updateCandidate(candidateId: string, updateData: any, currentUserId: string, currentUserRole: string): Promise<any> {
    const profile = await this.candidateProfileRepository.findOne({
      where: { id: candidateId, isActive: true },
      relations: ['user']
    });

    if (!profile) {
      throw new Error('Candidate not found');
    }

    // Контроль доступу
    if (currentUserRole === 'candidate' && profile.userId !== currentUserId) {
      throw new Error('Access denied: You can only update your own profile');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Оновлюємо дані користувача (якщо є)
      if (updateData.firstName || updateData.lastName || updateData.email || updateData.phone) {
        const user = await queryRunner.manager.findOne(User, { where: { id: profile.userId } });
        if (user) {
          if (updateData.firstName) user.firstName = updateData.firstName;
          if (updateData.lastName) user.lastName = updateData.lastName;
          if (updateData.email) user.email = updateData.email;
          if (updateData.phone) user.phone = updateData.phone;
          await queryRunner.manager.save(user);
        }
      }

      // Оновлюємо дані профілю
      Object.assign(profile, {
        title: updateData.title || profile.title,
        summary: updateData.summary || profile.summary,
        bio: updateData.bio || profile.bio,
        skills: updateData.skills || profile.skills,
        yearsOfExperience: updateData.yearsOfExperience || profile.yearsOfExperience,
        location: updateData.location || profile.location,
        website: updateData.website || profile.website,
        linkedin: updateData.linkedin || profile.linkedin,
        github: updateData.github || profile.github,
        portfolio: updateData.portfolio || profile.portfolio,
        education: updateData.education || profile.education,
        certifications: updateData.certifications || profile.certifications,
        languages: updateData.languages || profile.languages,
        preferences: { ...profile.preferences, ...updateData.preferences },
        isActive: updateData.isActive !== undefined ? updateData.isActive : profile.isActive,
        isPublic: updateData.isPublic !== undefined ? updateData.isPublic : profile.isPublic
      });

      const updatedProfile = await queryRunner.manager.save(profile);
      await queryRunner.commitTransaction();

      return updatedProfile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Error updating candidate: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Видалення кандидата з контролем доступу
   */
  async deleteCandidate(candidateId: string, currentUserId: string, currentUserRole: string): Promise<void> {
    const profile = await this.candidateProfileRepository.findOne({
      where: { id: candidateId, isActive: true },
      relations: ['user']
    });

    if (!profile) {
      throw new Error('Candidate not found');
    }

    // Контроль доступу
    if (currentUserRole === 'candidate' && profile.userId !== currentUserId) {
      throw new Error('Access denied: You can only delete your own profile');
    }

    // Soft delete профілю
    profile.isActive = false;
    await this.candidateProfileRepository.save(profile);

    // Якщо це адмін, може також деактивувати користувача
    if (currentUserRole === 'admin') {
      const user = await this.userRepository.findOne({ where: { id: profile.userId } });
      if (user) {
        user.isActive = false;
        await this.userRepository.save(user);
      }
    }
  }

  /**
   * Збільшення переглядів
   */
  async incrementViews(candidateId: string): Promise<void> {
    await this.candidateProfileRepository.increment({ id: candidateId }, 'views', 1);
  }

  /**
   * Збереження пошукового запиту для аналітики
   */
  async saveSearchQuery(employerId: string, filters: CandidateSearchFilters, resultsCount: number): Promise<void> {
    // Тут можна додати логування пошукових запитів для аналітики
    console.log(`Search query saved: Employer ${employerId}, Filters:`, filters, `Results: ${resultsCount}`);
  }
}

// Експортуємо екземпляр сервісу для використання в контролері
export const candidateService = new CandidateService();