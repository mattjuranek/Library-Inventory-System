import React, { useState } from 'react';
import Layout from '@/app/calendar/layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import { INITIAL_EVENTS, createEventId } from '@/utils/event-utils';

// https://github.com/fullcalendar/fullcalendar-examples/blob/main/next13/pages/calendar.js
// https://stackblitz.com/github/fullcalendar/fullcalendar-examples/tree/main/react?file=src%2Fevent-utils.js
export default function CalendarPage() {
  const [currentEvents, setCurrentEvents] = useState(INITIAL_EVENTS);
  const [weekendsVisible, setWeekendsVisible] = useState(true);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event');
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  return (
    <Layout>
      <div className='calendar-container'>
        <FullCalendar
          plugins={[resourceTimelinePlugin, dayGridPlugin, interactionPlugin, timeGridPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimelineWeek,dayGridMonth,timeGridWeek',
          }}
          initialView='resourceTimelineWeek'
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          weekends={weekendsVisible}
          initialEvents={currentEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          resources={[
            { id: 'a', title: 'Auditorium A' },
            { id: 'b', title: 'Auditorium B', eventColor: 'green' },
            { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
          ]}
        />
      </div>
    </Layout>
  );
}