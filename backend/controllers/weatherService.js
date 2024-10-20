const axios = require('axios');
const Alert = require('../models/Alert'); // Model for user thresholds
const Weather = require('../models/weather');
const Summary = require('../models/summary');
const Threshold = require('../models/threshold');
const { convertToCelsius } = require('../utils/temperatureConversion');


const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const fetchWeatherData = async () => {
    try {
        const API_KEY = process.env.OPENWEATHER_API_KEY;
        const weatherData = await Promise.all(cities.map(async (city) => {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
            );
            const { main, weather, dt } = response.data;

            const tempInCelsius = convertToCelsius(main.temp);
            const feelsLikeCelsius = convertToCelsius(main.feels_like);

            return {
                city,
                mainCondition: weather[0].main,
                temp: tempInCelsius,
                feels_like: feelsLikeCelsius,
                time: dt,
            };
        }));

        // Store data in database
        weatherData.forEach(async (data) => {
            const weatherEntry = new Weather({
                city: data.city,
                mainCondition: data.mainCondition,
                temp: data.temp,
                feels_like: data.feels_like,
                timestamp: data.time,
            });
            await weatherEntry.save();
        });
        await checkAlertThresholds(weatherData);
        await calculateDailySummary();
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};


// Helper function to determine the dominant weather condition
const getDominantCondition = (conditions) => {
    const conditionFrequency = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});
    return Object.keys(conditionFrequency).reduce((a, b) => conditionFrequency[a] > conditionFrequency[b] ? a : b);
};

// Function to calculate daily summaries
const calculateDailySummary = async () => {
    try {
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)

        // Fetch weather records from the current day
        const weatherRecords = await Weather.find({ createdAt: { $gte: new Date(currentDate) } });

        if (weatherRecords.length === 0) return;

        // Aggregate data
        const avgTemp = weatherRecords.reduce((sum, record) => sum + record.temp, 0) / weatherRecords.length;
        const maxTemp = Math.max(...weatherRecords.map((record) => record.temp));
        const minTemp = Math.min(...weatherRecords.map((record) => record.temp));
        const dominantCondition = getDominantCondition(weatherRecords.map((record) => record.mainCondition));

        // Store summary in the database
        const summary = new Summary({
            date: currentDate,
            avgTemp,
            maxTemp,
            minTemp,
            dominantCondition,
        });
        await summary.save();

        console.log('Daily summary stored:', summary);
    } catch (error) {
        console.error('Error calculating daily summary:', error);
    }
};


// Function to check if any thresholds are breached and trigger alerts
const checkAlertThresholds = async (weatherData) => {
    try {
        // Fetch the threshold or provide default values if none exist
        let thresholds = await Threshold.findOne({});

        if (!thresholds) {
            // If no thresholds are found, set default values
            thresholds = new Threshold({
                tempThreshold: 35, // Default temperature threshold
                weatherCondition: 'Clear', // Default weather condition threshold
                alertSent: false,
            });
            await thresholds.save(); // Save the default thresholds
        }

        const alertsToSave = []; // Array to store alerts to save
        let anyAlertSent = false; // Flag to check if any alert has been sent

        for (const data of weatherData) {
            const alertTimestamp = data.timestamp || Date.now(); // Use current time if timestamp is not provided

            // Log the city and data being processed
            console.log(`Checking ${data.city}: Temperature: ${data.temp}, Condition: ${data.mainCondition}`);

            // Check if the alert condition is met
            if ((data.temp > thresholds.tempThreshold || data.mainCondition === thresholds.weatherCondition)) {
                // Log the alert message
                console.log(`ALERT: ${data.city} exceeded threshold! Temperature: ${data.temp}, Condition: ${data.mainCondition}`);

                // Create a new alert document with the required fields
                const alert = new Alert({
                    city: data.city,
                    mainCondition: data.mainCondition,
                    temp: data.temp,
                    timestamp: alertTimestamp, // Use the alertTimestamp
                });

                alertsToSave.push(alert); // Add to alerts to save
                anyAlertSent = true; // Set flag to true if at least one alert is sent
            }
        }

        // Save all alerts at once if there are any to save
        if (alertsToSave.length > 0) {
            await Alert.insertMany(alertsToSave); // Save all alerts in a single operation
            console.log(`Saved ${alertsToSave.length} alerts to the database.`);
        }

        // Update the alertSent status based on whether any alerts were triggered
        thresholds.alertSent = anyAlertSent;
        await thresholds.save(); // Save updated threshold status

    } catch (error) {
        console.error('Error in checkAlertThresholds:', error);
    }
};









module.exports = { fetchWeatherData };
