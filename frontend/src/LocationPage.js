// LocationPage.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import './LocationPage.css'; 

function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, 10);
  return null;
}

function LocationPage() {
  const [location, setLocation] = useState('');
  const [marker, setMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location) return;

    try {
      const response = await axios.post('http://localhost:5000/api/location', { location });
      const coordinates = response.data;
      setMarker(coordinates);
      setMapCenter([coordinates.lat, coordinates.lng]);
    } catch (error) {
      alert('Error finding location.');
    }
  };

  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
  });

  return (
    <div className="location-page">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter city or country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <MapContainer center={mapCenter} zoom={5} className="leaflet-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker && (
          <>
            <MapUpdater center={[marker.lat, marker.lng]} />
            <Marker position={[marker.lat, marker.lng]} icon={customIcon}></Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default LocationPage;
