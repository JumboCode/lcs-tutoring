import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import AnneRainierButton from "@/components/buttonAnneRainier";
import Button from './components/Button';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div></div>}></Route>

        <Route
          path="/testbuttons"
          element={
            <div>
              {/* <BrandonButton /> */}
              {/* <SethRachelButton /> */}
              {/* <ValentinaCharlieButton /> */}
              <AnneRainierButton />
            </div>
          }
        ></Route>

        {/* New route to display the next component! */}
        <Route
          path="/[new name]" // TODO: Change the path name to match that of your component
          element={<div>{/* TODO: Include your component here: */}</div>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
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
