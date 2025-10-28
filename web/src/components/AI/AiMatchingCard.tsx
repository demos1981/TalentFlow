import React from 'react';
import { User, Briefcase, Star, TrendingUp, Clock, Brain } from 'lucide-react';

export interface AiRecommendation {
  id: string;
  type: 'candidate' | 'job';
  title: string;
  subtitle: string;
  matchScore: number;
  skills: string[];
  experience: string;
  location: string;
  salary?: string;
  avatar?: string;
  company?: string;
  postedDate?: string;
  aiReason: string;
}

interface AiMatchingCardProps {
  recommendation: AiRecommendation;
  onViewDetails: (id: string) => void;
  onContact: (id: string) => void;
}

const AiMatchingCard: React.FC<AiMatchingCardProps> = ({
  recommendation,
  onViewDetails,
  onContact,
}) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return 'Відмінно';
    if (score >= 80) return 'Добре';
    if (score >= 70) return 'Нормально';
    return 'Потребує уваги';
  };

  return (
    <div className="ai-matching-card">
      <div className="ai-matching-card-header">
        <div className="ai-matching-card-avatar">
          {recommendation.avatar ? (
            <img src={recommendation.avatar} alt={recommendation.title} />
          ) : (
            <div className="ai-matching-card-avatar-placeholder">
              {recommendation.type === 'candidate' ? <User size={24} /> : <Briefcase size={24} />}
            </div>
          )}
        </div>
        
        <div className="ai-matching-card-info">
          <h3 className="ai-matching-card-title">{recommendation.title}</h3>
          <p className="ai-matching-card-subtitle">{recommendation.subtitle}</p>
          
          <div className="ai-matching-card-meta">
            <span className="ai-matching-card-location">
              📍 {recommendation.location}
            </span>
            <span className="ai-matching-card-experience">
              ⏱️ {recommendation.experience}
            </span>
            {recommendation.salary && (
              <span className="ai-matching-card-salary">
                💰 {recommendation.salary}
              </span>
            )}
            {recommendation.company && (
              <span className="ai-matching-card-company">
                🏢 {recommendation.company}
              </span>
            )}
          </div>
        </div>

        <div className="ai-matching-card-score">
          <div className={`ai-matching-score-badge ${getMatchScoreColor(recommendation.matchScore)}`}>
            <Star size={16} />
            <span className="ai-matching-score-number">{recommendation.matchScore}%</span>
            <span className="ai-matching-score-label">{getMatchScoreLabel(recommendation.matchScore)}</span>
          </div>
        </div>
      </div>

      <div className="ai-matching-card-skills">
        <h4 className="ai-matching-skills-title">Ключові навички:</h4>
        <div className="ai-matching-skills-list">
          {recommendation.skills.slice(0, 5).map((skill, index) => (
            <span key={index} className="ai-matching-skill-tag">
              {skill}
            </span>
          ))}
          {recommendation.skills.length > 5 && (
            <span className="ai-matching-skill-more">
              +{recommendation.skills.length - 5} більше
            </span>
          )}
        </div>
      </div>

      <div className="ai-matching-card-ai-reason">
        <h4 className="ai-matching-ai-reason-title">
          <Brain size={16} />
          AI пояснення матчингу:
        </h4>
        <p className="ai-matching-ai-reason-text">{recommendation.aiReason}</p>
      </div>

      <div className="ai-matching-card-actions">
        <button
          className="ai-matching-btn ai-matching-btn-primary"
          onClick={() => onViewDetails(recommendation.id)}
        >
          Переглянути деталі
        </button>
        <button
          className="ai-matching-btn ai-matching-btn-secondary"
          onClick={() => onContact(recommendation.id)}
        >
          Зв'язатися
        </button>
      </div>

      {recommendation.postedDate && (
        <div className="ai-matching-card-footer">
          <span className="ai-matching-posted-date">
            <Clock size={14} />
            Опубліковано: {recommendation.postedDate}
          </span>
        </div>
      )}
    </div>
  );
};

export default AiMatchingCard;
