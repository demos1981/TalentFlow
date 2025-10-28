import { CandidateProfile } from '../services/candidateService';

export const mockCandidates: CandidateProfile[] = [
  {
    id: '1',
    userId: 'user1',
    summary: 'Senior Full-Stack Developer з 5+ роками досвіду в розробці веб-додатків',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    yearsOfExperience: 5,
    education: 'Магістр комп\'ютерних наук',
    certifications: ['AWS Certified Developer', 'MongoDB Developer'],
    languages: [
      { language: 'Українська', level: 'Рідна' },
      { language: 'Англійська', level: 'B2' },
      { language: 'Польська', level: 'A2' }
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
    portfolio: ['https://github.com/user1', 'https://portfolio.user1.dev'],
    preferences: {
      desiredSalary: 5000,
      preferredLocation: ['Київ', 'Львів', 'Віддалено'],
      remoteWork: true,
      relocation: true,
      travelPercentage: 10
    },
    rating: 4.8,
    views: 156,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
    user: {
      id: 'user1',
      firstName: 'Олександр',
      lastName: 'Петренко',
      email: 'alex.petrenko@email.com',
      phone: '+380501234567',
      location: 'Київ',
      city: 'Київ',
      country: 'Україна',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Досвідчений розробник з пасією до створення якісних продуктів',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      experience: 5
    }
  },
  {
    id: '2',
    userId: 'user2',
    summary: 'UX/UI Designer з досвідом створення інтуїтивних інтерфейсів',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
    yearsOfExperience: 3,
    education: 'Бакалавр дизайну',
    certifications: ['Google UX Design Certificate'],
    languages: [
      { language: 'Українська', level: 'Рідна' },
      { language: 'Англійська', level: 'C1' }
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
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-08-01')
      }
    ],
    portfolio: ['https://dribbble.com/user2', 'https://behance.net/user2'],
    preferences: {
      desiredSalary: 3500,
      preferredLocation: ['Київ', 'Віддалено'],
      remoteWork: true,
      relocation: false,
      travelPercentage: 5
    },
    rating: 4.6,
    views: 89,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-01-01'),
    user: {
      id: 'user2',
      firstName: 'Марія',
      lastName: 'Коваленко',
      email: 'maria.kovalenko@email.com',
      phone: '+380502345678',
      location: 'Київ',
      city: 'Київ',
      country: 'Україна',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Творчий дизайнер з фокусом на користувацький досвід',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      experience: 3
    }
  },
  {
    id: '3',
    userId: 'user3',
    summary: 'Product Manager з досвідом запуску успішних продуктів',
    skills: ['Product Strategy', 'Agile', 'Scrum', 'Data Analysis', 'User Research', 'A/B Testing'],
    yearsOfExperience: 4,
    education: 'MBA в управлінні проектами',
    certifications: ['Certified Scrum Master', 'Google Analytics Individual Qualification'],
    languages: [
      { language: 'Українська', level: 'Рідна' },
      { language: 'Англійська', level: 'C1' },
      { language: 'Німецька', level: 'B1' }
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
        startDate: new Date('2022-01-01'),
        endDate: new Date('2023-06-01')
      }
    ],
    portfolio: ['https://linkedin.com/in/user3'],
    preferences: {
      desiredSalary: 6000,
      preferredLocation: ['Київ', 'Берлін', 'Віддалено'],
      remoteWork: true,
      relocation: true,
      travelPercentage: 20
    },
    rating: 4.9,
    views: 234,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
    user: {
      id: 'user3',
      firstName: 'Дмитро',
      lastName: 'Сидоренко',
      email: 'dmitro.sydorenko@email.com',
      phone: '+380503456789',
      location: 'Київ',
      city: 'Київ',
      country: 'Україна',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Стратегічний мислитель з досвідом створення успішних продуктів',
      skills: ['Product Strategy', 'Agile', 'Data Analysis'],
      experience: 4
    }
  },
  {
    id: '4',
    userId: 'user4',
    summary: 'DevOps Engineer з експертизою в AWS та Kubernetes',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Prometheus', 'Grafana'],
    yearsOfExperience: 6,
    education: 'Магістр інформаційних технологій',
    certifications: ['AWS Solutions Architect', 'Kubernetes Administrator', 'Docker Certified Associate'],
    languages: [
      { language: 'Українська', level: 'Рідна' },
      { language: 'Англійська', level: 'C1' }
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
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-01')
      }
    ],
    portfolio: ['https://github.com/user4', 'https://medium.com/@user4'],
    preferences: {
      desiredSalary: 7000,
      preferredLocation: ['Київ', 'Львів', 'Віддалено'],
      remoteWork: true,
      relocation: true,
      travelPercentage: 15
    },
    rating: 4.7,
    views: 178,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
    user: {
      id: 'user4',
      firstName: 'Андрій',
      lastName: 'Мельник',
      email: 'andriy.melnyk@email.com',
      phone: '+380504567890',
      location: 'Львів',
      city: 'Львів',
      country: 'Україна',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Експерт з DevOps та хмарних технологій',
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
      experience: 6
    }
  },
  {
    id: '5',
    userId: 'user5',
    summary: 'Data Scientist з досвідом машинного навчання та аналізу даних',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL', 'Machine Learning'],
    yearsOfExperience: 4,
    education: 'Магістр математики',
    certifications: ['Google TensorFlow Developer', 'AWS Machine Learning Specialty'],
    languages: [
      { language: 'Українська', level: 'Рідна' },
      { language: 'Англійська', level: 'C1' },
      { language: 'Французька', level: 'B2' }
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
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-09-01')
      }
    ],
    portfolio: ['https://github.com/user5', 'https://kaggle.com/user5'],
    preferences: {
      desiredSalary: 5500,
      preferredLocation: ['Київ', 'Париж', 'Віддалено'],
      remoteWork: true,
      relocation: true,
      travelPercentage: 25
    },
    rating: 4.5,
    views: 145,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
    user: {
      id: 'user5',
      firstName: 'Анна',
      lastName: 'Шевченко',
      email: 'anna.shevchenko@email.com',
      phone: '+380505678901',
      location: 'Київ',
      city: 'Київ',
      country: 'Україна',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Дослідник даних з пасією до машинного навчання',
      skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Analysis'],
      experience: 4
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




