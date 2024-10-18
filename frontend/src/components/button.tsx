import { useState } from 'react';

export default function Button() {
    const [temperature, setTemperature] = useState();
    const [weather, setWeather] = useState();

    function handleClick() {
        
        fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast")
            .then(response => response.json())
            .then(data => data.properties.periods[0]) 
            .then(data => {
                setWeather(data.shortForecast);
                setTemperature(data.temperature);
            });

        
    }

    return (
        <div className="flex flex-col">
            <button onClick={handleClick}>
                A button! Yayyyy!
            </button>
            <ul>
                <li>Weather: {weather}</li>
                <li>Temperature: {temperature} F</li>
            </ul>
        </div>
    );
}

