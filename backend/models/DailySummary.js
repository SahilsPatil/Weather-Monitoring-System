// const mongoose = require('mongoose');

// const dailySummarySchema = new mongoose.Schema({
//   date: { type: String, required: true },
//   avgTemp: { type: Number, required: true },
//   maxTemp: { type: Number, required: true },
//   minTemp: { type: Number, required: true },
//   dominantWeather: { type: String, required: true },
// });

// const DailySummary = mongoose.model('DailySummary', dailySummarySchema);

// module.exports = DailySummary;

const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  avgTemp: { type: Number, required: true },
  maxTemp: { type: Number, required: true },
  minTemp: { type: Number, required: true },
  dominantWeather: { type: String, required: true },
});

module.exports = mongoose.model('DailySummary', DailySummarySchema);
