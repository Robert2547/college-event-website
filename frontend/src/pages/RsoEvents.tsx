import React, { useEffect, useState } from 'react';
import { getRsoEvents } from '../api/event';
import EventCard from '../components/EventCard';
import { Event } from '../types/event';

const RsoEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const testRsoId = 1;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getRsoEvents(testRsoId);
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch RSO events', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>RSO Events</h1>
      {events.length === 0 ? (
        <p>No RSO events found.</p>
      ) : (
        events.map((event) => <EventCard key={event.eventId} event={event} />)
      )}
    </div>
  );
};

export default RsoEvents;
