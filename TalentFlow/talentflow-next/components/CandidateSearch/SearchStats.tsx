import React, { useState, useEffect } from 'react';
import { candidateService } from '../../services/candidateService';
import { Users, Star, MapPin, TrendingUp, Eye, Briefcase } from 'lucide-react';
import './SearchStats.css';

const SearchStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const statsData = await candidateService.getSearchStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження статистики');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="search-stats">
        <div className="stats-loading">
          <div className="spinner"></div>
          <p>Завантаження статистики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-stats">
        <div className="stats-error">
          <p className="error-message">{error}</p>
          <button className="btn btn-outline" onClick={loadStats}>
            Спробувати ще раз
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="search-stats">
      <div className="stats-header">
        <h3>Статистика пошуку кандидатів</h3>
        <button className="btn btn-sm btn-outline" onClick={loadStats}>
          Оновити
        </button>
      </div>

      <div className="stats-grid">
        {/* Основні метрики */}
        <div className="stats-section main-metrics">
          <h4>Основні показники</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <Users className="icon" />
              </div>
              <div className="metric-content">
                <div className="metric-value">{stats.totalCandidates.toLocaleString()}</div>
                <div className="metric-label">Всього кандидатів</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon active">
                <TrendingUp className="icon" />
              </div>
              <div className="metric-content">
                <div className="metric-value">{stats.activeCandidates.toLocaleString()}</div>
                <div className="metric-label">Активних кандидатів</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon rating">
                <Star className="icon" />
              </div>
              <div className="metric-content">
                <div className="metric-value">{stats.averageRating.toFixed(1)}</div>
                <div className="metric-label">Середній рейтинг</div>
              </div>
            </div>
          </div>
        </div>

        {/* Топ навички */}
        <div className="stats-section top-skills">
          <h4>Популярні навички</h4>
          <div className="skills-chart">
            {stats.topSkills.slice(0, 8).map((skill: any, index: number) => (
              <div key={skill.name} className="skill-bar">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-count">{skill.count}</span>
                </div>
                <div className="skill-progress">
                  <div 
                    className="skill-progress-bar"
                    style={{ 
                      width: `${(skill.count / Math.max(...stats.topSkills.map((s: any) => s.count))) * 100}%`,
                      backgroundColor: `hsl(${200 + index * 20}, 70%, 60%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Розподіл по локаціях */}
        <div className="stats-section location-distribution">
          <h4>Розподіл по локаціях</h4>
          <div className="location-chart">
            {stats.locationDistribution.slice(0, 6).map((location: any, index: number) => (
              <div key={location.location} className="location-item">
                <div className="location-info">
                  <span className="location-name">{location.location}</span>
                  <span className="location-count">{location.count}</span>
                </div>
                <div className="location-progress">
                  <div 
                    className="location-progress-bar"
                    style={{ 
                      width: `${(location.count / Math.max(...stats.locationDistribution.map((l: any) => l.count))) * 100}%`,
                      backgroundColor: `hsl(${120 + index * 30}, 70%, 60%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Швидкі дії */}
        <div className="stats-section quick-actions">
          <h4>Швидкі дії</h4>
          <div className="actions-grid">
            <button className="action-btn">
              <Eye className="icon" />
              <span>Переглянути всіх кандидатів</span>
            </button>
            
            <button className="action-btn">
              <Briefcase className="icon" />
              <span>Створити вакансію</span>
            </button>
            
            <button className="action-btn">
              <Star className="icon" />
              <span>Топ кандидати</span>
            </button>
            
            <button className="action-btn">
              <MapPin className="icon" />
              <span>Кандидати поблизу</span>
            </button>
          </div>
        </div>
      </div>

      {/* Додаткова інформація */}
      <div className="stats-footer">
        <div className="stats-note">
          <p>
            <strong>Примітка:</strong> Статистика оновлюється в реальному часі та базується на активних кандидатах платформи.
          </p>
        </div>
        
        <div className="stats-timestamp">
          <span>Останнє оновлення: {new Date().toLocaleString('uk-UA')}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchStats;






