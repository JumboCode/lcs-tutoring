import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import AnneRainierButton from "@/components/buttonAnneRainier";
import ArayHunterButton from "./components/buttonArayHunter";

// import Testimonials from "./components/testimonials";
// import Footer from "./components/Footer";
// import IntroPage from "./components/intro";
import Header from "./components/header";
// import ServicesBoxes from "./components/services";
import TeamPage from "./components/teamPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div></div>}></Route>

        <Route
          path="/testbuttons"
          element={
            <div>
              <BrandonButton />
              <SethRachelButton />
              <ValentinaCharlieButton />
              <AnneRainierButton />
              <ArayHunterButton />
            </div>
          }
        ></Route>

        {/* New route to display the next component! */}
        <Route
          path="/teampage"
          element={
          <div>
            <Header />
            <TeamPage />
            {/* <Footer /> */}
          </div>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
