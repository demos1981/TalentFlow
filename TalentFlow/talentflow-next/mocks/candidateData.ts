import { Candidate } from '../services/candidateService';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    userId: 'user1',
    phone: '+380501234567',
    bio: 'Досвідчений розробник з пасією до створення якісних продуктів',
    location: 'Київ',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    yearsOfExperience: 5,
    education: ['Магістр комп\'ютерних наук'],
    certifications: [
      'AWS Certified Developer',
      'MongoDB Developer'
    ],
    languages: [
      'Українська',
      'Англійська',
      'Польська'
    ],
    workHistory: [
      {
        company: 'TechCorp',
        position: 'Senior Full-Stack Developer',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2024-01-01'),
        description: 'Розробка масштабних веб-додатків з використанням React та Node.js'
      },
      {
        company: 'StartupHub',
        position: 'Full-Stack Developer',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2020-12-31'),
        description: 'Створення MVP для стартапу в сфері фінтех'
      }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Повнофункціональна платформа для онлайн-торгівлі',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        url: 'https://github.com/user1/ecommerce',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-06-01')
      }
    ],
    portfolio: 'https://portfolio.user1.dev',
    github: 'https://github.com/user1',
    preferences: {
      salaryExpectation: 5000,
      preferredLocation: 'Київ',
      remoteWork: true,
      relocation: true
    },
    rating: 4.8,
    isActive: true,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    user: {
      id: 'user1',
      firstName: 'Олександр',
      lastName: 'Петренко',
      email: 'alex.petrenko@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      lastActiveAt: '2024-01-15T14:20:00Z'
    }
  },
  {
    id: '2',
    userId: 'user2',
    phone: '+380502345678',
    bio: 'Творчий дизайнер з фокусом на користувацький досвід',
    location: 'Київ',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
    yearsOfExperience: 3,
    education: ['Бакалавр дизайну'],
    certifications: [
      'Google UX Design Certificate'
    ],
    languages: [
      'Українська',
      'Англійська'
    ],
    workHistory: [
      {
        company: 'DesignStudio',
        position: 'UX/UI Designer',
        startDate: new Date('2022-03-01'),
        endDate: new Date('2024-01-01'),
        description: 'Створення дизайн-систем та прототипів для мобільних додатків'
      }
    ],
    projects: [
      {
        name: 'Mobile Banking App',
        description: 'Дизайн інтерфейсу для банківського мобільного додатку',
        technologies: ['Figma', 'Prototyping', 'Design Systems'],
        startDate: new Date('2022-06-01'),
        endDate: new Date('2022-12-01')
      }
    ],
    portfolio: 'https://behance.net/user2',
    linkedin: 'https://linkedin.com/in/user2',
    preferences: {
      salaryExpectation: 3500,
      preferredLocation: 'Київ',
      remoteWork: true,
      relocation: false
    },
    rating: 4.6,
    isActive: true,
    createdAt: '2022-03-15T09:15:00Z',
    updatedAt: '2024-01-10T16:45:00Z',
    user: {
      id: 'user2',
      firstName: 'Марія',
      lastName: 'Коваленко',
      email: 'maria.kovalenko@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      lastActiveAt: '2024-01-10T16:45:00Z'
    }
  },
  {
    id: '3',
    userId: 'user3',
    phone: '+380503456789',
    bio: 'Стратегічний мислитель з досвідом створення успішних продуктів',
    location: 'Київ',
    skills: ['Product Strategy', 'Agile', 'Scrum', 'Data Analysis', 'User Research', 'A/B Testing'],
    yearsOfExperience: 4,
    education: ['MBA в управлінні проектами'],
    certifications: [
      'Certified Scrum Master',
      'Google Analytics Individual Qualification'
    ],
    languages: [
      'Українська',
      'Англійська',
      'Німецька'
    ],
    workHistory: [
      {
        company: 'ProductHub',
        position: 'Senior Product Manager',
        startDate: new Date('2021-09-01'),
        endDate: new Date('2024-01-01'),
        description: 'Управління продуктом з 1M+ користувачів'
      },
      {
        company: 'StartupXYZ',
        position: 'Product Manager',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-08-31'),
        description: 'Запуск та розвиток SaaS продукту'
      }
    ],
    projects: [
      {
        name: 'SaaS Analytics Platform',
        description: 'Платформа аналітики для SaaS компаній',
        technologies: ['Product Strategy', 'Data Analysis', 'User Research'],
        startDate: new Date('2021-03-01'),
        endDate: new Date('2021-12-01')
      }
    ],
    linkedin: 'https://linkedin.com/in/user3',
    preferences: {
      salaryExpectation: 6000,
      preferredLocation: 'Київ',
      remoteWork: true,
      relocation: true
    },
    rating: 4.9,
    isActive: true,
    createdAt: '2021-09-10T11:20:00Z',
    updatedAt: '2024-01-12T13:30:00Z',
    user: {
      id: 'user3',
      firstName: 'Дмитро',
      lastName: 'Сидоренко',
      email: 'dmitro.sydorenko@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      lastActiveAt: '2024-01-12T13:30:00Z'
    }
  },
  {
    id: '4',
    userId: 'user4',
    phone: '+380504567890',
    bio: 'Експерт з DevOps та хмарних технологій',
    location: 'Львів',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Prometheus', 'Grafana'],
    yearsOfExperience: 6,
    education: ['Магістр інформаційних технологій'],
    certifications: [
      'AWS Solutions Architect',
      'Kubernetes Administrator',
      'Docker Certified Associate'
    ],
    languages: [
      'Українська',
      'Англійська'
    ],
    workHistory: [
      {
        company: 'CloudTech',
        position: 'Senior DevOps Engineer',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2024-01-01'),
        description: 'Автоматизація CI/CD та управління інфраструктурою в хмарі'
      },
      {
        company: 'TechCorp',
        position: 'DevOps Engineer',
        startDate: new Date('2018-03-01'),
        endDate: new Date('2020-05-31'),
        description: 'Налаштування та підтримка інфраструктури розробки'
      }
    ],
    projects: [
      {
        name: 'Multi-Cloud Infrastructure',
        description: 'Автоматизована інфраструктура на AWS та Azure',
        technologies: ['AWS', 'Terraform', 'Kubernetes', 'Jenkins'],
        startDate: new Date('2020-09-01'),
        endDate: new Date('2021-03-01')
      }
    ],
    portfolio: 'https://medium.com/@user4',
    github: 'https://github.com/user4',
    preferences: {
      salaryExpectation: 7000,
      preferredLocation: 'Львів',
      remoteWork: true,
      relocation: true
    },
    rating: 4.7,
    isActive: true,
    createdAt: '2020-06-05T08:45:00Z',
    updatedAt: '2024-01-08T12:15:00Z',
    user: {
      id: 'user4',
      firstName: 'Андрій',
      lastName: 'Мельник',
      email: 'andriy.melnyk@email.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      lastActiveAt: '2024-01-08T12:15:00Z'
    }
  },
  {
    id: '5',
    userId: 'user5',
    phone: '+380505678901',
    bio: 'Дослідник даних з пасією до машинного навчання',
    location: 'Київ',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL', 'Machine Learning'],
    yearsOfExperience: 4,
    education: ['Магістр математики'],
    certifications: [
      'Google TensorFlow Developer',
      'AWS Machine Learning Specialty'
    ],
    languages: [
      'Українська',
      'Англійська',
      'Французька'
    ],
    workHistory: [
      {
        company: 'DataLab',
        position: 'Senior Data Scientist',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2024-01-01'),
        description: 'Розробка ML моделей для прогнозування та класифікації'
      }
    ],
    projects: [
      {
        name: 'Recommendation System',
        description: 'Система рекомендацій на основі машинного навчання',
        technologies: ['Python', 'TensorFlow', 'Pandas', 'SQL'],
        startDate: new Date('2021-06-01'),
        endDate: new Date('2022-02-01')
      }
    ],
    portfolio: 'https://kaggle.com/user5',
    github: 'https://github.com/user5',
    preferences: {
      salaryExpectation: 5500,
      preferredLocation: 'Київ',
      remoteWork: true,
      relocation: true
    },
    rating: 4.5,
    isActive: true,
    createdAt: '2021-01-20T14:10:00Z',
    updatedAt: '2024-01-05T09:25:00Z',
    user: {
      id: 'user5',
      firstName: 'Анна',
      lastName: 'Шевченко',
      email: 'anna.shevchenko@email.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      lastActiveAt: '2024-01-05T09:25:00Z'
    }
  }
];

export const mockSearchStats = {
  totalCandidates: 1250,
  activeCandidates: 890,
  averageRating: 4.6,
  topSkills: [
    { name: 'JavaScript', count: 156 },
    { name: 'React', count: 134 },
    { name: 'Python', count: 98 },
    { name: 'Node.js', count: 87 },
    { name: 'TypeScript', count: 76 },
    { name: 'AWS', count: 65 },
    { name: 'Docker', count: 58 },
    { name: 'Kubernetes', count: 45 }
  ],
  locationDistribution: [
    { location: 'Київ', count: 234 },
    { location: 'Львів', count: 156 },
    { location: 'Харків', count: 98 },
    { location: 'Одеса', count: 87 },
    { location: 'Дніпро', count: 76 },
    { location: 'Івано-Франківськ', count: 45 }
  ]
};

export const mockSkills = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
  'HTML', 'CSS', 'Sass', 'Less', 'Bootstrap', 'Tailwind CSS',
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'Git', 'CI/CD', 'Agile', 'Scrum', 'Kanban',
  'UI/UX Design', 'Graphic Design', 'Product Management',
  'Data Analysis', 'Machine Learning', 'AI', 'DevOps'
];

export const mockLocations = [
  'Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро', 'Запоріжжя',
  'Івано-Франківськ', 'Тернопіль', 'Рівне', 'Луцьк', 'Ужгород',
  'Хмельницький', 'Вінниця', 'Полтава', 'Суми', 'Черкаси',
  'Чернігів', 'Чернівці', 'Миколаїв', 'Херсон', 'Кропивницький'
];
