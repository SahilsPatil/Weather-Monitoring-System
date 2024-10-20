# 🌦️ Real-Time Weather Monitoring System 🌍

![image](https://github.com/user-attachments/assets/1cd75b77-7c4b-4102-a344-4ec534f44664)

The **Real-Time Weather Monitoring System** is designed to track weather conditions across multiple Indian metro cities. It fetches live data from the **OpenWeatherMap API**, processes it, and triggers alerts based on user-configurable thresholds. These alerts are stored in a database and displayed on a web interface, providing critical weather insights such as temperature and conditions like rain, snow, or storms.

---

## 🚀 Features

- **Real-time weather data** fetching for multiple cities
- **User-configurable thresholds** for temperature and weather conditions
- Automatic **alert generation** when conditions exceed thresholds
- Storage of alerts in a **MongoDB database**
- Intuitive **dashboard interface** to view real-time data and alerts
- Clean and professional **API integration** for future expansion

---

## 🛠️ Tech Stack

- **Frontend**: React.js, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Weather Data API**: OpenWeatherMap API

---

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or on MongoDB Atlas)
- **NPM** (comes with Node.js)
- An **OpenWeatherMap API Key** (Create an account at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up))

---

## 📂 Project Structure

The project has a separate **frontend** and **backend** directory. You will need to run both the frontend and backend servers independently.

```bash
weather-monitoring-system/
│
├── frontend/         # React-based frontend application
├── backend/          # Node.js backend API
└── README.md         # Project documentation
```


## 📦 Installation and Setup

Follow these steps to set up and run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weather-monitoring-system.git
cd weather-monitoring-system
```

### 2. Install Backend Dependencies

Navigate to the backend directory and install the necessary packages:

```bash
cd backend
npm install
```
This will install all required backend dependencies such as express, mongoose, axios, etc.

### 3. Install Frontend Dependencies
Now, navigate to the frontend directory and install frontend dependencies:

```bash
cd ../frontend
npm install
```
This will install packages like react, axios, etc., needed for the frontend React application.

### 4. Set up environment variables for Backend
In the backend directory, create a .env file and add the following environment variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/weatherMonitoring
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
```
Replace your_openweathermap_api_key with your actual OpenWeatherMap API key.

### 5. Start the MongoDB Server
Ensure that MongoDB is running locally. If using MongoDB Atlas, replace the MONGO_URI in the .env file accordingly.


## 🚀 Running the Application
Now that both frontend and backend are set up, you need to run them separately.

### Running Backend
Go to the backend folder and start the backend server:

```bash
cd backend
nodemon index.js
```
The backend server will run on http://localhost:5000.

### Running Frontend
Go to the frontend folder and start the frontend React application:

```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173 (or another available port if 3000 is taken).

## 🌐 API Routes
The system has a few important API endpoints:

#### GET ``` /api/weather/fetch ```
Fetches the latest weather data from OpenWeatherMap API for configured metro cities.

#### GET ``` /api/weather/daily-summary ```
To get daily calculated Summery

#### GET ``` /api/weather/alerts ```
Retrieves all weather alerts stored in the database.

#### POST ``` /api/weather/initialize-thresholds ```
Initialize the thresholds value from DB

### POST ``` /api/weather/set-threshold ```
To set the custom threshold & conditon to get alert

## 🎛️ Thresholds and Alerts
You can set the temperature and weather condition thresholds in the database. When weather data exceeds these values, an alert is automatically generated.

### Default Thresholds:
Temperature: 35°C
Weather Condition: "None"
You can modify the thresholds using the MongoDB database or extend the web interface for threshold management.

## 📊 How It Works
1. The system periodically fetches live weather data from the OpenWeatherMap API for a list of Indian metro cities.
2. Weather data is processed, and thresholds (temperature, conditions) are checked.
3. If a city's weather exceeds any threshold, an alert is generated and saved to the database.
4. Alerts can be viewed via the API or a front-end dashboard (optional).

   
## 💻 Usage
### 1. Fetch Weather Data & Daily Summery
To fetch the weather data for the configured cities, you can trigger the ```/api/weather/fetch``` endpoint either manually or set up a cron job for periodic data fetching.

### 2. View Alerts
Use the ```/api/weather/alerts``` endpoint to view all the alerts triggered by threshold breaches. This data can be visualized in a custom dashboard.


## 🔧 Extending the System
## Adding More Cities
You can modify the list of cities being monitored by changing the weatherData array in the backend code. Simply add the city names and their corresponding OpenWeatherMap city IDs.

Example:

```javascript
const weatherData = [
    { city: 'Mumbai', id: 1275339 },
    { city: 'Delhi', id: 1273294 },
    { city: 'Bengaluru', id: 1277333 },
    { city: 'Kolkata', id: 1275004 },
    { city: 'Chennai', id: 1264527 }
];
```

### Customizing Thresholds
Thresholds are stored in the Threshold model in MongoDB. You can update them through a dedicated route or directly through a dashboard.


## 📷 Screenshots
Dashboard Example
![image](https://github.com/user-attachments/assets/1cd75b77-7c4b-4102-a344-4ec534f44664)
![image](https://github.com/user-attachments/assets/f01a39bd-dc64-4389-8ef7-27a69ad95fbb)
