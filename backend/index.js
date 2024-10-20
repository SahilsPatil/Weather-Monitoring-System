const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const weatherRoutes = require('./routes/weatherRoutes');
const cron = require('node-cron');
const { fetchWeatherData, calculateDailySummary } = require('./controllers/weatherService');
const cors = require('cors');

// Initialize app
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/weatherDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/weather', weatherRoutes);

// Schedule weather data retrieval every 5 minutes
cron.schedule('*/5 * * * *', () => {
    console.log('Fetching weather data...');
    fetchWeatherData();
});
cron.schedule('0 0 * * *', () => {
    console.log('Running daily weather summary calculation...');
    calculateDailySummary();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
