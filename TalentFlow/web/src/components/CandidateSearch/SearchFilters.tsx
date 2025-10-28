import React, { useState, useEffect } from 'react';
import { CandidateSearchFilters } from '../../services/candidateService';
import { candidateService } from '../../services/candidateService';
import { X, Search, MapPin, Briefcase, DollarSign, Globe, Calendar } from 'lucide-react';
import './SearchFilters.css';

interface SearchFiltersProps {
  currentFilters: CandidateSearchFilters;
  onFiltersChange: (filters: Partial<CandidateSearchFilters>) => void;
  onReset: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  currentFilters,
  onFiltersChange,
  onReset
}) => {
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  useEffect(() => {
    loadAvailableSkills();
    loadAvailableLocations();
  }, []);

  const loadAvailableSkills = async () => {
    setIsLoadingSkills(true);
    try {
      const skills = await candidateService.getAvailableSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error('Помилка завантаження навичок:', error);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const loadAvailableLocations = async () => {
    setIsLoadingLocations(true);
    try {
      const locations = await candidateService.getAvailableLocations();
      setAvailableLocations(locations);
    } catch (error) {
      console.error('Помилка завантаження локацій:', error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleFilterChange = (key: keyof CandidateSearchFilters, value: any) => {
    onFiltersChange({ [key]: value });
  };

  const handleSkillsChange = (skill: string, isChecked: boolean) => {
    const currentSkills = currentFilters.skills || [];
    let newSkills: string[];

    if (isChecked) {
      newSkills = [...currentSkills, skill];
    } else {
      newSkills = currentSkills.filter(s => s !== skill);
    }

    handleFilterChange('skills', newSkills);
  };

  const handleLocationChange = (location: string) => {
    handleFilterChange('location', location);
  };

  const handleCityChange = (city: string) => {
    handleFilterChange('city', city);
  };

  const handleCountryChange = (country: string) => {
    handleFilterChange('country', country);
  };

  const handleExperienceChange = (type: 'min' | 'max', value: string) => {
    const currentExp = currentFilters.experience || {};
    const newExp = {
      ...currentExp,
      [type]: value ? parseInt(value) : undefined
    };
    handleFilterChange('experience', newExp);
  };

  const handleSalaryChange = (type: 'min' | 'max' | 'currency', value: string) => {
    const currentSalary = currentFilters.salary || {};
    const newSalary = {
      ...currentSalary,
      [type]: type === 'currency' ? value : (value ? parseFloat(value) : undefined)
    };
    handleFilterChange('salary', newSalary);
  };

  const handleBooleanChange = (key: keyof CandidateSearchFilters, value: boolean) => {
    handleFilterChange(key, value);
  };

  const handleAvailabilityChange = (availability: string) => {
    handleFilterChange('availability', availability as any);
  };

  const clearFilter = (key: keyof CandidateSearchFilters) => {
    onFiltersChange({ [key]: undefined });
  };

  const hasActiveFilters = Object.keys(currentFilters).some(key => {
    const value = currentFilters[key as keyof CandidateSearchFilters];
    if (key === 'page' || key === 'limit' || key === 'sortBy' || key === 'sortOrder') {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== null);
    }
    return value !== undefined && value !== null;
  });

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3>Фільтри пошуку</h3>
        {hasActiveFilters && (
          <button className="btn btn-sm btn-outline" onClick={onReset}>
            Скинути всі
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Навички */}
        <div className="filter-group">
          <label className="filter-label">
            <Briefcase className="filter-icon" />
            Навички
          </label>
          <div className="skills-filter">
            {isLoadingSkills ? (
              <div className="loading">Завантаження...</div>
            ) : (
              <div className="skills-grid">
                {availableSkills.slice(0, 20).map((skill) => (
                  <label key={skill} className="skill-checkbox">
                    <input
                      type="checkbox"
                      checked={currentFilters.skills?.includes(skill) || false}
                      onChange={(e) => handleSkillsChange(skill, e.target.checked)}
                    />
                    <span className="skill-name">{skill}</span>
                  </label>
                ))}
              </div>
            )}
            {currentFilters.skills && currentFilters.skills.length > 0 && (
              <div className="selected-skills">
                {currentFilters.skills.map((skill) => (
                  <span key={skill} className="selected-skill">
                    {skill}
                    <button
                      onClick={() => handleSkillsChange(skill, false)}
                      className="remove-skill"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Локація */}
        <div className="filter-group">
          <label className="filter-label">
            <MapPin className="filter-icon" />
            Локація
          </label>
          <div className="location-filters">
            <input
              type="text"
              placeholder="Введіть локацію"
              value={currentFilters.location || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="form-input"
            />
            
            <select
              value={currentFilters.city || ''}
              onChange={(e) => handleCityChange(e.target.value)}
              className="form-select"
            >
              <option value="">Всі міста</option>
              {availableLocations.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={currentFilters.country || ''}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="form-select"
            >
              <option value="">Всі країни</option>
              <option value="Україна">Україна</option>
              <option value="США">США</option>
              <option value="Великобританія">Великобританія</option>
              <option value="Німеччина">Німеччина</option>
              <option value="Польща">Польща</option>
            </select>
          </div>
        </div>

        {/* Досвід */}
        <div className="filter-group">
          <label className="filter-label">
            <Briefcase className="filter-icon" />
            Досвід роботи
          </label>
          <div className="experience-filters">
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Мін. років"
                value={currentFilters.experience?.min || ''}
                onChange={(e) => handleExperienceChange('min', e.target.value)}
                className="form-input"
                min="0"
                max="50"
              />
              <span className="range-separator">-</span>
              <input
                type="number"
                placeholder="Макс. років"
                value={currentFilters.experience?.max || ''}
                onChange={(e) => handleExperienceChange('max', e.target.value)}
                className="form-input"
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* Зарплата */}
        <div className="filter-group">
          <label className="filter-label">
            <DollarSign className="filter-icon" />
            Бажана зарплата
          </label>
          <div className="salary-filters">
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Мін. зарплата"
                value={currentFilters.salary?.min || ''}
                onChange={(e) => handleSalaryChange('min', e.target.value)}
                className="form-input"
                min="0"
              />
              <span className="range-separator">-</span>
              <input
                type="number"
                placeholder="Макс. зарплата"
                value={currentFilters.salary?.max || ''}
                onChange={(e) => handleSalaryChange('max', e.target.value)}
                className="form-input"
                min="0"
              />
            </div>
            <select
              value={currentFilters.salary?.currency || 'USD'}
              onChange={(e) => handleSalaryChange('currency', e.target.value)}
              className="form-select"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="UAH">UAH</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* Тип роботи */}
        <div className="filter-group">
          <label className="filter-label">
            <Globe className="filter-icon" />
            Тип роботи
          </label>
          <div className="work-type-filters">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={currentFilters.remote || false}
                onChange={(e) => handleBooleanChange('remote', e.target.checked)}
              />
              <span>Віддалена робота</span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={currentFilters.relocation || false}
                onChange={(e) => handleBooleanChange('relocation', e.target.checked)}
              />
              <span>Готовий до релокації</span>
            </label>
          </div>
        </div>

        {/* Доступність */}
        <div className="filter-group">
          <label className="filter-label">
            <Calendar className="filter-icon" />
            Доступність
          </label>
          <select
            value={currentFilters.availability || ''}
            onChange={(e) => handleAvailabilityChange(e.target.value)}
            className="form-select"
          >
            <option value="">Будь-коли</option>
            <option value="immediate">Негайно</option>
            <option value="2weeks">Через 2 тижні</option>
            <option value="1month">Через місяць</option>
            <option value="3months">Через 3 місяці</option>
          </select>
        </div>

        {/* Освіта */}
        <div className="filter-group">
          <label className="filter-label">
            <Briefcase className="filter-icon" />
            Освіта
          </label>
          <input
            type="text"
            placeholder="Введіть рівень освіти"
            value={currentFilters.education || ''}
            onChange={(e) => handleFilterChange('education', e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          <h4>Активні фільтри:</h4>
          <div className="active-filters-list">
            {currentFilters.skills && currentFilters.skills.length > 0 && (
              <span className="active-filter">
                Навички: {currentFilters.skills.join(', ')}
                <button onClick={() => clearFilter('skills')} className="remove-filter">×</button>
              </span>
            )}
            
            {currentFilters.location && (
              <span className="active-filter">
                Локація: {currentFilters.location}
                <button onClick={() => clearFilter('location')} className="remove-filter">×</button>
              </span>
            )}
            
            {currentFilters.experience && (currentFilters.experience.min || currentFilters.experience.max) && (
              <span className="active-filter">
                Досвід: {currentFilters.experience.min || 0}-{currentFilters.experience.max || '∞'} років
                <button onClick={() => clearFilter('experience')} className="remove-filter">×</button>
              </span>
            )}
            
            {currentFilters.remote && (
              <span className="active-filter">
                Віддалена робота
                <button onClick={() => clearFilter('remote')} className="remove-filter">×</button>
              </span>
            )}
            
            {currentFilters.relocation && (
              <span className="active-filter">
                Релокація
                <button onClick={() => clearFilter('relocation')} className="remove-filter">×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;




