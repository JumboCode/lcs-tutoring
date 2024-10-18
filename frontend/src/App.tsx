import React, { useState } from 'react';
import Button from './components/Button';

function App() {
  const [weather, setWeather] = useState<{ shortForecast: string } | undefined>(undefined);
  const fetchWeatherData = () => {
    console.log('Fetching weather data...');
    fetch('https://api.weather.gov/gridpoints/BOX/69,92/forecast')
      .then(response => response.json())
      .then(data => {
        console.log(data.properties.periods[0]); 
        setWeather({ shortForecast: data.properties.periods[0].shortForecast }); 
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  };

return (
  <div>
    <h1>Weather App: Get yo weatha</h1>
    
    <Button label="Weather Snatcherrr!!!" onClick={fetchWeatherData} />
    
    {weather ? (
      <div>{weather.shortForecast}</div>
    ) : (
      <p>No weather data available</p>
    )}
  </div>
);
}

export default App;