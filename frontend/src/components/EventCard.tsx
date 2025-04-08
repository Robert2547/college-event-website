import React from 'react';
import { Event } from '../types/event';

interface Props {
  event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => {
  return (
    <div className='border rounded-xl shadow-md p-4 mb-4 bg-white'>
      <h2 className='text-xl font-bold'>{event.name}</h2>
      <p className='text-sm text-gray-600'>{event.description}</p>
      <p className='text-sm mt-2'>
        📅 {event.date} @ 🕒 {event.time}
      </p>
      <p className='text-sm text-gray-500 mt-1'>Type: {event.eventType}</p>
      <p className='text-sm text-gray-500'>
        Contact: {event.contactEmail || 'N/A'}
      </p>
    </div>
  );
};

export default EventCard;
