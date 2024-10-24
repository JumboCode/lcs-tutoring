import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header'; 

// import BrandonButton from "@/components/buttonBrandon";
// import SethRachelButton from "./components/buttonSethRachel";
// import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
// import AnneRainierButton from "@/components/buttonAnneRainier";
// import ArayHunterButton from "./components/buttonArayHunter";

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
              {/* <AnneRainierButton /> */}
              {/* <ArayHunterButton /> */}
            </div>
          }
        ></Route>

        {/* New route to display the next component! */}
        <Route
          path="/header"
          element=
          {<div>
                <Header/>
          </div>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
