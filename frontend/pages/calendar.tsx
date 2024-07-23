import React from 'react';
import dynamic from 'next/dynamic';

const CalendarPage = dynamic(() => import('@/app/calendar/Calendar'), { ssr: false });

const Calendar: React.FC = () => {
  return (
    <div>
      <CalendarPage />
    </div>
  );
};

export default Calendar;
