'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import { useLanguageStore } from '../../../stores/languageStore';
import { USER_TYPES } from '../../../constants';
import Layout from '../../../components/Layout/Layout';
import { candidateService, type Candidate } from '../../../services/candidateService';
import { PDFService } from '../../../services/pdfService';
import { ShareService } from '../../../services/shareService';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  MessageSquare, 
  Download, 
  Share2,
  Calendar,
  Award,
  BookOpen,
  Code,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Github,
  AlertCircle,
  UserX
} from 'lucide-react';
import './candidate-profile.css';


const CandidateProfilePage: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const params = useParams();
  const candidateId = params?.id as string;

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await candidateService.getCandidateById(candidateId);
        setCandidate(response);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError(t('candidateNotFound'));
        } else if (error.response?.status === 401) {
          setError(t('noAccessToProfile'));
        } else {
          setError(t('profileLoadError'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId, user]);

  const handleContact = () => {
    router.push(`/candidates/${candidateId}/contact`);
  };

  const handleDownloadCV = async () => {
    if (!candidate) return;

    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      alert(t('pdfGenerationError'));
      return;
    }

    try {
      await PDFService.generateCandidateCV(candidate);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t('pdfGenerationError'));
    }
  };

  const handleShare = () => {
    if (!candidate) return;

    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      alert(t('shareError'));
      return;
    }
    
    try {
      const shareData = ShareService.generateShareData(candidate, candidateId);
      ShareService.showShareModal(shareData, t as any);
    } catch (error) {
      console.error('Error sharing:', error);
      alert(t('shareError'));
    }
  };

  const handleBack = () => {
    if (user?.role === USER_TYPES.CANDIDATE) {
      router.push('/jobs');
    } else {
      router.push('/candidates');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="candidate-profile-page">
          <div className="loading-spinner">{t('loadingProfile')}</div>
        </div>
      </Layout>
    );
  }

  if (error || !candidate) {
    return (
      <Layout>
        <div className="candidate-profile-page">
          <div className="error-state">
            <div className="error-icon-container">
              <UserX size={64} className="error-icon" />
            </div>
            <h2 className="error-title">{t('candidateNotFound')}</h2>
            <p className="error-message">
              {error || t('candidateNotFoundDescription')}
            </p>
            <div className="error-actions">
              <button onClick={handleBack} className="btn btn-primary">
                <ArrowLeft className="icon" />
                {user?.role === USER_TYPES.CANDIDATE ? t('backToJobs') : t('backToCandidates')}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="candidate-profile-page">
        {/* Header */}
        <div className="profile-header">
          <button onClick={handleBack} className="back-btn">
            <ArrowLeft className="icon" />
            {user?.role === USER_TYPES.CANDIDATE ? t('backToJobs') : t('backToCandidates')}
          </button>
          <div className="profile-actions">
            <button className="action-btn" onClick={handleShare}>
              <Share2 className="icon" />
              {t('share')}
            </button>
            <button className="action-btn" onClick={handleDownloadCV}>
              <Download className="icon" />
              {t('downloadCV')}
            </button>
          </div>
        </div>

        {/* Main Profile */}
        <div className="profile-main">
          <div className="profile-card">
            <div className="profile-avatar">
              <img 
                src={candidate.user?.avatar || '/avatars/default.svg'} 
                alt={candidate.user ? `${candidate.user.firstName} ${candidate.user.lastName}` : t('candidate')}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/avatars/default.svg';
                }}
              />
              <div className={`availability-indicator ${candidate.isActive ? 'available' : 'unavailable'}`} />
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">
                {candidate.user 
                  ? `${candidate.user.firstName} ${candidate.user.lastName}`
                  : candidate.title || t('candidate')
                }
              </h1>
              <p className="profile-title">{candidate.title || t('positionNotSpecified')}</p>

              <div className="profile-details">
                <div className="profile-detail">
                  <MapPin className="icon" />
                  <span>{candidate.location || t('locationNotSpecified')}</span>
                </div>
                <div className="profile-detail">
                  <Briefcase className="icon" />
                  <span>
                    {candidate.yearsOfExperience 
                      ? t('yearsOfExperience').replace('{years}', candidate.yearsOfExperience.toString())
                      : t('experienceNotSpecified')
                    }
                  </span>
                </div>
                <div className="profile-detail">
                  <Calendar className="icon" />
                  <span>
                    {candidate.preferences?.availability 
                      ? `${t('availableIn')} ${candidate.preferences.availability}`
                      : t('availabilityNotSpecified')
                    }
                  </span>
                </div>
                <div className="profile-detail">
                  <Globe className="icon" />
                  <span>
                    {t('updated')}: {new Date(candidate.updatedAt).toLocaleDateString('uk-UA')}
                  </span>
                </div>
              </div>

              <div className="profile-contact">
                <button onClick={handleContact} className="contact-btn">
                  <MessageSquare className="icon" />
                  {t('contact')}
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="profile-section">
            <h2>{t('aboutMe')}</h2>
            <p className="profile-bio">
              {candidate.bio || candidate.summary || t('descriptionNotSpecified')}
            </p>
          </div>

          {/* Skills */}
          <div className="profile-section">
            <h2>{t('skills')}</h2>
            <div className="skills-grid">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <p>{t('skillsNotSpecified')}</p>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="profile-section">
            <h2>{t('workExperience')}</h2>
            <div className="experience-list">
              {candidate.workHistory && candidate.workHistory.length > 0 ? (
                candidate.workHistory.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <h3>{exp.position}</h3>
                      <span className="company">{exp.company}</span>
                      <span className="duration">
                        {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : t('toPresent')}
                      </span>
                    </div>
                    <p className="experience-description">{exp.description}</p>
                  </div>
                ))
              ) : candidate.workExperience && candidate.workExperience.length > 0 ? (
                candidate.workExperience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <p className="experience-description">{exp}</p>
                  </div>
                ))
              ) : (
                <p>{t('workExperienceNotSpecified')}</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="profile-section">
            <h2>{t('education')}</h2>
            <div className="education-list">
              {candidate.education && candidate.education.length > 0 ? (
                candidate.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h3>{edu}</h3>
                  </div>
                ))
              ) : (
                <p>{t('educationNotSpecified')}</p>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="profile-section">
            <h2>{t('certifications')}</h2>
            <div className="certifications-list">
              {candidate.certifications && candidate.certifications.length > 0 ? (
                candidate.certifications.map((cert, index) => (
                  <div key={index} className="certification-item">
                    <h3>{cert}</h3>
                  </div>
                ))
              ) : (
                <p>{t('certificationsNotSpecified')}</p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="profile-section">
            <h2>{t('languages')}</h2>
            <div className="languages-list">
              {candidate.languages && candidate.languages.length > 0 ? (
                candidate.languages.map((lang, index) => (
                  <div key={index} className="language-item">
                    <span className="language-name">{lang}</span>
                  </div>
                ))
              ) : (
                <p>{t('languagesNotSpecified')}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="profile-section">
            <h2>{t('contactInformation')}</h2>
            <div className="contact-info">
              {candidate.user?.email && (
                <div className="contact-item">
                  <Mail className="icon" />
                  <span>{candidate.user.email}</span>
                </div>
              )}
              {candidate.phone && (
                <div className="contact-item">
                  <Phone className="icon" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              {candidate.linkedin && (
                <div className="contact-item">
                  <Linkedin className="icon" />
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer">
                    {t('linkedinProfile')}
                  </a>
                </div>
              )}
              {candidate.github && (
                <div className="contact-item">
                  <Github className="icon" />
                  <a href={candidate.github} target="_blank" rel="noopener noreferrer">
                    {t('githubProfile')}
                  </a>
                </div>
              )}
              {candidate.website && (
                <div className="contact-item">
                  <Globe className="icon" />
                  <a href={candidate.website} target="_blank" rel="noopener noreferrer">
                    {t('personalWebsite')}
                  </a>
                </div>
              )}
              {candidate.portfolio && (
                <div className="contact-item">
                  <Globe className="icon" />
                  <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer">
                    {t('portfolio')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Expected Salary */}
          <div className="profile-section">
            <h2>{t('expectedSalary')}</h2>
            <div className="salary-info">
              <span className="salary-range">
                {candidate.preferences?.salaryExpectation 
                  ? `${candidate.preferences.salaryExpectation} USD`
                  : candidate.preferences?.desiredSalary
                  ? `${candidate.preferences.desiredSalary} USD`
                  : t('notSpecified')
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateProfilePage;
