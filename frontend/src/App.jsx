import React, { useEffect, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempThreshold, settempThreshold] = useState(35);
  const [weatherCondition, setWeatherCondition] = useState('None');
  const myDate = new Date(); // convert timestamp to milliseconds and construct Date object



  const fetchWeatherData = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/weather/fetch');
    const data = await res.json();
    setWeatherData(data.data);
    setLoading(false);
    console.log(weatherData);

  };

  const fetchDailySummary = async () => {
    const res = await fetch('http://localhost:5000/api/weather/daily-summary');
    const data = await res.json();
    setSummary(data.data);
  };

  const fetchTriggeredAlerts = async () => {
    const res = await fetch('http://localhost:5000/api/weather/alerts');
    const data = await res.json();
    setAlerts(data.data);
    console.log(alerts);

  };

  const refreshData = () => {
    fetchWeatherData();
    fetchDailySummary();
    fetchTriggeredAlerts();
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/weather/initialize-thresholds', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('Default thresholds initialized.');
        }
      });

    refreshData();
    const interval = setInterval(() => {
      refreshData();
    }, 300000); // 300000 ms = 5 minutes
    const alertinterval = setInterval(() => {
      fetchTriggeredAlerts();
    }, 1000); // 300000 ms = 5 minutes

    return () => clearInterval(interval, alertinterval);
  }, []);

  const handleSetThreshold = async () => {
    console.log(tempThreshold);
    const res = await fetch('http://localhost:5000/api/weather/set-threshold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ tempThreshold, weatherCondition }),
    });
    const data = await res.json();
    if (data.success) {
      refreshData()
      alert('Threshold updated successfully!');
    } else {
      alert('Failed to update threshold.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Weather Monitoring System</h1>
        <button className="refresh-button" onClick={refreshData}>
          <FaSyncAlt /> Refresh
        </button>
      </header>
      <div className="threshold-container">
        <h2>Set Temperature Threshold</h2>
        <div className="threshold-input-container">
          <input
            type="number"
            defaultValue={tempThreshold}
            onChange={(e) => settempThreshold(e.target.value)}
            placeholder="Set threshold (°C)"
            className="threshold-input"
          />
          <input
            type="text"
            defaultValue={weatherCondition}
            onChange={(e) => setWeatherCondition(e.target.value)}
            placeholder="Weather Condition Ex: Rain "
            className="threshold-input"
          />
          <button onClick={handleSetThreshold} className="set-threshold-button">Set</button>
        </div>
      </div>

      <div className="content">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <div className="weather-card">
              <h2>Current Weather Data</h2>
              {weatherData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Condition</th>
                      <th>Temperature (°C)</th>
                      <th>Feels Like</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.city}</td>
                        <td>{data.mainCondition}</td>
                        <td>{data.temp}</td>
                        <td>{data.feels_like}</td>
                        <td>{myDate.toDateString(Date(data.time * 1000))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No weather data available.</p>
              )}
            </div>
            <div className="summary-card">
              <h2>Daily Summary</h2>
              {summary ? (
                <div>
                  <p><strong>Average Temperature:</strong> {summary.avgTemp} °C</p>
                  <p><strong>Max Temperature:</strong> {summary.maxTemp} °C</p>
                  <p><strong>Min Temperature:</strong> {summary.minTemp} °C</p>
                  <p><strong>Dominant Condition:</strong> {summary.dominantCondition}</p>
                </div>
              ) : (
                <p>No summary available.</p>
              )}
            </div>
            <div className="alerts-card">
              <h2>Alerts</h2>
              {alerts.length > 0 ? (
                <ul>
                  {alerts.map((alert, index) => (
                    <li key={index}><b>ALERT:</b> {alert.city} exceeded threshold! Temperature: {alert.temp} Condition: {alert.mainCondition}</li>
                  ))}
                </ul>
              ) : (
                <p>No alerts triggered.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;



