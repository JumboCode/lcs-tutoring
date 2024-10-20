import { useState } from "react";

export default function Button() {
  const buttonStyle = {
    backgroundColor: "yellow",
    color: "black",
    padding: "80px 20px",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
  };

  const [weatherData, setWeatherData] = useState(null);
  const [isDataVisible, setIsDataVisible] = useState(false);

  const fetchWeatherData = () => {
    if (!weatherData) {
      fetch("https://api.weather.gov/gridpoints/BOX/69,92/forecast")
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data["properties"]["periods"][0]["detailedForecast"]);
          setIsDataVisible(true);
        });
    } else {
      setIsDataVisible(!isDataVisible);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <button onClick={fetchWeatherData} style={buttonStyle}>
        {isDataVisible ? "Hide Weather Data" : "Fetch Weather Data"}
      </button>
      {isDataVisible && weatherData && (
        <pre style={{ color: "black" }}>{weatherData}</pre>
      )}
    </div>
  );
}
