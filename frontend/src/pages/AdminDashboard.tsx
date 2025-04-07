import React, { useState, useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { rsoApi } from "../api/rso";
import { eventApi } from "../api/event";
import { Rso, RsoRequest } from "../types/rso";
import { Event, EventCreateRequest, EventUpdateRequest } from "../types/event";
import toast from "react-hot-toast";
import EventsTab from "../components/admin/EventsTab";
import RsosTab from "../components/admin/RsosTab";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("events");
  const [rsos, setRsos] = useState<Rso[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState({ rsos: false, events: false });

  // Fetch data on component mount
  useEffect(() => {
    fetchRsos();
    fetchEvents();
  }, []);

  // Data fetching functions
  const fetchRsos = async () => {
    setLoading((prev) => ({ ...prev, rsos: true }));
    try {
      const data = await rsoApi.getMyRsos();
      setRsos(data);
    } catch (error) {
      console.error("Error fetching RSOs:", error);
      toast.error("Failed to load your RSOs");
    } finally {
      setLoading((prev) => ({ ...prev, rsos: false }));
    }
  };

  const fetchEvents = async () => {
    setLoading((prev) => ({ ...prev, events: true }));
    try {
      const data = await eventApi.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading((prev) => ({ ...prev, events: false }));
    }
  };

  // API Operations - RSOs
  const handleRsoCreate = async (formData: RsoRequest) => {
    try {
      const newRso = await rsoApi.createRso(formData);
      setRsos([...rsos, newRso]);
      toast.success("RSO created successfully");
      return true;
    } catch (error) {
      toast.error("Failed to create RSO");
      return false;
    }
  };

  const handleRsoUpdate = async (id: number, formData: RsoRequest) => {
    try {
      const updatedRso = await rsoApi.updateRso(id, formData);
      setRsos(rsos.map((rso) => (rso.id === id ? updatedRso : rso)));
      toast.success("RSO updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update RSO");
      return false;
    }
  };

  const handleRsoDelete = async (id: number) => {
    try {
      await rsoApi.deleteRso(id);
      setRsos(rsos.filter((rso) => rso.id !== id));
      toast.success("RSO deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete RSO");
      return false;
    }
  };

  // API Operations - Events
  const handleEventCreate = async (formData: EventCreateRequest) => {
    try {
      let newEvent;
      if (formData.eventType === "RSO" && formData.rsoId) {
        newEvent = await eventApi.createRsoEvent(formData.rsoId, formData);
      } else {
        newEvent = await eventApi.createEvent(formData);
      }
      setEvents([...events, newEvent]);
      toast.success("Event created successfully");
      return true;
    } catch (error) {
      toast.error("Failed to create event");
      return false;
    }
  };

  const handleEventUpdate = async (
    id: number,
    formData: EventUpdateRequest
  ) => {
    try {
      const updatedEvent = await eventApi.updateEvent(id, formData);
      setEvents(
        events.map((event) => (event.id === id ? updatedEvent : event))
      );
      toast.success("Event updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update event");
      return false;
    }
  };

  const handleEventDelete = async (id: number) => {
    try {
      await eventApi.deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id));
      toast.success("Event deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete event");
      return false;
    }
  };

  // Tab navigation
  const tabs = [
    { id: "events", label: "Events" },
    { id: "rsos", label: "Student Organizations (RSOs)" },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your RSOs and events
        </p>

        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "events" && (
          <EventsTab
            events={events}
            rsos={rsos}
            loading={loading.events}
            userId={user?.id || 1}
            onCreateEvent={handleEventCreate}
            onUpdateEvent={handleEventUpdate}
            onDeleteEvent={handleEventDelete}
          />
        )}

        {activeTab === "rsos" && (
          <RsosTab
            rsos={rsos}
            loading={loading.rsos}
            userId={user?.id || 1}
            onCreateRso={handleRsoCreate}
            onUpdateRso={handleRsoUpdate}
            onDeleteRso={handleRsoDelete}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
