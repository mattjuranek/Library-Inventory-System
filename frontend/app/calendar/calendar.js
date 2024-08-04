import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("http://localhost:4000/events");
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={events.map(event => ({
        title: event.title,
        start: event.date,
        description: event.description,
        allDay: true,
      }))}
    />
  );
}