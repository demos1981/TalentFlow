import React from 'react';
import { useLanguageStore } from '../stores/languageStore';
import FullCalendarComponent from '../components/Calendar/FullCalendar';
import '../styles/calendar.css';

const CalendarPage: React.FC = () => {
  const { t } = useLanguageStore();

  const handleEventUpdate = (event: any) => {
    console.log('Event updated:', event);
  };

  const handleEventDelete = (eventId: string) => {
    console.log('Event deleted:', eventId);
  };

  return (
    <div className="calendar-page">
      <FullCalendarComponent
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
};

export default CalendarPage;
