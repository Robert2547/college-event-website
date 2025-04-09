import React, { useEffect, useState } from "react";
import { Event } from "../types/event";
import { eventApi } from "../api/event";
import { rsoApi } from "../api/rso";
import { useAuthStore } from "../hooks/useAuthStore";
import EventCard from "./EventCard";

interface CalendarDay {
  date: Date;
  events: Event[];
}

const Calendar: React.FC = () => {
  const { user } = useAuthStore();
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [publicEvents, privateEvents] = await Promise.all([
          eventApi.getPublicEvents(),
          eventApi.getPrivateEvents(),
        ]);

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
  }, [user, currentDate]); // 🧠 depends on currentDate now

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

  const handleMouseEnter = (event: Event, e: React.MouseEvent) => {
    setHoveredEvent(event);
    setPosition({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  const handleMouseLeave = () => {
    setHoveredEvent(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          className="text-gray-600 hover:text-gray-800 px-2 text-xl"
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
        >
          ◀
        </button>

        <h2 className="text-2xl font-semibold text-gray-800">
          {currentDate.toLocaleString("default", { month: "long" })}'s Events
        </h2>

        <button
          className="text-gray-600 hover:text-gray-800 px-2 text-xl"
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
        >
          ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 border rounded-lg overflow-hidden">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className="h-28 bg-white border p-1 relative overflow-hidden"
          >
            <div className="text-xs text-gray-500">{day.date.getDate()}</div>
            <div className="space-y-1 mt-1 overflow-y-auto max-h-20 pr-1">
              {day.events.map((event) => (
                <div
                  key={event.id}
                  className="text-xs bg-blue-100 rounded px-1 truncate hover:bg-blue-200 cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(event, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {event.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hoveredEvent && (
        <div
          className="absolute z-50"
          style={{ top: position.y, left: position.x }}
        >
          <div className="w-72">
            <EventCard event={hoveredEvent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
