import React, { useState } from "react";
import Card from "../Card";
import Modal from "../Modal";
import EventForm from "./EventForm";
import {
  Event,
  EventCreateRequest,
  EventUpdateRequest,
} from "../../types/event";
import { Rso } from "../../types/rso";

interface EventsTabProps {
  events: Event[];
  rsos: Rso[];
  loading: boolean;
  userId: number;
  onCreateEvent: (formData: EventCreateRequest) => Promise<boolean>;
  onUpdateEvent: (id: number, formData: EventUpdateRequest) => Promise<boolean>;
  onDeleteEvent: (id: number) => Promise<boolean>;
}

const EventsTab: React.FC<EventsTabProps> = ({
  events,
  rsos,
  loading,
  userId,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  // Modal state
  const [modal, setModal] = useState<{
    show: boolean;
    type: "add" | "edit" | "delete";
    event: Event | null;
  }>({
    show: false,
    type: "add",
    event: null,
  });

  const [formData, setFormData] = useState<EventCreateRequest>({
    name: "",
    description: "",
    date: "",
    time: "",
    locationId: 0,
    contactPhone: "",
    contactEmail: "",
    collegeId: userId,
    eventType: "RSO",
    rsoId: undefined,
  });

  // Modal handlers
  const openModal = (type: "add" | "edit" | "delete", event?: Event) => {
    if (type === "add") {
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        locationId: 0,
        contactPhone: "",
        contactEmail: "",
        collegeId: userId,
        eventType: "RSO",
        rsoId: undefined,
      });
    } else if (type === "edit" && event) {
      setFormData({
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        locationId: event.location.id,
        contactPhone: event.contactPhone || "",
        contactEmail: event.contactEmail || "",
        collegeId: typeof event.college === "number" ? event.college : userId,
        eventType: event.eventType,
        rsoId: event.rsoId,
      });
    }

    setModal({
      show: true,
      type,
      event: event || null,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  // Form handlers
  const handleSubmit = async () => {
    let success = false;

    if (modal.type === "add") {
      success = await onCreateEvent(formData);
    } else if (modal.type === "edit" && modal.event) {
      success = await onUpdateEvent(modal.event.id, formData);
    } else if (modal.type === "delete" && modal.event) {
      success = await onDeleteEvent(modal.event.id);
    }

    if (success) {
      closeModal();
    }
  };

  // Content Rendering
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">Loading events...</p>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">
            No events found. Create your first event!
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {event.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.description}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">{event.time}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {event.location.name}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {event.eventType}
                  </span>
                  {event.eventType === "RSO" && event.rsoId && (
                    <div className="text-sm text-gray-500 mt-1">
                      {rsos.find((r) => r.id === event.rsoId)?.name ||
                        "Unknown RSO"}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => openModal("edit", event)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openModal("delete", event)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mt-6">
      <Card
        title="Your Events"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => openModal("add")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Event
            </button>
          </div>
        }
      >
        {renderContent()}
      </Card>

      {/* Add/Edit Event Modal */}
      <Modal
        isOpen={modal.show && (modal.type === "add" || modal.type === "edit")}
        title={modal.type === "add" ? "Create New Event" : "Edit Event"}
        onClose={closeModal}
        onConfirm={handleSubmit}
        confirmText={modal.type === "add" ? "Create Event" : "Update Event"}
      >
        <div className="p-4">
          <EventForm
            initialData={formData}
            isEdit={modal.type === "edit"}
            onSubmit={setFormData}
          />
        </div>
      </Modal>

      {/* Delete Event Confirmation Modal */}
      <Modal
        isOpen={modal.show && modal.type === "delete"}
        title="Delete Event"
        onClose={closeModal}
        onConfirm={handleSubmit}
        confirmText="Delete Event"
      >
        <div className="p-4 bg-red-50">
          <p className="text-sm text-red-600">
            Are you sure you want to delete {modal.event?.name}? This action
            cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default EventsTab;
