const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    avgTemp: { type: Number, required: true },
    maxTemp: { type: Number, required: true },
    minTemp: { type: Number, required: true },
    dominantCondition: { type: String, required: true },
}, { timestamps: true });

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
