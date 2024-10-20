"use client";
import { useState } from "react";

export default function BrandonButton() {
  const [forecast, setForecast] = useState<
    { name: string; shortForecast: string } | undefined
  >(undefined);

  // Fetch the weather data
  function handleClick() {
    fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        // Check if json has properties and periods before accessing
        if (json.properties && json.properties.periods) {
          setForecast(json.properties.periods[0]);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the forecast:", error);
      });
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      {forecast && (
        <div>
          <i className="text-center font-mono text-base">
            Weather {forecast.name}:
          </i>
          <p className="text-center font-mono text-xl">
            {forecast.shortForecast}
          </p>
        </div>
      )}
      <button
        onClick={handleClick}
        className="bg-blue-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded border-8 border-emerald-800"
      >
        Get Forecast
      </button>
    </div>
  );
}
