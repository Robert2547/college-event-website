import React, { useState, useEffect } from "react";
import { EventCreateRequest } from "../../types/event";
import { Rso } from "../../types/rso";
import { rsoApi } from "../../api/rso";
import LocationSelector from "./LocationSelector";

interface EventFormProps {
  initialData: EventCreateRequest;
  isEdit: boolean;
  onSubmit: (data: EventCreateRequest) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  isEdit,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EventCreateRequest>(initialData);
  const [rsos, setRsos] = useState<Rso[]>([]);

  // Load RSOs for dropdown if creating RSO event
  useEffect(() => {
    const fetchRsos = async () => {
      if (!isEdit && formData.eventType === "RSO") {
        try {
          const data = await rsoApi.getAllRsos();
          setRsos(data);
        } catch (error) {
          console.error("Error fetching RSOs:", error);
        }
      }
    };

    fetchRsos();
  }, [formData.eventType, isEdit]);

  // Update form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Generic change handler for input fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Special handling for eventType
    if (name === "eventType") {
      const newData = {
        ...formData,
        eventType: value as "PUBLIC" | "PRIVATE" | "RSO",
        // Clear rsoId if event type is not RSO
        rsoId: value === "RSO" ? formData.rsoId : undefined,
      };
      setFormData(newData);
      onSubmit(newData);
      return;
    }

    // Special handling for rsoId
    if (name === "rsoId") {
      const newData = {
        ...formData,
        rsoId: value ? Number(value) : undefined,
      };
      setFormData(newData);
      onSubmit(newData);
      return;
    }

    // Default handling
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onSubmit(newData);
  };

  // Location change handler
  const handleLocationChange = (locationId: number) => {
    const newData = { ...formData, locationId };
    setFormData(newData);
    onSubmit(newData);
  };

  return (
    <div className="space-y-4">
      {/* Name and Description */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Event Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Location */}
      <LocationSelector
        selectedLocationId={formData.locationId}
        onChange={handleLocationChange}
      />

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contactPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Phone
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="contactEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Event Type and RSO Selection (only for new events) */}
      {!isEdit && (
        <>
          <div>
            <label
              htmlFor="eventType"
              className="block text-sm font-medium text-gray-700"
            >
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
              <option value="RSO">RSO</option>
            </select>
          </div>

          {/* RSO Selection (only shown if event type is RSO) */}
          {formData.eventType === "RSO" && (
            <div>
              <label
                htmlFor="rsoId"
                className="block text-sm font-medium text-gray-700"
              >
                Select RSO
              </label>
              <select
                id="rsoId"
                name="rsoId"
                value={formData.rsoId || ""}
                onChange={handleChange}
                required={formData.eventType === "RSO"}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select an RSO</option>
                {rsos.map((rso) => (
                  <option key={rso.id} value={rso.id}>
                    {rso.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventForm;
