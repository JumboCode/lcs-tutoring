import { useState } from 'react';

export default function Button() {
    const [temperature, setTemperature] = useState(0);
    const [weather, setWeather] = useState();

    async function handleClick() {
        const response = await fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast"); 
        const data = response.json();
        setTemperature(data.properties.periods[0].temperature);
        
        //get api stuff
        // fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast")
        //     .then(response => response.json())
        //     .then(data => console.log(data));

        
    }

    return (
        <button onClick={handleClick}>
            A button! Yayyyy!
        </button>
    );
}

