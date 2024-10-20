import { useState } from "react";
import weatherIcon from "@/assets/images/weather-logo.png";
import temperatureIcon from "@/assets/images/temperature-logo.jpg";

export default function Button() {
  const [temperature, setTemperature] = useState();
  const [weather, setWeather] = useState();

  function handleClick() {
    fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast")
      .then((response) => response.json())
      .then((data) => data.properties.periods[0])
      .then((data) => {
        setWeather(data.shortForecast);
        setTemperature(data.temperature);
      });
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ul
        style={{ paddingTop: "200px" }}
        className="flex items-center justify-center"
      >
        <li>
          <img
            src={weatherIcon}
            alt="Weather Icon"
            style={{ width: "200px", height: "200px" }}
          />
          Weather: {weather}
        </li>
        <li>
          <img
            src={temperatureIcon}
            alt="Weather Icon"
            style={{ width: "200px", height: "200px" }}
          />
          Temperature: {temperature} F
        </li>
      </ul>

      <button
        className="text-center items-center"
        style={{ backgroundColor: "coral", margin: "50px", padding: "20px" }}
        onClick={handleClick}
      >
        A button! Yayyyy!
      </button>
    </div>
  );
}
