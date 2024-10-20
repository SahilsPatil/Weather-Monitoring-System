const express = require('express');
const router = express.Router();
const { fetchWeatherData } = require('../controllers/weatherService');
const Threshold = require('../models/threshold');
const Weather = require('../models/weather');
const Summary = require('../models/summary');
const Alert = require('../models/Alert');



// Endpoint to set alert thresholds
router.post('/set-threshold', async (req, res) => {
    const { tempThreshold, weatherCondition } = req.body;
    const alertSent = false; // Always set this to false for the update

    try {
        let threshold = await Threshold.findOne({});
        console.log('Current Threshold:', threshold); // Log current threshold

        if (!threshold) {
            // Create a new threshold document if it doesn't exist
            threshold = new Threshold({ tempThreshold, weatherCondition, alertSent });
        } else {
            // Update existing threshold
            threshold.tempThreshold = tempThreshold || threshold.tempThreshold;
            threshold.weatherCondition = weatherCondition || threshold.weatherCondition;
            threshold.alertSent = alertSent; // Always set alertSent to false
        }

        const savedThreshold = await threshold.save(); // Save the updated threshold
        console.log('Saved Threshold:', savedThreshold); // Log saved threshold
        res.json({ success: true, message: 'Threshold updated successfully', threshold: savedThreshold });
    } catch (error) {
        console.error('Error updating threshold:', error); // Log the error
        res.status(500).json({ success: false, message: 'Error updating threshold', error });
    }
});


// Add this to your routes (e.g., weatherRoutes.js)
router.post('/initialize-thresholds', async (req, res) => {
    try {
        const existingThreshold = await Threshold.findOne({});
        if (!existingThreshold) {
            const defaultThreshold = new Threshold({
                tempThreshold: 35, // Default temperature threshold
                weatherCondition: 'Clear', // Default weather condition threshold
            });
            await defaultThreshold.save();
            res.json({ message: 'Default thresholds initialized successfully' });
        } else {
            res.json({ message: 'Thresholds already exist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error initializing thresholds', error });
    }
});

// Endpoint to trigger weather data fetch
router.get('/fetch', async (req, res) => {
    try {
        const data = await fetchWeatherData();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching weather data', error });
    }
});

router.get('/daily-summary', async (req, res) => {
    try {
        const dailySummary = await Summary.findOne().sort({ date: -1 }); // Get the latest summary
        res.json({ success: true, data: dailySummary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching daily summary', error });
    }
});

// Endpoint to fetch triggered alerts
router.get('/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 }).limit(6);
        res.json({ success: true, data: alerts });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ success: false, message: 'Error fetching alerts', error });
    }
});

module.exports = router;
