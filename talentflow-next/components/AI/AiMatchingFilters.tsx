import React, { useState } from 'react';
import { Filter, Search, MapPin, Briefcase, DollarSign, Users } from 'lucide-react';
import { FilterType, ExperienceLevel, EXPERIENCE_OPTIONS, SALARY_RANGES, POPULAR_SKILLS } from '../../constants/aiMatching';

export interface AiMatchingFilters {
  search: string;
  location: string;
  experience: string;
  salaryRange: string;
  skills: string[];
  matchScore: number;
  type: FilterType;
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

  const popularSkills = POPULAR_SKILLS;
  const experienceOptions = EXPERIENCE_OPTIONS;
  const salaryRanges = SALARY_RANGES;

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
              onChange={(e) => handleFilterChange('type', e.target.value as FilterType)}
              className="ai-matching-filter-select"
            >
              <option value={FilterType.ALL}>Всі</option>
              <option value={FilterType.CANDIDATES}>Кандидати</option>
              <option value={FilterType.JOBS}>Вакансії</option>
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
