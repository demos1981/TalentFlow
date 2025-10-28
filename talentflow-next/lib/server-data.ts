// Серверний шар для отримання даних
// Цей файл використовується тільки на сервері

export interface HomePageData {
  features: Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }>;
  stats: Array<{
    number: string;
    label: string;
  }>;
}

export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status: string;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

export interface CandidateData {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  skills: string[];
  education: string;
  availability: string;
  rating: number;
}

export interface CompanyData {
  id: string;
  name: string;
  industry: string;
  location: string;
  employees: string;
  website: string;
  rating: number;
  description: string;
  activeJobs: number;
  foundedYear: string;
  companySize: string;
  verified: boolean;
}

// Мокові дані для демонстрації
const mockFeatures = [
  {
    icon: 'brain',
    title: 'AI-підсилений пошук',
    description: 'Штучний інтелект аналізує профілі кандидатів та знаходить ідеальні пари',
    color: '#3B82F6'
  },
  {
    icon: 'users',
    title: 'Управління командою',
    description: 'Ефективне керування HR-процесами та командою рекрутерів',
    color: '#10B981'
  },
  {
    icon: 'chart',
    title: 'Аналітика та звіти',
    description: 'Детальна аналітика процесів найму та ефективності команди',
    color: '#F59E0B'
  },
  {
    icon: 'zap',
    title: 'Автоматизація',
    description: 'Автоматичні процеси для підвищення ефективності роботи',
    color: '#EF4444'
  }
];

const mockStats = [
  {
    number: '10,000+',
    label: 'Активних вакансій'
  },
  {
    number: '50,000+',
    label: 'Кандидатів'
  },
  {
    number: '1,000+',
    label: 'Компаній'
  },
  {
    number: '95%',
    label: 'Задоволеність клієнтів'
  }
];

const mockJobs: JobData[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'Київ, Україна',
    salary: '80,000 - 120,000 грн',
    type: 'Повна зайнятість',
    status: 'Активна',
    postedDate: '2024-01-15',
    description: 'Шукаємо досвідченого фронтенд розробника для роботи над сучасними веб-додатками.',
    requirements: ['React', 'TypeScript', 'Next.js', '5+ років досвіду'],
    benefits: ['Гнучкий графік', 'Медичне страхування', 'Навчання']
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Львів, Україна',
    salary: '60,000 - 90,000 грн',
    type: 'Повна зайнятість',
    status: 'Активна',
    postedDate: '2024-01-14',
    description: 'Відповідальна посада для управління продуктом та командою розробки.',
    requirements: ['Досвід в IT', 'Англійська мова', '3+ роки досвіду'],
    benefits: ['Опції', 'Віддалена робота', 'Професійний розвиток']
  }
];

const mockCandidates: CandidateData[] = [
  {
    id: '1',
    name: 'Олексій Петренко',
    email: 'oleksiy@example.com',
    phone: '+380501234567',
    experience: '5 років',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    education: 'КНУ ім. Т. Шевченка',
    availability: 'Негайно',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Марія Коваленко',
    email: 'maria@example.com',
    phone: '+380509876543',
    experience: '3 роки',
    skills: ['Vue.js', 'Python', 'Django', 'PostgreSQL'],
    education: 'ЛНУ ім. І. Франка',
    availability: '2 тижні',
    rating: 4.6
  }
];

const mockCompanies: CompanyData[] = [
  {
    id: '1',
    name: 'TechCorp',
    industry: 'IT',
    location: 'Київ, Україна',
    employees: '100-500',
    website: 'https://techcorp.ua',
    rating: 4.5,
    description: 'Провідна IT компанія в Україні',
    activeJobs: 15,
    foundedYear: '2015',
    companySize: 'Середня',
    verified: true
  },
  {
    id: '2',
    name: 'StartupXYZ',
    industry: 'Фінтех',
    location: 'Львів, Україна',
    employees: '10-50',
    website: 'https://startupxyz.com',
    rating: 4.2,
    description: 'Інноваційна фінтех компанія',
    activeJobs: 8,
    foundedYear: '2020',
    companySize: 'Мала',
    verified: false
  }
];

// Функції для отримання даних на сервері
export async function getHomePageData(): Promise<HomePageData> {
  // В реальному проекті тут буде запит до бази даних або API
  return {
    features: mockFeatures,
    stats: mockStats
  };
}

export async function getJobsData(): Promise<JobData[]> {
  // В реальному проекті тут буде запит до бази даних
  return mockJobs;
}

export async function getCandidatesData(): Promise<CandidateData[]> {
  // В реальному проекті тут буде запит до бази даних
  return mockCandidates;
}

export async function getCompaniesData(): Promise<CompanyData[]> {
  // В реальному проекті тут буде запит до бази даних
  return mockCompanies;
}

export async function getJobById(id: string): Promise<JobData | null> {
  const jobs = await getJobsData();
  return jobs.find(job => job.id === id) || null;
}

export async function getCandidateById(id: string): Promise<CandidateData | null> {
  const candidates = await getCandidatesData();
  return candidates.find(candidate => candidate.id === id) || null;
}

export async function getCompanyById(id: string): Promise<CompanyData | null> {
  const companies = await getCompaniesData();
  return companies.find(company => company.id === id) || null;
}