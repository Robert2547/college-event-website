import React, { useEffect, useState } from 'react';
import { eventApi } from '../api/event';
import EventCard from '../components/EventCard';
import { Event } from '../types/event';

const PublicEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventApi.getPublicEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch public events', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Public Events</h1>
      {events.length === 0 ? (
        <p>No public events found.</p>
      ) : (
        events.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </div>
  );
};

export default PublicEvents;
