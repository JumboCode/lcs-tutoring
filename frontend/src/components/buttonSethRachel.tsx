import { useState } from "react";

export default function Button() {
  let tempToday;
  const [temp, setTemp] = useState(0);
  const [condition, setCondition] = useState("");
  const fetchWeather = async () => {
    const response = await fetch(
      "https://api.weather.gov/gridpoints/BOX/69,92/forecast"
    );
    const data = await response.json();
    console.log(data);
    tempToday = data.properties.periods[0].temperature;
    setTemp(tempToday);
    setCondition(data.properties.periods[0].shortForecast);
  };

  return (
    <>
      <h1 className="text-2xl">Weather!</h1>
      <button onClick={fetchWeather} className="">
        Tell me the weather!
      </button>
      <h4>{condition}</h4>
      <div>{temp}</div>
    </>
  );
}
