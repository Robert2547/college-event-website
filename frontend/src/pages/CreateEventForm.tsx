import React, { useState } from 'react';
import { createEvent } from '../api/event';
import { createLocation } from '../api/location';
import toast from 'react-hot-toast';
import { EventCreateRequest } from '../types/event';
import MapPicker, { SelectedLocation } from '../components/MapPicker';

const CreateEventForm: React.FC = () => {
  const initialFormData: EventCreateRequest = {
    name: '',
    description: '',
    date: '',
    time: '',
    eventType: 'PUBLIC',
    locationId: 1,
    contactEmail: '',
    contactPhone: '',
    rsoId: null,
  };

  const [formData, setFormData] = useState<EventCreateRequest>(initialFormData);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rsoId' && value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        !selectedLocation ||
        !selectedLocation.name ||
        !selectedLocation.address
      ) {
        toast.error('Please select a location and fill in name/address.');
        return;
      }

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

      await createEvent(eventToCreate);
      toast.success('Event created!');

      setFormData(initialFormData);
      setSelectedLocation(null);
    } catch (err) {
      toast.error('Error creating event');
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl space-y-6'
    >
      <h1 className='text-3xl font-semibold text-gray-800'>Create Event</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Select Location on Map
          </label>
          <MapPicker onSelect={setSelectedLocation} />
        </div>

        {selectedLocation && (
          <>
            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Location Name
              </label>
              <input
                type='text'
                value={selectedLocation.name}
                onChange={(e) =>
                  setSelectedLocation((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className='w-full border p-2 rounded'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Location Address
              </label>
              <input
                type='text'
                value={selectedLocation.address}
                onChange={(e) =>
                  setSelectedLocation((prev) =>
                    prev ? { ...prev, address: e.target.value } : null
                  )
                }
                className='w-full border p-2 rounded'
              />
            </div>
          </>
        )}
        <div className='col-span-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Event Name
          </label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Event Name'
            className='w-full border p-2 rounded'
            required
          />
        </div>

        <div className='col-span-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Event Type
          </label>
          <select
            name='eventType'
            value={formData.eventType}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          >
            <option value='PUBLIC'>Public</option>
            <option value='PRIVATE'>Private</option>
            <option value='RSO'>RSO</option>
          </select>
        </div>

        {formData.eventType === 'RSO' && (
          <div className='col-span-1'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              RSO ID
            </label>
            <input
              type='number'
              name='rsoId'
              value={formData.rsoId || ''}
              onChange={handleChange}
              placeholder='RSO ID'
              className='w-full border p-2 rounded'
              required
            />
          </div>
        )}

        <div className='col-span-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Date
          </label>
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          />
        </div>

        <div className='col-span-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Time
          </label>
          <input
            type='time'
            name='time'
            value={formData.time}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            required
          />
        </div>

        <div className='col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Description
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='w-full border p-2 rounded'
            rows={3}
            placeholder='Describe the event...'
          />
        </div>

        <div className='col-span-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Contact Email
          </label>
          <input
            type='email'
            name='contactEmail'
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder='Contact Email'
            className='w-full border p-2 rounded'
          />
        </div>

        <div className='col-span-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Contact Phone
          </label>
          <input
            type='text'
            name='contactPhone'
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder='Contact Phone'
            className='w-full border p-2 rounded'
          />
        </div>
      </div>

      <div className='pt-4'>
        <button
          type='submit'
          className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded shadow-sm'
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
