import React, { useState, useEffect } from "react";
import { createLocation } from "../api/location";
import toast from "react-hot-toast";
import { EventCreateRequest, EventType } from "../types/event";
import MapPicker, { SelectedLocation } from "../components/MapPicker";
import { eventApi } from "../api/event";
import { useColleges, useRsos } from "../hooks/useDataFetching";

const CreateEventForm: React.FC = () => {
  const stored = localStorage.getItem("auth-storage");
  const user = stored ? JSON.parse(stored)?.state?.user : null;

  const { colleges, loading: collegesLoading } = useColleges();

  const initialFormData: EventCreateRequest = {
    name: "",
    description: "",
    date: "",
    time: "",
    eventType: "PUBLIC",
    locationId: 1,
    contactEmail: "",
    contactPhone: "",
    rsoId: undefined,
    collegeId:
      user?.college?.id || (colleges.length > 0 ? colleges[0].id : undefined),
  };

  const [formData, setFormData] = useState<EventCreateRequest>(initialFormData);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  // Update collegeId when colleges are loaded
  useEffect(() => {
    if (colleges.length > 0 && !formData.collegeId) {
      setFormData((prev) => ({
        ...prev,
        collegeId: user?.college?.id || colleges[0].id,
      }));
    }
  }, [colleges, user]);

  const { rsos, loading: rsosLoading } = useRsos(formData.eventType === "RSO");

  // Update rsoId when RSOs are loaded for RSO events
  useEffect(() => {
    if (formData.eventType === "RSO" && rsos.length > 0 && !formData.rsoId) {
      setFormData((prev) => ({
        ...prev,
        rsoId: rsos[0].id,
      }));
    }
  }, [rsos, formData.eventType]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Special handling for event type and RSO
    if (name === "eventType") {
      setFormData((prev) => ({
        ...prev,
        eventType: value as EventType,
        rsoId: value === "RSO" ? undefined : prev.rsoId,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "rsoId" && value ? parseInt(value as string) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedLocation ||
      !selectedLocation.name ||
      !selectedLocation.address
    ) {
      toast.error("Please select a location and fill in name/address");
      return;
    }

    try {
      const newLocation = await createLocation({
        name: selectedLocation.name,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        address: selectedLocation.address,
      });

      const eventToCreate = {
        ...formData,
        locationId: newLocation.id,
      };

      await eventApi.createEvent(eventToCreate);
      toast.success("Event created!");

      // Reset form, keeping collegeId
      setFormData({
        ...initialFormData,
        collegeId: formData.collegeId,
      });
      setSelectedLocation(null);
    } catch (err) {
      toast.error("Error creating event");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl space-y-6"
    >
      <h1 className="text-3xl font-semibold text-gray-800">Create Event</h1>

      {/* Location Picker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Location on Map
          </label>
          <MapPicker onSelect={setSelectedLocation} />
        </div>

        {selectedLocation && (
          <>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name
              </label>
              <input
                type="text"
                value={selectedLocation.name}
                onChange={(e) =>
                  setSelectedLocation((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Address
              </label>
              <input
                type="text"
                value={selectedLocation.address}
                onChange={(e) =>
                  setSelectedLocation((prev) =>
                    prev ? { ...prev, address: e.target.value } : null
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Event Name"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="RSO">RSO</option>
          </select>
        </div>

        {/* RSO Selection - Only show when event type is RSO */}
        {formData.eventType === "RSO" && (
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RSO
            </label>
            {rsosLoading ? (
              <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm">
                Loading RSOs...
              </div>
            ) : rsos.length === 0 ? (
              <div className="mt-1 block w-full py-2 px-3 border border-red-300 bg-red-50 rounded-md shadow-sm text-red-500">
                No RSOs available. Please create an RSO first.
              </div>
            ) : (
              <select
                name="rsoId"
                value={formData.rsoId || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select an RSO</option>
                {rsos.map((rso) => (
                  <option key={rso.id} value={rso.id}>
                    {rso.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="Describe the event..."
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Contact Phone"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded shadow-sm"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
