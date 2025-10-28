'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EventClickArg, DateSelectArg, EventChangeArg, EventInput } from '@fullcalendar/core';
import { useLanguageStore } from '../../stores/languageStore';
import { useAuthStore } from '../../stores/authStore';
import { eventService, Event, CreateEventData, UpdateEventData } from '../../services/eventService';
import { fullcalendarLocales } from '../../locales/fullcalendar';
import EventModal from './EventModal';
import '../../styles/checkboxes.css';

interface FullCalendarComponentProps {
  onEventUpdate?: (event: Event) => void;
  onEventDelete?: (eventId: string) => void;
}

const FullCalendarComponent: React.FC<FullCalendarComponentProps> = ({
  onEventUpdate,
  onEventDelete
}) => {
  const { t, currentLanguage } = useLanguageStore();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [error, setError] = useState<string | null>(null);
  const [lastLoadParams, setLastLoadParams] = useState<string>('');
  const [listYearLoaded, setListYearLoaded] = useState(false);

  // Load events for current view
  const loadEvents = useCallback(async (year?: number, month?: number, forceAllEvents = false) => {
    // Перевіряємо авторизацію
    if (!isAuthenticated) {
      setEvents([]);
      return;
    }
    
    // Створюємо унікальний ключ для поточного завантаження
    const loadKey = `${currentView}-${year || 'current'}-${month || 'current'}-${forceAllEvents}`;
    
    // Перевіряємо чи не завантажуємо вже події з тими ж параметрами
    if (loading || lastLoadParams === loadKey) {
      return;
    }
    
    // Для listYear view перевіряємо чи вже завантажили
    if (currentView === 'listYear' && listYearLoaded && !forceAllEvents) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastLoadParams(loadKey);
    
    try {
      let events;
      
      // Завантажуємо події залежно від view
      if (currentView === 'listYear' || forceAllEvents) {
        // Для listYear view завантажуємо всі події
        events = await eventService.getEvents();
      } else {
        // Для всіх інших view завантажуємо події за місяць
        const targetYear = year || new Date().getFullYear();
        const targetMonth = month || new Date().getMonth() + 1;
        events = await eventService.getEventsByMonth(targetYear, targetMonth);
      }
      
      if (events && Array.isArray(events)) {
        setEvents(events);
        setError(null);
        // Встановлюємо прапор для listYear view
        if (currentView === 'listYear' || forceAllEvents) {
          setListYearLoaded(true);
        }
      } else {
        setEvents([]);
        setError(t('errorLoadingEvents'));
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
      setError(t('errorLoadingEvents'));
    } finally {
      setLoading(false);
    }
  }, [currentView, isAuthenticated, t, listYearLoaded]);

  // Завантажуємо події при ініціалізації
  useEffect(() => {
    // Чекаємо поки авторизація не завантажиться
    if (authLoading) {
      return;
    }
    
    // Завантажуємо події тільки якщо користувач авторизований
    if (isAuthenticated) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      loadEvents(currentYear, currentMonth);
    } else {
      setEvents([]);
    }
  }, [isAuthenticated, authLoading]);

  // Оновлюємо події при зміні view (тільки для listYear)
  useEffect(() => {
    // Завантажуємо події тільки якщо користувач авторизований
    if (!isAuthenticated) {
      return;
    }
    
    // Скидаємо прапор listYearLoaded при зміні view
    if (currentView !== 'listYear') {
      setListYearLoaded(false);
    }
    
    // Завантажуємо події тільки для listYear view і тільки якщо ще не завантажили
    if (currentView === 'listYear' && !listYearLoaded) {
      loadEvents(undefined, undefined, true); // forceAllEvents = true
    }
  }, [currentView, isAuthenticated, listYearLoaded]);

  // Convert events to FullCalendar format
  const convertedEvents = useMemo((): EventInput[] => {
    if (!events || !Array.isArray(events) || events.length === 0) {
      return [];
    }
    
    const converted = events.map(event => {
      const convertedEvent = {
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        allDay: event.isAllDay || false,
        color: eventService.getEventColor(event),
        extendedProps: {
          description: event.description,
          type: event.type,
          priority: event.priority,
          status: event.status,
          notes: event.notes,
          recurrenceType: event.recurrenceType,
          completionPercentage: event.completionPercentage,
          isPrivate: event.isPrivate,
          isActive: event.isActive,
          completedAt: event.completedAt,
          cancelledAt: event.cancelledAt,
          cancellationReason: event.cancellationReason,
          locationDetails: event.locationDetails,
          externalAttendees: event.externalAttendees,
          jobId: event.jobId,
          candidateId: event.candidateId,
          companyId: event.companyId
        }
      };
      return convertedEvent;
    });
    return converted;
  }, [events]);

  // Event handlers
  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setSelectedDate(undefined);
      setIsModalOpen(true);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Виправляємо проблему з часовими зонами
    // Створюємо нову дату в локальному часі
    const localDate = new Date(
      selectInfo.start.getFullYear(),
      selectInfo.start.getMonth(),
      selectInfo.start.getDate()
    );
    
    setSelectedDate(localDate);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEventChange = (changeInfo: EventChangeArg) => {
    const eventId = changeInfo.event.id;
    const event = events.find(e => e.id === eventId);
    
    if (event && changeInfo.event.start) {
      const updatedEvent: UpdateEventData = {
        ...event,
        startDate: changeInfo.event.start.toISOString(),
        endDate: changeInfo.event.end?.toISOString() || undefined
      };
      
      // Update event via API
      eventService.updateEvent(eventId, updatedEvent).then(() => {
        loadEvents();
        if (onEventUpdate) {
          onEventUpdate({ ...event, ...updatedEvent });
        }
      }).catch(error => {
        console.error('Error updating event:', error);
        setError(t('errorUpdatingEvent'));
        // Revert the change by reloading events
        loadEvents();
      });
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData: CreateEventData | UpdateEventData) => {
    try {
      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, eventData as UpdateEventData);
        if (onEventUpdate) {
          onEventUpdate({ ...selectedEvent, ...eventData });
        }
      } else {
        await eventService.createEvent(eventData as CreateEventData);
      }
      loadEvents();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      setError(selectedEvent ? t('errorUpdatingEvent') : t('errorCreatingEvent'));
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm(t('confirmDeleteEvent'))) {
      try {
        await eventService.deleteEvent(eventId);
        if (onEventDelete) {
          onEventDelete(eventId);
        }
        loadEvents();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting event:', error);
        setError(t('errorDeletingEvent'));
      }
    }
  };

  // Calendar options
  const calendarOptions = useMemo(() => {
    const currentLocale = fullcalendarLocales[currentLanguage as keyof typeof fullcalendarLocales] || fullcalendarLocales.en;
    
    return {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear'
      },
      locale: currentLocale,
      buttonText: currentLocale.buttonText,
      height: 'auto',
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      events: convertedEvents,
      eventClick: handleEventClick,
      select: handleDateSelect,
      eventChange: handleEventChange,
      eventDrop: handleEventChange,
      eventResize: handleEventChange,
      datesSet: (dateInfo: any) => {
        // Завантажуємо події тільки при зміні місяця для dayGridMonth view
        const year = dateInfo.start.getFullYear();
        const month = dateInfo.start.getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        // Завантажуємо події тільки для dayGridMonth view і тільки при зміні місяця
        if ((year !== currentYear || month !== currentMonth) && !loading && currentView === 'dayGridMonth') {
          loadEvents(year, month);
        }
        // Не завантажуємо події для listYear view в datesSet
      },
      viewDidMount: (viewInfo: any) => {
        setCurrentView(viewInfo.view.type);
        // Не завантажуємо події в viewDidMount - це робиться в useEffect
      },
      selectConstraint: {
        start: '00:00',
        end: '24:00'
      },
      slotMinTime: '00:00:00',
      slotMaxTime: '24:00:00',
      slotDuration: '00:30:00',
      slotLabelInterval: '01:00:00',
      allDaySlot: true,
      allDayText: currentLocale.allDayText,
      noEventsText: currentLocale.noEventsText,
      loading: (isLoading: boolean) => setLoading(isLoading),
      eventTimeFormat: {
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        meridiem: false,
        hour12: false
      },
      dayHeaderFormat: { weekday: 'short' as const },
      titleFormat: { month: 'long' as const, year: 'numeric' as const },
      firstDay: 1,
      views: {
        dayGridMonth: {
          dayMaxEvents: 10,
          moreLinkClick: 'popover'
        },
        timeGridWeek: {
          dayMaxEvents: 15
        },
        timeGridDay: {
          dayMaxEvents: 20
        },
        listYear: {
          listDayFormat: { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const },
          listDaySideFormat: { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const }
        }
      }
    };
  }, [convertedEvents, currentView, loading, currentLanguage, handleEventClick, handleDateSelect, handleEventChange, t, listYearLoaded]);

  // Показуємо завантаження поки авторизація не завантажиться
  if (authLoading) {
    return (
      <div className="fullcalendar-container">
        <div className="fullcalendar-header">
          <div className="fullcalendar-title">
            <h1>{t('calendar')}</h1>
          </div>
        </div>
        <div className="fullcalendar-loading">
          <div className="loading-spinner">{t('loadingEvents')}</div>
        </div>
      </div>
    );
  }

  // Показуємо повідомлення для неавторизованих користувачів
  if (!isAuthenticated) {
    return (
      <div className="fullcalendar-container">
        <div className="fullcalendar-header">
          <div className="fullcalendar-title">
            <h1>{t('calendar')}</h1>
          </div>
        </div>
        <div className="fullcalendar-unauthorized">
          <div className="unauthorized-message">
            <h3>🔒 {t('unauthorized')}</h3>
            <p>{t('loginRequired')}</p>
            <button 
              onClick={() => window.location.href = '/auth'} 
              className="btn btn-primary"
            >
              {t('login')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fullcalendar-container">
      <div className="fullcalendar-header">
        <div className="fullcalendar-title">
          <h1>{t('calendar')}</h1>
        </div>
        
        <button onClick={handleCreateEvent} className="add-event-btn">
          + {t('addEvent')}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="calendar-error">
          <div className="error-message">
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                loadEvents();
              }} 
              className="retry-btn"
            >
              {t('retry')}
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="calendar-loading">
          <div className="loading-spinner">{t('loadingEvents')}</div>
        </div>
      )}

      {/* Calendar */}
      <div className="fullcalendar-wrapper">
        <FullCalendar {...calendarOptions} />
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default FullCalendarComponent;