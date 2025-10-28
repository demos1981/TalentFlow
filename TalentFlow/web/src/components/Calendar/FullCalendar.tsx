import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EventClickArg, DateSelectArg, EventChangeArg, EventInput } from '@fullcalendar/core';
// Власна українська локалізація
const ukLocale = {
  code: 'uk',
  week: {
    dow: 1, // Понеділок як перший день тижня
    doy: 7  // Тиждень, що містить 7 січня, є першим тижнем року
  },
  buttonText: {
    prev: 'Попередній',
    next: 'Наступний',
    today: 'Сьогодні',
    month: 'Місяць',
    week: 'Тиждень',
    day: 'День',
    list: 'Список'
  },
  weekText: 'Тижд',
  allDayText: 'Весь день',
  moreLinkText: 'ще %d',
  noEventsText: 'Немає подій для відображення'
};
import { useLanguage } from '../../contexts/LanguageContext';
import { eventService, Event, CreateEventData, UpdateEventData } from '../../services/eventService';
import EventModal from './EventModal';
import '../../styles/fullcalendar.css';

interface FullCalendarComponentProps {
  onEventUpdate?: (event: Event) => void;
  onEventDelete?: (eventId: string) => void;
}

const FullCalendarComponent: React.FC<FullCalendarComponentProps> = ({
  onEventUpdate,
  onEventDelete
}) => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dayGridMonth');

  // Load events for current view
  const loadEvents = useCallback(async (year?: number, month?: number) => {
    console.log('🚀 loadEvents called with:', { year, month, currentView });
    
    // Перевіряємо чи не завантажуємо вже події
    if (loading) {
      console.log('⏳ Already loading events, skipping...');
      return;
    }
    
    setLoading(true);
    try {
      const targetYear = year || new Date().getFullYear();
      const targetMonth = month || new Date().getMonth() + 1;
      
      let events;
      
      // Завантажуємо події залежно від поточного view
      if (currentView === 'listYear') {
        // Для listYear view завантажуємо всі події користувача
        console.log('📅 Loading events for listYear view (all events):');
        events = await eventService.getEvents();
      } else {
        // Для всіх інших view завантажуємо події за місяць
        console.log('📅 Loading events for view:', { currentView, targetYear, targetMonth });
        events = await eventService.getEventsByMonth(targetYear, targetMonth);
      }
      
      console.log('📡 API response:', events);
      
      if (events && Array.isArray(events)) {
        console.log('✅ Setting events:', events.length);
        setEvents(events);
      } else {
        console.warn('⚠️ API повернув не масив:', events);
        setEvents([]);
      }
    } catch (error) {
      console.error('❌ Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentView, loading]);

  // Завантажуємо події при ініціалізації
  useEffect(() => {
    console.log('🔄 useEffect for initial loadEvents called');
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    console.log('📅 Current date:', { currentYear, currentMonth });
    loadEvents(currentYear, currentMonth);
  }, []); // Тільки при ініціалізації

  // Оновлюємо події при зміні view
  useEffect(() => {
    console.log('🔄 View changed to:', currentView);
    
    if (currentView === 'listYear') {
      console.log('📅 Reloading events for listYear view');
      loadEvents();
    } else if (currentView !== 'dayGridMonth') {
      // Для інших view (крім month) завантажуємо події
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      console.log('📅 Reloading events for new view:', { currentView, currentYear, currentMonth });
      loadEvents(currentYear, currentMonth);
    }
  }, [currentView, loadEvents]);

  // Convert events to FullCalendar format
  const convertedEvents = useMemo((): EventInput[] => {
    console.log('Converting events to FullCalendar format:', events);
    if (!events || events.length === 0) {
      console.log('No events to convert');
      return [];
    }
    
    const converted = events.map(event => {
      const convertedEvent = {
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate || new Date(new Date(event.startDate).getTime() + 60 * 60 * 1000),
        allDay: event.isAllDay,
        backgroundColor: eventService.getEventColor(event),
        borderColor: eventService.getEventColor(event),
        textColor: '#ffffff',
        className: `fc-event-${event.type}`,
        extendedProps: {
          description: event.description,
          type: event.type,
          priority: event.priority,
          location: event.location,
          attendees: event.attendees,
          reminders: event.reminders,
          tags: event.tags,
          metadata: event.metadata,
          isCompleted: event.isCompleted,
          isRecurring: event.isRecurring,
          recurrenceRule: event.recurrenceRule
        }
      };
      return convertedEvent;
    });
    console.log('Total converted events:', converted.length);
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
    console.log('📅 Date selected:', selectInfo);
    console.log('📅 Start date:', selectInfo.start);
    console.log('📅 Start date UTC:', selectInfo.start.toISOString());
    console.log('📅 Start date local:', selectInfo.start.toLocaleDateString());
    
    // Виправляємо проблему з часовими зонами
    // Створюємо нову дату в локальному часі
    const localDate = new Date(
      selectInfo.start.getFullYear(),
      selectInfo.start.getMonth(),
      selectInfo.start.getDate()
    );
    
    console.log('📅 Local date created:', localDate);
    console.log('📅 Local date UTC:', localDate.toISOString());
    console.log('📅 Local date local:', localDate.toLocaleDateString());
    
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
      }
    }
  };

  // Calendar options
  const calendarOptions = useMemo(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear'
    },
    locale: ukLocale,
    buttonText: {
      today: 'Сьогодні',
      month: 'Місяць',
      week: 'Тиждень',
      day: 'День',
      list: 'За рік'
    },
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
    datesSet: (dateInfo) => {
      // Завантажуємо події тільки при зміні місяця
      const year = dateInfo.start.getFullYear();
      const month = dateInfo.start.getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      if ((year !== currentYear || month !== currentMonth) && !loading && currentView === 'dayGridMonth') {
        console.log('Loading events for new month:', { year, month });
        loadEvents(year, month);
      }
    },
    viewDidMount: (viewInfo) => {
      console.log('View mounted:', viewInfo.view.type);
      setCurrentView(viewInfo.view.type);
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
    allDayText: 'Весь день',
    noEventsText: 'Немає подій',
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
  }), [convertedEvents, currentView, loading, ukLocale, handleEventClick, handleDateSelect, handleEventChange, loadEvents]);

  console.log('Calendar options created with events:', convertedEvents.length);

  return (
    <div className="fullcalendar-container">
      <div className="fullcalendar-header">
        <div className="fullcalendar-title">
          <h1>Календар</h1>
        </div>
        
        <button onClick={handleCreateEvent} className="add-event-btn">
          + Додати подію
        </button>
      </div>

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
