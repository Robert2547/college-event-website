import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

export interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
  name: string;
}

interface Props {
  onSelect: (location: SelectedLocation) => void;
}

const MapClickHandler: React.FC<Props> = ({ onSelect }) => {
  useMapEvents({
    click: async (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      const {
        house_number,
        road,
        city,
        town,
        village,
        state,
        postcode,
        country,
      } = data.address || {};

      const name = data.name || road || 'Selected Location';
      const locality = city || town || village || '';

      const address = [house_number, road, locality, state, postcode]
        .filter(Boolean)
        .join(', ');

      onSelect({ lat, lng, name, address });

    },
  });

  return null;
};

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapPicker: React.FC<Props> = ({ onSelect }) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );

  const handleSelect = (location: SelectedLocation) => {
    setMarkerPosition([location.lat, location.lng]);
    onSelect(location);
  };

  return (
    <div className='h-64 w-full rounded border mt-2'>
      <MapContainer
        center={[28.6024, -81.2001]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onSelect={handleSelect} />
        {markerPosition && (
          <Marker position={markerPosition} icon={markerIcon} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
