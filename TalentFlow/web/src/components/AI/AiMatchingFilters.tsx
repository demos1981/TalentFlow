import React, { useState } from 'react';
import { Filter, Search, MapPin, Briefcase, DollarSign, Users } from 'lucide-react';

export interface AiMatchingFilters {
  search: string;
  location: string;
  experience: string;
  salaryRange: string;
  skills: string[];
  matchScore: number;
  type: 'all' | 'candidates' | 'jobs';
}

interface AiMatchingFiltersProps {
  filters: AiMatchingFilters;
  onFiltersChange: (filters: AiMatchingFilters) => void;
  onReset: () => void;
}

const AiMatchingFilters: React.FC<AiMatchingFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof AiMatchingFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    handleFilterChange('skills', newSkills);
  };

  const popularSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git', 'TypeScript'
  ];

  const experienceOptions = [
    { value: 'entry', label: 'Початковий рівень (0-2 роки)' },
    { value: 'junior', label: 'Junior (1-3 роки)' },
    { value: 'middle', label: 'Middle (3-5 років)' },
    { value: 'senior', label: 'Senior (5+ років)' },
    { value: 'lead', label: 'Lead/Architect (7+ років)' }
  ];

  const salaryRanges = [
    { value: '0-30000', label: 'До 30,000 грн' },
    { value: '30000-60000', label: '30,000 - 60,000 грн' },
    { value: '60000-100000', label: '60,000 - 100,000 грн' },
    { value: '100000-150000', label: '100,000 - 150,000 грн' },
    { value: '150000+', label: '150,000+ грн' }
  ];

  return (
    <div className="ai-matching-filters">
      <div className="ai-matching-filters-header">
        <div className="ai-matching-filters-title">
          <Filter size={20} />
          <h3>Фільтри та пошук</h3>
        </div>
        <button
          className="ai-matching-filters-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Сховати' : 'Розгорнути'}
        </button>
      </div>

      <div className="ai-matching-filters-main">
        {/* Основні фільтри */}
        <div className="ai-matching-filters-row">
          <div className="ai-matching-filter-group">
            <label className="ai-matching-filter-label">
              <Search size={16} />
              Пошук
            </label>
            <input
              type="text"
              placeholder="Назва вакансії, компанія або навички..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="ai-matching-filter-input"
            />
          </div>

          <div className="ai-matching-filter-group">
            <label className="ai-matching-filter-label">
              <MapPin size={16} />
              Локація
            </label>
            <input
              type="text"
              placeholder="Місто, країна..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="ai-matching-filter-input"
            />
          </div>

          <div className="ai-matching-filter-group">
            <label className="ai-matching-filter-label">
              <Briefcase size={16} />
              Тип
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="ai-matching-filter-select"
            >
              <option value="all">Всі</option>
              <option value="candidates">Кандидати</option>
              <option value="jobs">Вакансії</option>
            </select>
          </div>
        </div>

        {/* Розширені фільтри */}
        {isExpanded && (
          <>
            <div className="ai-matching-filters-row">
              <div className="ai-matching-filter-group">
                <label className="ai-matching-filter-label">
                  <Users size={16} />
                  Досвід
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="ai-matching-filter-select"
                >
                  <option value="">Будь-який досвід</option>
                  {experienceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ai-matching-filter-group">
                <label className="ai-matching-filter-label">
                  <DollarSign size={16} />
                  Зарплата
                </label>
                <select
                  value={filters.salaryRange}
                  onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                  className="ai-matching-filter-select"
                >
                  <option value="">Будь-яка зарплата</option>
                  {salaryRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ai-matching-filter-group">
                <label className="ai-matching-filter-label">
                  <Filter size={16} />
                  Мінімальний матч
                </label>
                <div className="ai-matching-score-filter">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.matchScore}
                    onChange={(e) => handleFilterChange('matchScore', parseInt(e.target.value))}
                    className="ai-matching-score-slider"
                  />
                  <span className="ai-matching-score-value">{filters.matchScore}%</span>
                </div>
              </div>
            </div>

            {/* Фільтр по навичках */}
            <div className="ai-matching-filters-row">
              <div className="ai-matching-filter-group ai-matching-skills-filter">
                <label className="ai-matching-filter-label">
                  <Briefcase size={16} />
                  Навички
                </label>
                <div className="ai-matching-skills-grid">
                  {popularSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      className={`ai-matching-skill-filter-btn ${
                        filters.skills.includes(skill) ? 'active' : ''
                      }`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Кнопки дій */}
      <div className="ai-matching-filters-actions">
        <button
          className="ai-matching-btn ai-matching-btn-secondary"
          onClick={onReset}
        >
          Скинути фільтри
        </button>
        <button
          className="ai-matching-btn ai-matching-btn-primary"
          onClick={() => setIsExpanded(false)}
        >
          Застосувати
        </button>
      </div>
    </div>
  );
};

export default AiMatchingFilters;
