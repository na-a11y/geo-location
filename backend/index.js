const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // To load environment variables from .env file

const app = express();

// Middleware to parse JSON and enable CORS
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// POST route to fetch coordinates for a location (city or country)
app.post('/api/location', async (req, res) => {
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    // Use OpenCageData API to fetch coordinates
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${process.env.OPENCAGE_API_KEY}`
    );

    const data = response.data;

    // If no results are found, send an error response
    if (data.results.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Extract the coordinates (latitude and longitude)
    const coordinates = data.results[0].geometry;
    
    // Return the coordinates as a JSON response
    res.json(coordinates);
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
