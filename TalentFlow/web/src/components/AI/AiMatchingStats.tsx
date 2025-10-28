import React from 'react';
import { TrendingUp, Users, Briefcase, Target, Clock, Zap } from 'lucide-react';

export interface AiMatchingStats {
  totalMatches: number;
  highQualityMatches: number;
  averageMatchScore: number;
  candidatesMatched: number;
  jobsMatched: number;
  lastUpdated: string;
  aiAccuracy: number;
  processingTime: number;
}

interface AiMatchingStatsProps {
  stats: AiMatchingStats;
}

const AiMatchingStats: React.FC<AiMatchingStatsProps> = ({ stats }) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 85) return 'text-blue-600';
    if (accuracy >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="ai-matching-stats">
      <div className="ai-matching-stats-header">
        <h3 className="ai-matching-stats-title">
          <TrendingUp size={20} />
          AI Матчинг Статистика
        </h3>
        <span className="ai-matching-stats-updated">
          <Clock size={14} />
          Оновлено: {stats.lastUpdated}
        </span>
      </div>

      <div className="ai-matching-stats-grid">
        {/* Загальна кількість матчів */}
        <div className="ai-matching-stat-card">
          <div className="ai-matching-stat-icon">
            <Target size={24} />
          </div>
          <div className="ai-matching-stat-content">
            <h4 className="ai-matching-stat-value">{stats.totalMatches}</h4>
            <p className="ai-matching-stat-label">Всього матчів</p>
          </div>
          <div className="ai-matching-stat-trend">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ai-matching-stat-trend-text">+12%</span>
          </div>
        </div>

        {/* Високоякісні матчі */}
        <div className="ai-matching-stat-card">
          <div className="ai-matching-stat-icon">
            <Zap size={24} />
          </div>
          <div className="ai-matching-stat-content">
            <h4 className="ai-matching-stat-value">{stats.highQualityMatches}</h4>
            <p className="ai-matching-stat-label">Високоякісні матчі</p>
          </div>
          <div className="ai-matching-stat-trend">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ai-matching-stat-trend-text">+8%</span>
          </div>
        </div>

        {/* Середній бал матчингу */}
        <div className="ai-matching-stat-card">
          <div className="ai-matching-stat-icon">
            <Target size={24} />
          </div>
          <div className="ai-matching-stat-content">
            <h4 className={`ai-matching-stat-value ${getMatchScoreColor(stats.averageMatchScore)}`}>
              {stats.averageMatchScore}%
            </h4>
            <p className="ai-matching-stat-label">Середній бал матчингу</p>
          </div>
          <div className="ai-matching-stat-trend">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ai-matching-stat-trend-text">+5%</span>
          </div>
        </div>

        {/* Кандидати */}
        <div className="ai-matching-stat-card">
          <div className="ai-matching-stat-icon">
            <Users size={24} />
          </div>
          <div className="ai-matching-stat-content">
            <h4 className="ai-matching-stat-value">{stats.candidatesMatched}</h4>
            <p className="ai-matching-stat-label">Кандидатів знайдено</p>
          </div>
          <div className="ai-matching-stat-trend">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ai-matching-stat-trend-text">+15%</span>
          </div>
        </div>

        {/* Вакансії */}
        <div className="ai-matching-stat-card">
          <div className="ai-matching-stat-icon">
            <Briefcase size={24} />
          </div>
          <div className="ai-matching-stat-content">
            <h4 className="ai-matching-stat-value">{stats.jobsMatched}</h4>
            <p className="ai-matching-stat-label">Вакансій знайдено</p>
          </div>
          <div className="ai-matching-stat-trend">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ai-matching-stat-trend-text">+10%</span>
          </div>
        </div>

        {/* Точність AI */}
        <div className="ai-matching-stat-card">
          <div className="ai-matching-stat-icon">
            <Zap size={24} />
          </div>
          <div className="ai-matching-stat-content">
            <h4 className={`ai-matching-stat-value ${getAccuracyColor(stats.aiAccuracy)}`}>
              {stats.aiAccuracy}%
            </h4>
            <p className="ai-matching-stat-label">Точність AI</p>
          </div>
          <div className="ai-matching-stat-trend">
            <TrendingUp size={16} className="text-green-500" />
            <span className="ai-matching-stat-trend-text">+3%</span>
          </div>
        </div>
      </div>

      {/* Додаткова інформація */}
      <div className="ai-matching-stats-footer">
        <div className="ai-matching-stats-info">
          <div className="ai-matching-stats-info-item">
            <span className="ai-matching-stats-info-label">Час обробки:</span>
            <span className="ai-matching-stats-info-value">{stats.processingTime}мс</span>
          </div>
          <div className="ai-matching-stats-info-item">
            <span className="ai-matching-stats-info-label">Алгоритм:</span>
            <span className="ai-matching-stats-info-value">ML + NLP + Semantic Search</span>
          </div>
        </div>
        
        <div className="ai-matching-stats-actions">
          <button className="ai-matching-btn ai-matching-btn-secondary">
            Детальна статистика
          </button>
          <button className="ai-matching-btn ai-matching-btn-primary">
            Оновити дані
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiMatchingStats;
