import React, { useState } from 'react';
import { MessageSquare, Clock, Calendar, User, Video, Phone, MapPin, Plus, Filter, Search, MoreHorizontal, Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle, Star, Calendar as CalendarIcon, Clock as ClockIcon, Users, Briefcase, Mail, Phone as PhoneIcon, MapPin as MapPinIcon, ExternalLink, Download, RefreshCw, Settings, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Minus, FileText, Camera, Mic, MicOff, Video as VideoIcon, VideoOff, Share2, Copy, Check, UserCheck, UserX, UserPlus, UserMinus, MessageCircle, PhoneCall, CalendarDays, Clock as ClockIcon2, AlertTriangle, Info, HelpCircle, Settings as SettingsIcon, BarChart3, TrendingUp, TrendingDown, Activity, Zap, Target, Award, Star as StarIcon, Trophy, Medal, Crown, TrendingUpIcon, TrendingDownIcon, Calendar as CalendarIcon2, Clock as ClockIcon3, UserCheck as UserCheckIcon, UserX as UserXIcon, UserPlus as UserPlusIcon, UserMinus as UserMinusIcon, Mail as MailIcon, Phone as PhoneIcon2, MessageSquare as MessageSquareIcon, FileText as FileTextIcon, Database, Globe, Lock, Shield, Zap as ZapIcon, Target as TargetIcon, Award as AwardIcon } from 'lucide-react';

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobTitle: string;
  company: string;
  interviewer: string;
  interviewerEmail: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string;
  videoUrl?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  stage: 'screening' | 'technical' | 'final' | 'offer';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface InterviewStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  rescheduled: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

const InterviewsPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showFilters, setShowFilters] = useState(false);

  const interviews: Interview[] = [
    {
      id: '1',
      candidateName: 'Анна Коваленко',
      candidateEmail: 'anna.kovalenko@email.com',
      candidatePhone: '+380501234567',
      jobTitle: 'Frontend Developer',
      company: 'TechCorp',
      interviewer: 'Марія Петренко',
      interviewerEmail: 'maria.petrenko@techcorp.com',
      date: '2025-08-26',
      time: '10:00',
      duration: 60,
      type: 'video',
      status: 'scheduled',
      videoUrl: 'https://meet.google.com/abc-defg-hij',
      notes: 'Кандидат має досвід з React та TypeScript',
      stage: 'technical',
      priority: 'high',
      tags: ['React', 'TypeScript', 'Frontend']
    },
    {
      id: '2',
      candidateName: 'Олександр Іваненко',
      candidateEmail: 'oleksandr.ivanenko@email.com',
      candidatePhone: '+380502345678',
      jobTitle: 'Backend Developer',
      company: 'TechCorp',
      interviewer: 'Ігор Сидоренко',
      interviewerEmail: 'igor.sydorenko@techcorp.com',
      date: '2025-08-26',
      time: '14:00',
      duration: 90,
      type: 'in-person',
      status: 'scheduled',
      location: 'Офіс TechCorp, вул. Хрещатик, 1',
      notes: 'Фінальне інтерв\'ю з CTO',
      stage: 'final',
      priority: 'high',
      tags: ['Node.js', 'Python', 'Backend']
    },
    {
      id: '3',
      candidateName: 'Юлія Мельник',
      candidateEmail: 'yulia.melnyk@email.com',
      candidatePhone: '+380503456789',
      jobTitle: 'UI/UX Designer',
      company: 'TechCorp',
      interviewer: 'Тетяна Шевченко',
      interviewerEmail: 'tetiana.shevchenko@techcorp.com',
      date: '2025-08-25',
      time: '11:30',
      duration: 45,
      type: 'phone',
      status: 'completed',
      notes: 'Первинне скринінг інтерв\'ю',
      rating: 4,
      feedback: 'Кандидат показав хороші знання в дизайні',
      stage: 'screening',
      priority: 'medium',
      tags: ['Figma', 'UI/UX', 'Design']
    },
    {
      id: '4',
      candidateName: 'Дмитро Бондаренко',
      candidateEmail: 'dmytro.bondarenko@email.com',
      candidatePhone: '+380504567890',
      jobTitle: 'DevOps Engineer',
      company: 'TechCorp',
      interviewer: 'Віктор Кравченко',
      interviewerEmail: 'viktor.kravchenko@techcorp.com',
      date: '2025-08-27',
      time: '16:00',
      duration: 75,
      type: 'video',
      status: 'scheduled',
      videoUrl: 'https://meet.google.com/xyz-uvw-rst',
      notes: 'Технічне інтерв\'ю з практичними завданнями',
      stage: 'technical',
      priority: 'medium',
      tags: ['Docker', 'Kubernetes', 'AWS']
    },
    {
      id: '5',
      candidateName: 'Катерина Ткаченко',
      candidateEmail: 'kateryna.tkachenko@email.com',
      candidatePhone: '+380505678901',
      jobTitle: 'Product Manager',
      company: 'TechCorp',
      interviewer: 'Олена Мороз',
      interviewerEmail: 'olena.moroz@techcorp.com',
      date: '2025-08-24',
      time: '13:00',
      duration: 60,
      type: 'in-person',
      status: 'cancelled',
      location: 'Офіс TechCorp, вул. Хрещатик, 1',
      notes: 'Кандидат скасував інтерв\'ю через хворобу',
      stage: 'final',
      priority: 'high',
      tags: ['Product Management', 'Agile', 'Scrum']
    },
    {
      id: '6',
      candidateName: 'Максим Романенко',
      candidateEmail: 'maksym.romanenko@email.com',
      candidatePhone: '+380506789012',
      jobTitle: 'QA Engineer',
      company: 'TechCorp',
      interviewer: 'Наталія Лисенко',
      interviewerEmail: 'natalia.lysenko@techcorp.com',
      date: '2025-08-28',
      time: '09:30',
      duration: 60,
      type: 'video',
      status: 'scheduled',
      videoUrl: 'https://meet.google.com/mno-pqr-stu',
      notes: 'Тестування автоматизації',
      stage: 'technical',
      priority: 'low',
      tags: ['Selenium', 'Cypress', 'Testing']
    }
  ];

  const interviewStats: InterviewStats = {
    total: interviews.length,
    scheduled: interviews.filter(i => i.status === 'scheduled').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length,
    rescheduled: interviews.filter(i => i.status === 'rescheduled').length,
    today: interviews.filter(i => i.date === '2025-08-26').length,
    thisWeek: interviews.filter(i => {
      const date = new Date(i.date);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return date >= weekStart && date <= weekEnd;
    }).length,
    thisMonth: interviews.filter(i => {
      const date = new Date(i.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  };

  const statuses = [
    { id: 'all', name: 'Всі статуси', icon: <MessageSquare size={16} /> },
    { id: 'scheduled', name: 'Заплановані', icon: <Clock size={16} /> },
    { id: 'completed', name: 'Завершені', icon: <CheckCircle size={16} /> },
    { id: 'cancelled', name: 'Скасовані', icon: <XCircle size={16} /> },
    { id: 'rescheduled', name: 'Перенесені', icon: <AlertCircle size={16} /> }
  ];

  const types = [
    { id: 'all', name: 'Всі типи', icon: <Video size={16} /> },
    { id: 'video', name: 'Відео', icon: <Video size={16} /> },
    { id: 'phone', name: 'Телефон', icon: <Phone size={16} /> },
    { id: 'in-person', name: 'Особисто', icon: <User size={16} /> }
  ];

  const stages = [
    { id: 'all', name: 'Всі етапи', icon: <UserCheck size={16} /> },
    { id: 'screening', name: 'Скринінг', icon: <UserCheck size={16} /> },
    { id: 'technical', name: 'Технічне', icon: <Settings size={16} /> },
    { id: 'final', name: 'Фінальне', icon: <Award size={16} /> },
    { id: 'offer', name: 'Оффер', icon: <Star size={16} /> }
  ];

  const filteredInterviews = interviews.filter(interview => {
    const matchesStatus = selectedStatus === 'all' || interview.status === selectedStatus;
    const matchesType = selectedType === 'all' || interview.type === selectedType;
    const matchesStage = selectedStage === 'all' || interview.stage === selectedStage;
    const matchesSearch = searchQuery === '' || 
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.company.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesStage && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'rescheduled':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Заплановано';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Скасовано';
      case 'rescheduled':
        return 'Перенесено';
      default:
        return 'Невідомо';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} />;
      case 'phone':
        return <Phone size={16} />;
      case 'in-person':
        return <User size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Високий';
      case 'medium':
        return 'Середній';
      case 'low':
        return 'Низький';
      default:
        return 'Невідомо';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Інтерв'ю</h1>
        <p className="dashboard-greeting-subtitle">Планування та управління співбесідами</p>
      </div>

      <div className="interviews-container">
        {/* Статистика */}
        <div className="interviews-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <h3>{interviewStats.total}</h3>
                <p>Всього інтерв'ю</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <h3>{interviewStats.scheduled}</h3>
                <p>Заплановані</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>{interviewStats.completed}</h3>
                <p>Завершені</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <CalendarDays size={24} />
              </div>
              <div className="stat-content">
                <h3>{interviewStats.today}</h3>
                <p>Сьогодні</p>
              </div>
            </div>
          </div>
        </div>

        {/* Фільтри та пошук */}
        <div className="interviews-filters">
          <div className="filters-left">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Пошук кандидатів, вакансій..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="filters-right">
            <div className="filter-group">
              <label>Статус:</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Тип:</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Етап:</label>
              <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
            </div>

            <div className="view-controls">
              <button
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FileText size={16} />
                <span>Список</span>
              </button>
              <button
                className={`view-button ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <Calendar size={16} />
                <span>Календар</span>
              </button>
            </div>

            <button className="add-interview-button">
              <Plus size={16} />
              <span>Додати інтерв'ю</span>
            </button>
          </div>
        </div>

        {/* Список інтерв'ю */}
        <div className="interviews-list">
          {filteredInterviews.map((interview) => (
            <div key={interview.id} className="interview-card">
              <div className="interview-header">
                <div className="interview-info">
                  <h3>{interview.candidateName}</h3>
                  <p className="job-title">{interview.jobTitle} • {interview.company}</p>
                </div>
                <div className="interview-status">
                  <span className={`status-badge ${getStatusColor(interview.status)}`}>
                    {getStatusText(interview.status)}
                  </span>
                  <span className={`priority-badge ${getPriorityColor(interview.priority)}`}>
                    {getPriorityText(interview.priority)}
                  </span>
                </div>
              </div>

              <div className="interview-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{formatDate(interview.date)}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{formatTime(interview.time)} ({interview.duration} хв)</span>
                  </div>
                  <div className="detail-item">
                    {getTypeIcon(interview.type)}
                    <span>
                      {interview.type === 'video' ? 'Відео' : 
                       interview.type === 'phone' ? 'Телефон' : 'Особисто'}
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <User size={16} />
                    <span>Інтерв'юер: {interview.interviewer}</span>
                  </div>
                  <div className="detail-item">
                    <Briefcase size={16} />
                    <span>Етап: {interview.stage}</span>
                  </div>
                </div>

                {interview.location && (
                  <div className="detail-row">
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{interview.location}</span>
                    </div>
                  </div>
                )}

                {interview.videoUrl && (
                  <div className="detail-row">
                    <div className="detail-item">
                      <Video size={16} />
                      <a href={interview.videoUrl} target="_blank" rel="noopener noreferrer">
                        Приєднатися до відеодзвінка
                      </a>
                    </div>
                  </div>
                )}

                {interview.notes && (
                  <div className="interview-notes">
                    <p>{interview.notes}</p>
                  </div>
                )}

                {interview.rating && (
                  <div className="interview-rating">
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= interview.rating! ? 'filled' : 'empty'}
                        />
                      ))}
                    </div>
                    {interview.feedback && (
                      <p className="feedback">{interview.feedback}</p>
                    )}
                  </div>
                )}

                {interview.tags.length > 0 && (
                  <div className="interview-tags">
                    {interview.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="interview-actions">
                <button className="action-button">
                  <Eye size={16} />
                  <span>Переглянути</span>
                </button>
                <button className="action-button">
                  <Edit size={16} />
                  <span>Редагувати</span>
                </button>
                <button className="action-button">
                  <MessageSquare size={16} />
                  <span>Повідомити</span>
                </button>
                <button className="action-button">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Швидкі дії */}
        <div className="quick-actions">
          <h3>Швидкі дії</h3>
          <div className="actions-grid">
            <button className="quick-action">
              <Plus size={20} />
              <span>Запланувати інтерв'ю</span>
            </button>
            <button className="quick-action">
              <Calendar size={20} />
              <span>Переглянути календар</span>
            </button>
            <button className="quick-action">
              <Download size={20} />
              <span>Експорт звіту</span>
            </button>
            <button className="quick-action">
              <Settings size={20} />
              <span>Налаштування</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewsPage;
