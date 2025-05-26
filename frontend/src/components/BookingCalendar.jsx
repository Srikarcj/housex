import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const BookingCalendar = ({ bookings, onEventClick }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const formattedEvents = bookings.map(booking => ({
      id: booking._id,
      title: `${booking.serviceType} - ${booking.clientName}`,
      start: new Date(`${booking.date}T${booking.time}`),
      end: new Date(`${booking.date}T${booking.time}`),
      resource: booking
    }));
    setEvents(formattedEvents);
  }, [bookings]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#e2e8f0'; // default gray
    let borderColor = '#cbd5e0';

    switch (event.resource.status) {
      case 'pending':
        backgroundColor = '#fef3c7';
        borderColor = '#fbbf24';
        break;
      case 'accepted':
        backgroundColor = '#dcfce7';
        borderColor = '#34d399';
        break;
      case 'in_progress':
        backgroundColor = '#dbeafe';
        borderColor = '#60a5fa';
        break;
      case 'completed':
        backgroundColor = '#e9d5ff';
        borderColor = '#a78bfa';
        break;
      case 'cancelled':
        backgroundColor = '#fee2e2';
        borderColor = '#f87171';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: '#1f2937',
        border: '1px solid',
        display: 'block'
      }
    };
  };

  return (
    <div className="h-[800px] bg-white rounded-lg shadow-md p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={event => onEventClick(event.resource)}
        views={['month', 'week', 'day']}
        defaultView="month"
        popup
        selectable
        toolbar={true}
      />
    </div>
  );
};

export default BookingCalendar; 