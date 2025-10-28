import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Star, 
  Eye,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Award,
  Clock
} from 'lucide-react';

const CandidatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  // Мокові дані для демонстрації
  const candidates = [
    {
      id: 1,
      name: 'Іван Петренко',
      title: 'Senior Full-Stack Developer',
      location: 'Київ, Україна',
      experience: '5 років',
      salary: '$4000-6000',
      availability: 'Готовий до роботи',
      rating: 4.8,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
      description: 'Досвідчений розробник з глибокими знаннями сучасних веб-технологій...',
      isAvailable: true,
      isPremium: true,
      lastActive: '2 години тому',
      views: 156,
      matches: 23
    },
    {
      id: 2,
      name: 'Марія Коваленко',
      title: 'Product Manager',
      location: 'Львів, Україна',
      experience: '3 роки',
      salary: '$3000-4500',
      availability: '2 тижні',
      rating: 4.6,
      skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'A/B Testing'],
      description: 'Результативний Product Manager з досвідом запуску успішних продуктів...',
      isAvailable: true,
      isPremium: false,
      lastActive: '1 день тому',
      views: 89,
      matches: 15
    },
    {
      id: 3,
      name: 'Олександр Сидоренко',
      title: 'UX/UI Designer',
      location: 'Одеса, Україна',
      experience: '4 роки',
      salary: '$2500-4000',
      availability: '1 місяць',
      rating: 4.9,
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Testing', 'Design Systems'],
      description: 'Творчий дизайнер з чудовим почуттям стилю та досвідом створення інтерфейсів...',
      isAvailable: false,
      isPremium: true,
      lastActive: '3 дні тому',
      views: 203,
      matches: 31
    },
    {
      id: 4,
      name: 'Анна Мельник',
      title: 'DevOps Engineer',
      location: 'Харків, Україна',
      experience: '6 років',
      salary: '$5000-7000',
      availability: 'Готовий до роботи',
      rating: 4.7,
      skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Prometheus'],
      description: 'Експерт з автоматизації процесів розгортання та масштабування...',
      isAvailable: true,
      isPremium: true,
      lastActive: '5 годин тому',
      views: 178,
      matches: 28
    }
  ];

  const locations = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Запоріжжя'];
  const experienceLevels = ['Джуніор', 'Мідл', 'Сеньйор', 'Лід', 'Архітектор'];

  const getAvailabilityClass = (availability: string) => {
    if (availability === 'Готовий до роботи') return 'available';
    if (availability.includes('тижні')) return 'weeks';
    if (availability.includes('місяць')) return 'month';
    return 'unavailable';
  };

  return (
    <div className="dashboard-content">
      {/* Candidates Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Кандидати</h1>
          <p className="dashboard-greeting-subtitle">
            Знайдіть найкращих спеціалістів для вашої команди
          </p>
          <div className="dashboard-actions">
            <button className="btn btn-primary">
              <Search className="icon" />
              Знайти кандидатів
            </button>
            <button className="btn btn-secondary">
              <Filter className="icon" />
              Фільтри
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="dashboard-section-card">
        <div className="dashboard-section-content">
          <div className="search-filters">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Пошук кандидатів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filters-row">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                <option value="">Всі локації</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="filter-select"
              >
                <option value="">Всі рівні</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="dashboard-sections-grid">
        <div className="dashboard-section-card">
          <h2 className="dashboard-section-title">Знайдені кандидати ({candidates.length})</h2>
          <div className="candidates-list">
            {candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-header">
                  <div className="candidate-avatar">
                    <span className="candidate-avatar-text">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="candidate-info">
                    <h3 className="candidate-name">{candidate.name}</h3>
                    <div className="candidate-title">{candidate.title}</div>
                    <div className="candidate-rating">
                      <Star className="icon" />
                      {candidate.rating}
                    </div>
                  </div>
                  <div className="candidate-actions">
                    <button className="candidate-action-btn">
                      <Heart className="icon" />
                    </button>
                    <button className="candidate-action-btn">
                      <Share2 className="icon" />
                    </button>
                  </div>
                </div>
                
                <div className="candidate-details">
                  <div className="candidate-detail-item">
                    <MapPin className="icon" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="candidate-detail-item">
                    <Briefcase className="icon" />
                    <span>{candidate.experience}</span>
                  </div>
                  <div className="candidate-detail-item">
                    <Award className="icon" />
                    <span>{candidate.salary}</span>
                  </div>
                  <div className="candidate-detail-item">
                    <Clock className="icon" />
                    <span>{candidate.lastActive}</span>
                  </div>
                </div>
                
                <p className="candidate-description">{candidate.description}</p>
                
                <div className="candidate-skills">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="candidate-skill">{skill}</span>
                  ))}
                </div>
                
                <div className="candidate-footer">
                  <div className="candidate-stats">
                    <span className="candidate-stat">
                      <Eye className="icon" />
                      {candidate.views} переглядів
                    </span>
                    <span className="candidate-stat">
                      <Star className="icon" />
                      {candidate.matches} співпадінь
                    </span>
                  </div>
                  
                  <div className="candidate-actions-main">
                    <button className="btn btn-primary btn-sm">
                      <MessageSquare className="icon" />
                      Написати
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <Download className="icon" />
                      CV
                    </button>
                  </div>
                </div>
                
                {candidate.isPremium && (
                  <div className="premium-badge">Premium</div>
                )}
                
                <div className={`availability-badge ${getAvailabilityClass(candidate.availability)}`}>
                  {candidate.availability}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesPage;
