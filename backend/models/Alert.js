const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    city: { type: String, required: true },
    mainCondition: { type: String, required: true },
    temp: { type: Number, required: true },
    timestamp: { type: Number, required: true }, // Unix timestamp for the alert
    alertSent: { type: Boolean, default: true }, // Indicates whether the alert was sent
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
