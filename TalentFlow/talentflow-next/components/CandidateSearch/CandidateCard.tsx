import React, { useState } from 'react';
import { Candidate } from '../../services/candidateService';
import { candidateService } from '../../services/candidateService';
import { useLanguageStore } from '../../stores/languageStore';
import { CVExportService, CandidateProfile } from '../../services/cvExportService';
import { 
  Star, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Globe, 
  Mail, 
  Phone, 
  ExternalLink,
  Heart,
  MessageSquare,
  Download,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './CandidateCard.css';

interface CandidateCardProps {
  candidate: Candidate;
  isExpanded: boolean;
  onClick: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isExpanded,
  onClick
}) => {
  const { t } = useLanguageStore();
  const [isFavorite, setIsFavorite] = useState(candidateService.isInFavorites(candidate.id));
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        await candidateService.unsaveCandidate(candidate.id);
        setIsFavorite(false);
      } else {
        await candidateService.saveCandidate(candidate.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(t('errorSavingToFavorites'), error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = (type: 'email' | 'phone') => {
    if (type === 'email' && candidate.user?.email) {
      window.open(`mailto:${candidate.user.email}`, '_blank');
    } else if (type === 'phone' && candidate.phone) {
      window.open(`tel:${candidate.phone}`, '_blank');
    }
  };

  const handleDownloadResume = () => {
    if (candidate.portfolio) {
      window.open(candidate.portfolio, '_blank');
    }
  };

  const handleExportCV = async () => {
    try {
      // Конвертуємо дані кандидата в формат для експорту CV
      const candidateProfile: CandidateProfile = {
        id: candidate.id,
        firstName: candidate.user?.firstName || '',
        lastName: candidate.user?.lastName || '',
        email: candidate.user?.email || '',
        phone: candidate.phone,
        location: candidate.location,
        headline: candidate.title || candidate.bio,
        summary: candidate.bio,
        experience: candidate.workHistory?.map((work, index) => ({
          id: index.toString(),
          company: work.company,
          position: work.position,
          startDate: work.startDate instanceof Date ? work.startDate.toISOString() : work.startDate,
          endDate: work.endDate instanceof Date ? work.endDate.toISOString() : work.endDate,
          current: !work.endDate,
          description: work.description,
          achievements: []
        })) || [],
        education: [], // Поки що немає даних про освіту
        skills: candidate.skills || [],
        languages: candidate.languages || [],
        certifications: candidate.certifications || [],
        portfolio: candidate.portfolio,
        linkedin: candidate.linkedin,
        github: candidate.github
      };

      await CVExportService.exportCV(candidateProfile, 'pdf-cyrillic');
    } catch (error) {
      console.error('Error exporting CV:', error);
    }
  };

  const formatExperience = (years: number | undefined) => {
    if (!years) return t('noExperience');
    if (years === 1) return '1 рік';
    if (years < 5) return `${years} роки`;
    return `${years} років`;
  };

  const formatSalary = (salary: number | undefined, currency: string = 'USD') => {
    if (!salary) return t('notSpecified');
    return `${salary.toLocaleString()} ${currency}`;
  };

  const renderSkills = (skills: string[] | undefined, maxVisible: number = 5) => {
    if (!skills || skills.length === 0) return null;
    
    const visibleSkills = skills.slice(0, maxVisible);
    const hiddenCount = skills.length - maxVisible;

    return (
      <div className="candidate-skills">
        {visibleSkills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className="skill-tag more-skills">
            +{hiddenCount} ще
          </span>
        )}
      </div>
    );
  };

  const renderWorkHistory = () => {
    if (!candidate.workHistory || candidate.workHistory.length === 0) return null;

    return (
      <div className="work-history">
        <h4>Досвід роботи</h4>
        {candidate.workHistory.slice(0, 3).map((work, index) => (
          <div key={index} className="work-item">
            <div className="work-header">
              <strong>{work.position}</strong>
              <span className="work-company">{work.company}</span>
            </div>
            <div className="work-period">
              {new Date(work.startDate).toLocaleDateString('uk-UA', { 
                year: 'numeric', 
                month: 'short' 
              })} - {work.endDate 
                ? new Date(work.endDate).toLocaleDateString('uk-UA', { 
                    year: 'numeric', 
                    month: 'short' 
                  })
                : t('toPresent')
              }
            </div>
            <p className="work-description">{work.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!candidate.projects || candidate.projects.length === 0) return null;

    return (
      <div className="projects">
        <h4>Проекти</h4>
        {candidate.projects.slice(0, 2).map((project, index) => (
          <div key={index} className="project-item">
            <div className="project-header">
              <strong>{project.name}</strong>
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                <span key={techIndex} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`candidate-card ${isExpanded ? 'expanded' : ''}`}>
      {/* Header */}
      <div className="card-header" onClick={onClick}>
        <div className="candidate-avatar">
          {candidate.user?.avatar ? (
            <img src={candidate.user.avatar} alt={`${candidate.user.firstName} ${candidate.user.lastName}`} />
          ) : (
            <div className="avatar-placeholder">
              {candidate.user?.firstName?.charAt(0)}{candidate.user?.lastName?.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="candidate-info">
          <h3 className="candidate-name">
            {candidate.user?.firstName} {candidate.user?.lastName}
          </h3>
          <p className="candidate-title">
            {candidate.title || candidate.bio || t('candidate')}
          </p>
          
          <div className="candidate-meta">
            {candidate.location && (
              <span className="meta-item">
                <MapPin size={14} />
                {candidate.location}
              </span>
            )}
            
            {candidate.yearsOfExperience !== undefined && (
              <span className="meta-item">
                <Briefcase size={14} />
                {formatExperience(candidate.yearsOfExperience)}
              </span>
            )}
          </div>
        </div>
        
        <div className="card-actions">
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle();
            }}
            disabled={isLoading}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <button className="expand-btn">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="card-content">
          {/* Skills */}
          {renderSkills(candidate.skills)}
          
          {/* Contact Information */}
          <div className="contact-info">
            <h4>Контактна інформація</h4>
            <div className="contact-buttons">
              {candidate.user?.email && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleContact('email')}
                >
                  <Mail size={14} />
                  Написати
                </button>
              )}
              
              {candidate.phone && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleContact('phone')}
                >
                  <Phone size={14} />
                  Зателефонувати
                </button>
              )}
              
              {candidate.portfolio && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleDownloadResume}
                >
                  <Download size={14} />
                  Резюме
                </button>
              )}
              
              <button
                className="btn btn-primary btn-sm"
                onClick={handleExportCV}
              >
                <Download size={14} />
                Експорт CV
              </button>
            </div>
          </div>

          {/* Preferences */}
          {candidate.preferences && (
            <div className="preferences">
              <h4>Переваги</h4>
              <div className="preferences-grid">
                {candidate.preferences.salaryExpectation && (
                  <div className="preference-item">
                    <strong>Бажана зарплата:</strong>
                    <span>{formatSalary(candidate.preferences.salaryExpectation)}</span>
                  </div>
                )}
                
                {candidate.preferences.remoteWork !== undefined && (
                  <div className="preference-item">
                    <strong>Віддалена робота:</strong>
                    <span>{candidate.preferences.remoteWork ? t('yes') : t('no')}</span>
                  </div>
                )}
                
                {candidate.preferences.relocation !== undefined && (
                  <div className="preference-item">
                    <strong>Релокація:</strong>
                    <span>{candidate.preferences.relocation ? t('yes') : t('no')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Work History */}
          {renderWorkHistory()}

          {/* Projects */}
          {renderProjects()}

          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <div className="languages">
              <h4>Мови</h4>
              <div className="languages-list">
                {candidate.languages.map((lang, index) => (
                  <span key={index} className="language-tag">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {candidate.certifications && candidate.certifications.length > 0 && (
            <div className="certifications">
              <h4>Сертифікати</h4>
              <div className="certifications-list">
                {candidate.certifications.slice(0, 3).map((cert, index) => (
                  <div key={index} className="certification-item">
                    <strong>{cert}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {candidate.portfolio && (
            <div className="portfolio">
              <h4>Портфоліо</h4>
              <div className="portfolio-links">
                <a
                  href={candidate.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-link"
                >
                  <ExternalLink size={14} />
                  {candidate.portfolio}
                </a>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary">
              <MessageSquare size={16} />
              Запропонувати вакансію
            </button>
            
            <button className="btn btn-outline">
              <Eye size={16} />
              Переглянути профіль
            </button>
            
            <button 
              className="btn btn-outline"
              onClick={handleExportCV}
            >
              <Download size={16} />
              Експорт CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;






