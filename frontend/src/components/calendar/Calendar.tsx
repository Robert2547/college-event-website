import React, { useEffect, useState } from "react";
import { Event } from "../../types/event";
import { eventApi } from "../../api/event";
import { rsoApi } from "../../api/rso";
import { useAuthStore } from "../../hooks/useAuthStore";
import EventCard from "../EventCard";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import EventDetailModal from "./EventDetailModal";

// Types
interface CalendarDay {
  date: Date;
  events: Event[];
}

const Calendar = () => {
  const { user } = useAuthStore();
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventRating, setEventRating] = useState<any>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch events effect
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [publicEvents, privateEvents] = await Promise.all([
          eventApi.getPublicEvents(),
          eventApi.getPrivateEvents(),
        ]);

        // Get RSO events if user is a member
        const rsoEvents: Event[] = [];
        const rsos = await rsoApi.getAllRsos();

        for (const rso of rsos) {
          const members = await rsoApi.getRsoMembers(rso.id);
          if (members.some((m) => m.user.id === user?.id)) {
            const rsoE = await eventApi.getRsoEvents(rso.id);
            rsoEvents.push(...rsoE);
          }
        }

        const allEvents = [...publicEvents, ...privateEvents, ...rsoEvents];
        buildCalendar(allEvents);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
  }, [user, currentDate]);

  // Fetch rating when event selected
  useEffect(() => {
    const fetchEventRating = async () => {
      if (selectedEvent) {
        try {
          const rating = await eventApi.getEventRating(selectedEvent.id);
          setEventRating(rating);
        } catch (error) {
          console.error("Failed to fetch event rating", error);
          setEventRating(null);
        }
      }
    };

    fetchEventRating();
  }, [selectedEvent]);

  // Build calendar grid
  const buildCalendar = (events: Event[]) => {
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const days: CalendarDay[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split("T")[0];
      const dayEvents = events.filter((event) => event.date === dateString);
      days.push({ date: new Date(d), events: dayEvents });
    }

    setCalendarDays(days);
  };

  // Event handlers
  const handleMouseEnter = (event: Event, e: React.MouseEvent) => {
    setHoveredEvent(event);
    setPosition({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  const handleMouseLeave = () => {
    setHoveredEvent(null);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setEventRating(null);
  };

  const handleRateEvent = async (eventId: number, rating: number) => {
    await eventApi.rateEvent(eventId, rating);
    // Refresh the rating after submission
    const updatedRating = await eventApi.getEventRating(eventId);
    setEventRating(updatedRating);
  };

  // Helper to generate day header labels
  const renderDayHeaders = () => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center py-2 font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          className="text-gray-600 hover:text-gray-800 px-2 text-xl focus:outline-none"
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
        >
          ◀
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          className="text-gray-600 hover:text-gray-800 px-2 text-xl focus:outline-none"
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
        >
          ▶
        </button>
      </div>

      {/* Day headers */}
      {renderDayHeaders()}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 border-t border-l rounded-lg overflow-hidden">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className="min-h-24 bg-white border-r border-b p-1 relative"
          >
            <div className="text-xs text-gray-500 mb-1">
              {day.date.getDate()}
            </div>
            <div className="space-y-1 overflow-y-auto max-h-20 pr-1">
              {day.events.map((event) => (
                <div
                  key={event.id}
                  className="text-xs bg-blue-100 rounded px-2 py-1 flex justify-between hover:bg-blue-200 cursor-pointer transition-colors"
                  onMouseEnter={(e) => handleMouseEnter(event, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleEventClick(event)}
                >
                  <span className="truncate flex-1">{event.name}</span>

                  {/* Show comment count and rating indicators if available */}
                  {(event.commentCount !== undefined ||
                    event.averageRating !== undefined) && (
                    <div className="flex items-center space-x-1">
                      {event.commentCount !== undefined &&
                        event.commentCount > 0 && (
                          <span className="text-xs bg-gray-200 rounded-full px-1">
                            {event.commentCount}
                          </span>
                        )}
                      {event.averageRating !== undefined &&
                        event.averageRating > 0 && (
                          <span className="text-xs bg-yellow-100 rounded-full px-1 flex items-center">
                            <Star className="h-2 w-2 fill-yellow-400 text-yellow-400 mr-0.5" />
                            {event.averageRating.toFixed(1)}
                          </span>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hover preview */}
      {hoveredEvent && (
        <div
          className="absolute z-40"
          style={{ top: position.y, left: position.x }}
        >
          <div className="w-72">
            <EventCard event={hoveredEvent} />
          </div>
        </div>
      )}

      {/* Event detail modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onRate={handleRateEvent}
          eventRating={eventRating}
        />
      )}
    </div>
  );
};

export default Calendar;
