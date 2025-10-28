'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Tag, AlertCircle } from 'lucide-react';
import { Event, CreateEventData, UpdateEventData } from '../../services/eventService';
import { useLanguageStore } from '../../stores/languageStore';
import '../../styles/checkboxes.css';

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
  const { t } = useLanguageStore();
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    type: 'other',
    status: 'scheduled',
    priority: 'medium',
    isAllDay: false,
    isRecurring: false,
    recurrenceType: 'none',
    location: '',
    attendees: [],
    externalAttendees: [],
    reminders: [],
    tags: [],
    isPrivate: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalData, setOriginalData] = useState<CreateEventData | null>(null);

  useEffect(() => {
    if (event) {
      const startDateTime = new Date(event.startDate);
      const endDateTime = event.endDate ? new Date(event.endDate) : null;
      
      const eventFormData: CreateEventData = {
        title: event.title,
        description: event.description || '',
        notes: event.notes || '',
        startDate: startDateTime.toISOString().split('T')[0],
        endDate: endDateTime ? endDateTime.toISOString().split('T')[0] : '',
        startTime: event.isAllDay ? '' : startDateTime.toTimeString().slice(0, 5),
        endTime: endDateTime && !event.isAllDay ? endDateTime.toTimeString().slice(0, 5) : '',
        type: event.type,
        status: event.status,
        priority: event.priority,
        isAllDay: event.isAllDay,
        isRecurring: event.isRecurring,
        recurrenceType: event.recurrenceType,
        location: event.location || '',
        locationDetails: event.locationDetails,
        attendees: event.attendees || [],
        externalAttendees: event.externalAttendees || [],
        reminders: event.reminders || [],
        tags: event.tags || [],
        isPrivate: event.isPrivate,
        jobId: event.jobId,
        candidateId: event.candidateId,
        companyId: event.companyId
      };
      
      setFormData(eventFormData);
      setOriginalData(eventFormData); // Зберігаємо оригінальні дані
    } else if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr
      }));
    } else {
      // Reset form for new event
      const newEventData: CreateEventData = {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        type: 'other',
        status: 'scheduled',
        priority: 'medium',
        isAllDay: false,
        isRecurring: false,
        recurrenceType: 'none',
        location: '',
        attendees: [],
        externalAttendees: [],
        reminders: [],
        tags: [],
        isPrivate: false
      };
      
      setFormData(newEventData);
      setOriginalData(newEventData); // Зберігаємо оригінальні дані
    }
    setErrors({});
  }, [event, selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const tag = input.value.trim();
      
      if (tag && !formData.tags?.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tag]
        }));
        input.value = '';
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('eventTitleRequired');
    }

    if (!formData.startDate) {
      newErrors.startDate = t('startDateRequired');
    }

    if (formData.endDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = t('endDateAfterStart');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Функція для порівняння змінених полів
  const getChangedFields = () => {
    if (!originalData) return formData;
    
    const changedFields: Partial<CreateEventData> = {};
    
    // Порівнюємо кожне поле
    Object.keys(formData).forEach(key => {
      const currentValue = formData[key as keyof CreateEventData];
      const originalValue = originalData[key as keyof CreateEventData];
      
      // Порівнюємо значення (включаючи масиви)
      if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
        if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
          changedFields[key as keyof CreateEventData] = currentValue;
        }
      } else if (currentValue !== originalValue) {
        changedFields[key as keyof CreateEventData] = currentValue;
      }
    });
    
    return changedFields;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Отримуємо тільки змінені поля
    const changedFields = getChangedFields();
    
    // Prepare event data - only send changed fields and filter out null/empty values
    const eventData: CreateEventData | UpdateEventData = {};
    
    // Додаємо тільки змінені поля
    Object.keys(changedFields).forEach(key => {
      const value = changedFields[key as keyof CreateEventData];
      
      // Пропускаємо startTime та endTime - вони не потрібні в API
      if (key === 'startTime' || key === 'endTime') {
        return;
      }
      
      if (key === 'startDate' || key === 'endDate') {
        // Обробляємо дати
        if (key === 'startDate') {
          eventData.startDate = formData.isAllDay 
            ? new Date(formData.startDate).toISOString()
            : new Date(`${formData.startDate}T${formData.startTime || '00:00'}`).toISOString();
        } else if (key === 'endDate' && formData.endDate) {
          eventData.endDate = formData.isAllDay 
            ? new Date(formData.endDate).toISOString()
            : new Date(`${formData.endDate}T${formData.endTime || '00:00'}`).toISOString();
        }
      } else if (value !== '' && value !== null && value !== undefined) {
        // Додаємо інші поля, якщо вони не пусті
        if (Array.isArray(value)) {
          if (value.length > 0) {
            eventData[key as keyof CreateEventData] = value;
          }
        } else {
          eventData[key as keyof CreateEventData] = value;
        }
      }
    });

    onSave(eventData);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal only if clicking on the overlay itself, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onClick={handleOverlayClick}>
      <div className="event-modal">
        <div className="event-modal-header">
          <h2>{event ? t('editEvent') : t('createEvent')}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-modal-form">
          <div className="form-group">
            <label htmlFor="title">{t('eventTitle')}</label>
            <div className="input-with-icon">
              <Calendar className="input-icon" size={16} />
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? 'error' : ''}
                placeholder={t('enterEventTitle')}
              />
            </div>
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">{t('enterEventDescription')}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder={t('enterEventDescription')}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">{t('startDate')}</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">{t('endDate')}</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">{t('startTime')}</label>
              <div className="input-with-icon">
                <Clock className="input-icon" size={16} />
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  disabled={formData.isAllDay}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="endTime">{t('endTime')}</label>
              <div className="input-with-icon">
                <Clock className="input-icon" size={16} />
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  disabled={formData.isAllDay}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">{t('eventType')}</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="interview">{t('interview')}</option>
                <option value="meeting">{t('meeting')}</option>
                <option value="deadline">{t('deadline')}</option>
                <option value="reminder">{t('reminder')}</option>
                <option value="training">{t('training')}</option>
                <option value="conference">{t('conference')}</option>
                <option value="workshop">{t('workshop')}</option>
                <option value="presentation">{t('presentation')}</option>
                <option value="review">{t('review')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">{t('priority')}</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">{t('low')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="high">{t('high')}</option>
                <option value="urgent">{t('urgent')}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">{t('eventLocation')}</label>
            <div className="input-with-icon">
              <MapPin className="input-icon" size={16} />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                placeholder={t('enterLocation')}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="attendees">{t('attendees')}</label>
            <div className="input-with-icon">
              <Users className="input-icon" size={16} />
              <input
                type="text"
                id="attendees"
                name="attendees"
                placeholder={t('enterAttendees')}
                onKeyPress={handleTagAdd}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">{t('tags')}</label>
            <div className="input-with-icon">
              <Tag className="input-icon" size={16} />
              <input
                type="text"
                id="tags"
                name="tags"
                placeholder={t('enterTags')}
                onKeyPress={handleTagAdd}
              />
            </div>
            <div className="tags-container">
              {formData.tags?.map((tag, index) => (
                <div key={index} className="tag">
                  {tag}
                  <button type="button" onClick={() => handleTagRemove(tag)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="custom-checkbox">
              <input
                type="checkbox"
                id="isAllDay"
                name="isAllDay"
                checked={formData.isAllDay}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <label htmlFor="isAllDay" className="checkbox-label">
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">{t('allDay')}</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="custom-checkbox">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <label htmlFor="isRecurring" className="checkbox-label">
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">{t('recurring')}</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <div className="form-actions-right">
              {event && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(event.id)}
                  className="btn btn-danger"
                >
                  {t('deleteEvent')}
                </button>
              )}
              <button type="button" onClick={onClose} className="btn btn-secondary">
                {t('cancel')}
              </button>
              <button type="submit" className="btn btn-primary">
                {event ? t('update') : t('createEventButton')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;