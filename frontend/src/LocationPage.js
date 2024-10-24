import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import './LocationPage.css';

// Function to update the map view
function MapUpdater({ bounds }) {
  const map = useMap();
  if (bounds) {
    map.fitBounds(bounds);  // Adjust map to fit the bounds of the route
  }
  return null;
}

function LocationPage() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [route, setRoute] = useState(null);
  const [bounds, setBounds] = useState(null);

  // Fetch coordinates from API
  const fetchCoordinates = async (location) => {
    try {
      const response = await axios.post('http://localhost:5000/api/location', { location });
      return response.data;  // Ensure response contains { lat, lng } correctly
    } catch (error) {
      alert(`Error finding location: ${location}`);
      return null;
    }
  };

  // Fetch route from OSRM API
  const fetchRoute = async (startCoords, endCoords) => {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?geometries=geojson`;
    try {
      const response = await axios.get(osrmUrl);
      const coordinates = response.data.routes[0].geometry.coordinates;
      // Convert [lng, lat] to [lat, lng] format for Leaflet Polyline
      const path = coordinates.map(coord => [coord[1], coord[0]]);
      setRoute(path);
      // Set bounds to fit both start and end markers along with the route
      setBounds([[startCoords.lat, startCoords.lng], [endCoords.lat, endCoords.lng]]);
    } catch (error) {
      alert('Error fetching route');
    }
  };

  // Handle route calculation
  const handleCalculateRoute = async () => {
    if (!startLocation || !endLocation) return;

    const startCoordinates = await fetchCoordinates(startLocation);
    const endCoordinates = await fetchCoordinates(endLocation);

    if (startCoordinates && endCoordinates) {
      setStartMarker(startCoordinates);
      setEndMarker(endCoordinates);
      // Fetch and set the route
      await fetchRoute(startCoordinates, endCoordinates);
    }
  };

  // Swap locations
  const handleSwap = () => {
    setStartLocation(endLocation);
    setEndLocation(startLocation);
  };

  // Custom Leaflet icons for start and end markers
  const startIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Blue marker icon URL
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const endIcon = new L.Icon({
    iconUrl: 'https://i.pinimg.com/originals/fc/48/7b/fc487b390a02aa1e82be4c32dd53b0ab.jpg', // Red marker icon URL (ensure it's without a dot)
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="location-page">
      <div className="search-form">
        <input
          type="text"
          placeholder="Starting location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />
        <button onClick={handleSwap}>Swap</button>
        <input
          type="text"
          placeholder="Ending location"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        />
        <button onClick={handleCalculateRoute}>Calculate Route</button>
      </div>

      <MapContainer center={[51.505, -0.09]} zoom={5} className="leaflet-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {startMarker && (
          <>
            <MapUpdater bounds={bounds} />
            <Marker position={[startMarker.lat, startMarker.lng]} icon={startIcon}></Marker>
          </>
        )}
        {endMarker && (
          <Marker position={[endMarker.lat, endMarker.lng]} icon={endIcon}></Marker>
        )}
        {route && (
          <Polyline positions={route} color="blue" />
        )}
      </MapContainer>
    </div>
  );
}

export default LocationPage;
