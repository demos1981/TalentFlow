import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Tag, AlertCircle } from 'lucide-react';
import { Event, CreateEventData, UpdateEventData } from '../../services/eventService';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/calendar.css';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  onSave: (eventData: CreateEventData | UpdateEventData) => void;
  selectedDate?: Date;
  onDelete?: (eventId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
  selectedDate,
  onDelete
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    type: 'other',
    priority: 'medium',
    isAllDay: false,
    isRecurring: false,
    location: null,
    attendees: [],
    reminders: [],
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      const startDateTime = new Date(event.startDate);
      const endDateTime = event.endDate ? new Date(event.endDate) : null;
      
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: startDateTime.toISOString().split('T')[0],
        endDate: endDateTime ? endDateTime.toISOString().split('T')[0] : '',
        startTime: startDateTime.toTimeString().slice(0, 5),
        endTime: endDateTime ? endDateTime.toTimeString().slice(0, 5) : '',
        type: event.type,
        priority: event.priority,
        isAllDay: event.isAllDay,
        isRecurring: event.isRecurring,
        location: event.location || null,
        attendees: event.attendees || [],
        reminders: event.reminders || [],
        tags: event.tags || []
      });
    } else if (selectedDate) {
      console.log('📅 EventModal received selectedDate:', selectedDate);
      console.log('📅 selectedDate.toISOString():', selectedDate.toISOString());
      console.log('📅 selectedDate.toLocaleDateString():', selectedDate.toLocaleDateString());
      
      // Використовуємо toLocaleDateString для правильного формату дати
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('📅 Formatted date string:', dateStr);
      
      setFormData(prev => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr,
        startTime: '09:00',
        endTime: '10:00'
      }));
    }
  }, [event, selectedDate]);

  const handleInputChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('eventTitleRequired');
    }

    if (!formData.startDate) {
      newErrors.startDate = t('startDateRequired');
    }

    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = t('endDateAfterStart');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Об'єднуємо дату та час
    const eventData = { ...formData };
    
    if (formData.startTime) {
      eventData.startDate = `${formData.startDate}T${formData.startTime}:00`;
      console.log('📅 Combined startDate:', eventData.startDate);
    }
    
    if (formData.endTime) {
      eventData.endDate = `${formData.endDate}T${formData.endTime}:00`;
      console.log('📅 Combined endDate:', eventData.endDate);
    }

    console.log('📅 Final eventData:', eventData);
    onSave(eventData);
    onClose();
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={e => e.stopPropagation()}>
        <div className="event-modal-header">
          <h2>{event ? t('editEvent') : t('createEvent')}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-modal-form">
          <div className="form-group">
            <label htmlFor="title">{t('eventTitle')} *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('enterEventTitle')}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">{t('description')}</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('enterEventDescription')}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">{t('startDate')} *</label>
              <div className="input-with-icon">
                <Calendar size={16} />
                <input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={errors.startDate ? 'error' : ''}
                />
              </div>
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">{t('endDate')}</label>
              <div className="input-with-icon">
                <Calendar size={16} />
                <input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={errors.endDate ? 'error' : ''}
                />
              </div>
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">{t('startTime')}</label>
              <div className="input-with-icon">
                <Clock size={16} />
                <input
                  id="startTime"
                  type="time"
                  value={formData.startTime || ''}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="endTime">{t('endTime')}</label>
              <div className="input-with-icon">
                <Clock size={16} />
                <input
                  id="endTime"
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">{t('eventType')}</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <option value="other">{t('other')}</option>
                <option value="interview">{t('interview')}</option>
                <option value="meeting">{t('meeting')}</option>
                <option value="deadline">{t('deadline')}</option>
                <option value="reminder">{t('reminder')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">{t('priority')}</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="low">{t('low')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="high">{t('high')}</option>
                <option value="urgent">{t('urgent')}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isAllDay}
                  onChange={(e) => handleInputChange('isAllDay', e.target.checked)}
                />
                {t('allDay')}
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                />
                {t('recurring')}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">{t('location')}</label>
            <div className="input-with-icon">
              <MapPin size={16} />
              <input
                id="location"
                type="text"
                value={formData.location?.address || ''}
                onChange={(e) => handleInputChange('location', { address: e.target.value })}
                placeholder={t('enterLocation')}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="attendees">{t('attendees')}</label>
            <div className="input-with-icon">
              <Users size={16} />
              <input
                id="attendees"
                type="text"
                placeholder={t('enterAttendees')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      handleInputChange('attendees', [...(formData.attendees || []), target.value.trim()]);
                      target.value = '';
                    }
                  }
                }}
              />
            </div>
            {formData.attendees && formData.attendees.length > 0 && (
              <div className="tags-container">
                {formData.attendees.map((attendee, index) => (
                  <span key={index} className="tag">
                    {attendee}
                    <button
                      type="button"
                      onClick={() => handleInputChange('attendees', formData.attendees?.filter((_, i) => i !== index))}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tags">{t('tags')}</label>
            <div className="input-with-icon">
              <Tag size={16} />
              <input
                id="tags"
                type="text"
                placeholder={t('enterTags')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      handleAddTag(target.value.trim());
                      target.value = '';
                    }
                  }
                }}
              />
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="tags-container">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            {/* Додаємо детальне логування для діагностики */}
            {console.log('🔍 EventModal Debug:', { 
              hasEvent: !!event, 
              eventId: event?.id, 
              eventTitle: event?.title,
              hasOnDelete: !!onDelete,
              eventType: typeof event,
              onDeleteType: typeof onDelete,
              eventKeys: event ? Object.keys(event) : [],
              eventStringified: event ? JSON.stringify(event, null, 2) : 'null'
            })}
            
            {event && onDelete && (
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => onDelete(event.id)}
              >
                {t('delete')}
              </button>
            )}
            
            <div className="form-actions-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                {t('cancel')}
              </button>
              <button type="submit" className="btn btn-primary">
                {event ? t('update') : t('create')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
