import React, { useEffect, useState } from "react";
import { Location } from "../../types/location";
import { locationApi } from "../../api/locaction";
import toast from "react-hot-toast";

interface LocationSelectorProps {
  selectedLocationId: number;
  onChange: (locationId: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocationId,
  onChange,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await locationApi.getAllLocations();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="locationId"
        className="block text-sm font-medium text-gray-700"
      >
        Location
      </label>
      {loading ? (
        <div className="mt-1 block w-full p-2 text-gray-500">
          Loading locations...
        </div>
      ) : locations.length === 0 ? (
        <div className="mt-1 block w-full p-2 text-yellow-500">
          No locations available. Please create a location first.
        </div>
      ) : (
        <select
          id="locationId"
          name="locationId"
          value={selectedLocationId}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value={0}>Select a location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name} - {location.address}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default LocationSelector;
