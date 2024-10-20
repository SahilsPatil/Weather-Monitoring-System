module.exports = {
  temperatureThreshold: {
      high: 35, // in Celsius
      low: 5   // in Celsius
  },
  weatherConditionThreshold: ['Rain', 'Thunderstorm'],
  windSpeedThreshold: 15, // meters/second
  alertInterval: 3 // Number of consecutive updates needed to trigger an alert
};
