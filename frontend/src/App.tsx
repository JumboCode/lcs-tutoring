import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import AnneRainierButton from "@/components/buttonAnneRainier";

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
