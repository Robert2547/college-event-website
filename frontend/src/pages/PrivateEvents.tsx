import React, { useEffect, useState } from 'react';
import { eventApi } from '../api/event';
import EventCard from '../components/EventCard';
import { Event } from '../types/event';

const PrivateEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventApi.getPrivateEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch private events', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Private Events</h1>
      {events.length === 0 ? (
        <p>No private events found.</p>
      ) : (
        events.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </div>
  );
};

export default PrivateEvents;
