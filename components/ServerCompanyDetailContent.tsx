import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Building2, 
  MapPin, 
  Users, 
  Briefcase,
  Calendar,
  Star,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  Eye
} from 'lucide-react';
import './ServerCompanyDetailContent.css';

interface ServerCompanyDetailContentProps {
  companyId: string;
}

// Мокові дані для конкретної компанії
const getCompanyDetail = (id: string) => {
  const companies = [
    {
      id: '1',
      name: 'TechCorp',
      industry: 'IT',
      location: 'Київ, Україна',
      companySize: '50-200 співробітників',
      foundedYear: '2015',
      description: 'Інноваційна IT компанія, що спеціалізується на розробці веб-додатків та мобільних рішень. Ми створюємо сучасні технологічні рішення для клієнтів по всьому світу.',
      website: 'https://techcorp.com',
      email: 'hr@techcorp.com',
      phone: '+380 44 123 4567',
      verified: true,
      activeJobs: 12,
      benefits: [
        'Конкурентна заробітна плата',
        'Гнучкий графік роботи',
        'Медичне страхування',
        'Навчання та розвиток',
        'Сучасне обладнання',
        'Спортивний зал',
        'Бронювання'
      ],
      culture: [
        'Інноваційний підхід',
        'Командна робота',
        'Відкритість до нових ідей',
        'Професійний розвиток'
      ],
      jobs: [
        {
          id: '1',
          title: 'Frontend Developer',
          type: 'Повна зайнятість',
          salary: '$3000-5000 USD',
          postedDate: '2 дні тому',
          requirements: ['React', 'TypeScript', 'Next.js']
        },
        {
          id: '2',
          title: 'Backend Developer',
          type: 'Повна зайнятість',
          salary: '$3500-6000 USD',
          postedDate: '1 день тому',
          requirements: ['Node.js', 'PostgreSQL', 'MongoDB']
        },
        {
          id: '3',
          title: 'DevOps Engineer',
          type: 'Повна зайнятість',
          salary: '$4000-7000 USD',
          postedDate: '3 дні тому',
          requirements: ['Docker', 'Kubernetes', 'AWS']
        }
      ]
    },
    {
      id: '2',
      name: 'DesignStudio',
      industry: 'Дизайн',
      location: 'Львів, Україна',
      companySize: '20-50 співробітників',
      foundedYear: '2018',
      description: 'Креативна студія дизайну, що створює унікальні рішення для клієнтів по всьому світу. Ми спеціалізуємося на UI/UX дизайні та брендингу.',
      website: 'https://designstudio.com',
      email: 'hello@designstudio.com',
      phone: '+380 32 123 4567',
      verified: true,
      activeJobs: 5,
      benefits: [
        'Творча атмосфера',
        'Сучасне обладнання',
        'Участь у конференціях',
        'Професійний розвиток',
        'Гнучкий графік'
      ],
      culture: [
        'Креативність',
        'Інновації',
        'Командна робота',
        'Відкритість'
      ],
      jobs: [
        {
          id: '4',
          title: 'UX/UI Designer',
          type: 'Повна зайнятість',
          salary: '$2500-4000 USD',
          postedDate: '1 день тому',
          requirements: ['Figma', 'Adobe Creative Suite', '3+ роки досвіду']
        },
        {
          id: '5',
          title: 'Graphic Designer',
          type: 'Повна зайнятість',
          salary: '$2000-3500 USD',
          postedDate: '4 дні тому',
          requirements: ['Photoshop', 'Illustrator', 'InDesign']
        }
      ]
    },
    {
      id: '3',
      name: 'DataTech',
      industry: 'IT',
      location: 'Харків, Україна',
      companySize: '100-500 співробітників',
      foundedYear: '2012',
      description: 'Технологічна компанія, що займається розробкою масштабних систем обробки даних та машинного навчання.',
      website: 'https://datatech.com',
      email: 'careers@datatech.com',
      phone: '+380 57 123 4567',
      verified: true,
      activeJobs: 8,
      benefits: [
        'Високий рівень заробітної плати',
        'Віддалена робота',
        'Технічне навчання',
        'Спортивний зал',
        'Медичне страхування',
        'Бонуси за результати'
      ],
      culture: [
        'Технічна експертиза',
        'Інновації',
        'Незалежність',
        'Професійний розвиток'
      ],
      jobs: [
        {
          id: '6',
          title: 'Backend Developer',
          type: 'Повна зайнятість',
          salary: '$3500-6000 USD',
          postedDate: '3 дні тому',
          requirements: ['Node.js', 'PostgreSQL', 'MongoDB']
        },
        {
          id: '7',
          title: 'Data Scientist',
          type: 'Повна зайнятість',
          salary: '$4000-7000 USD',
          postedDate: '5 днів тому',
          requirements: ['Python', 'Machine Learning', 'Statistics']
        }
      ]
    }
  ];
  
  return companies.find(company => company.id === id) || companies[0];
};

export const ServerCompanyDetailContent: React.FC<ServerCompanyDetailContentProps> = ({ companyId }) => {
  const company = getCompanyDetail(companyId);

  return (
    <div className="company-detail-container">
      {/* Кнопка назад */}
      <div className="back-button-section">
        <Link href="/companies" className="back-button">
          <ArrowLeft className="icon" />
          Назад до компаній
        </Link>
      </div>

      {/* Заголовок компанії */}
      <div className="company-detail-header">
        <div className="company-title-section">
          <div className="company-title-row">
            <h1 className="company-title">{company.name}</h1>
            {company.verified && (
              <span className="company-verified">
                <CheckCircle className="icon" />
                Верифікована
              </span>
            )}
          </div>
          <div className="company-subtitle">
            <Building2 className="icon" />
            <span>{company.industry}</span>
          </div>
        </div>
        <div className="company-actions">
          <button className="btn btn-outline">
            <Star className="icon" />
            Зберегти
          </button>
          <Link href={`/jobs?company=${encodeURIComponent(company.name)}`} className="btn btn-primary">
            Переглянути вакансії
          </Link>
        </div>
      </div>

      {/* Основна інформація */}
      <div className="company-details-grid">
        <div className="company-main-info">
          <div className="company-overview-section">
            <h2>Про компанію</h2>
            <p className="company-description">{company.description}</p>
            
            <div className="company-stats">
              <div className="stat-item">
                <Users className="icon" />
                <span>{company.companySize}</span>
              </div>
              <div className="stat-item">
                <Calendar className="icon" />
                <span>Заснована: {company.foundedYear}</span>
              </div>
              <div className="stat-item">
                <Briefcase className="icon" />
                <span>{company.activeJobs} активних вакансій</span>
              </div>
            </div>
          </div>

          <div className="company-contact-section">
            <h2>Контактна інформація</h2>
            <div className="contact-details">
              <div className="contact-item">
                <MapPin className="icon" />
                <span>{company.location}</span>
              </div>
              <div className="contact-item">
                <Globe className="icon" />
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </a>
              </div>
              <div className="contact-item">
                <Mail className="icon" />
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
              <div className="contact-item">
                <Phone className="icon" />
                <span>{company.phone}</span>
              </div>
            </div>
          </div>

          <div className="company-benefits-section">
            <h2>Переваги роботи</h2>
            <div className="benefits-grid">
              {company.benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <CheckCircle className="icon" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="company-culture-section">
            <h2>Корпоративна культура</h2>
            <div className="culture-tags">
              {company.culture.map((item, index) => (
                <span key={index} className="culture-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="company-jobs-sidebar">
          <div className="jobs-section">
            <h3>Активні вакансії ({company.activeJobs})</h3>
            <div className="jobs-list">
              {company.jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h4 className="job-title">{job.title}</h4>
                    <span className="job-type">{job.type}</span>
                  </div>
                  <div className="job-details">
                    <div className="job-salary">{job.salary}</div>
                    <div className="job-posted">Опубліковано {job.postedDate}</div>
                  </div>
                  <div className="job-requirements">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="requirement-tag">
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="requirement-tag more">
                        +{job.requirements.length - 3} більше
                      </span>
                    )}
                  </div>
                  <button className="btn btn-outline full-width">
                    <Eye className="icon" />
                    Переглянути
                  </button>
                </div>
              ))}
            </div>
            <button className="btn btn-primary full-width">
              Всі вакансії компанії
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
