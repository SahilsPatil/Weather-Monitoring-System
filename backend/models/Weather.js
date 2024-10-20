const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    city: { type: String, required: true },
    mainCondition: { type: String, required: true },
    temp: { type: Number, required: true },
    feels_like: { type: Number, required: true },
    timestamp: { type: Number, required: true }, // Unix timestamp
}, { timestamps: true });

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
