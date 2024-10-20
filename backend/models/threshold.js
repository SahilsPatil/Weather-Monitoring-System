const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema({
    tempThreshold: { type: Number, default: 35 },
    weatherCondition: { type: String, default: '' },
    alertSent: { type: Boolean, default: false },
}, { timestamps: true });

const Threshold = mongoose.model('Threshold', thresholdSchema);

module.exports = Threshold;
