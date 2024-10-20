"use client";
import { useState } from "react";

export default function BrandonButton() {
  const [forecast, setForecast] = useState<
    { name: string; shortForecast: string } | undefined
  >(undefined);
  const [isClicked, setIsClicked] = useState(false);

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

    setIsClicked(true);
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      {forecast && (
        <div>
          <i className="text-center font-interExtraBoldItalic">
            Weather {forecast.name}:
          </i>
          <p className="text-center text-xl">{forecast.shortForecast}</p>
        </div>
      )}
      <button
        onClick={handleClick}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-interBlack p-5 rounded-md text-2xl ${
          isClicked ? "" : "animate-spin-move"
        }`}
      >
        Get Forecast
      </button>
    </div>
  );
}
