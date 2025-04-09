import React from "react";
import { Event } from "../types/event";

interface Props {
  event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => {
  return (
    <div className="border rounded-xl shadow-md p-4 mb-4 bg-white">
      <h2 className="text-xl font-bold text-left">{event.name}</h2>
      <p className="text-sm text-gray-600 text-left">{event.description}</p>
      <p className="text-sm mt-2 text-left">
        📅 {event.date} @ 🕒 {event.time}
      </p>
      <p className="text-sm text-gray-500 mt-1 text-left">
        Type: {event.eventType}
      </p>
      <p className="text-sm text-gray-500 text-left">
        Contact: {event.contactEmail || "N/A"}
      </p>
    </div>
  );
};

export default EventCard;
