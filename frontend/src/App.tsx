import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import AnneRainierButton from "@/components/buttonAnneRainier";
import ArayHunterButton from "./components/buttonArayHunter";

import Testimonials from "./components/testimonials";
import Footer from "./components/Footer";
import IntroPage from "./components/intro";
import Header from "./components/header";
import ServicesBoxes from "./components/services";
import TuteeInfoBox from "./components/tuteeInfoBox";

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
          path="/info_box" // TODO: Change the path name to match that of your component
          element={
            <div>
              <TuteeInfoBox
                date="09/19/2024"
                first_name="Moya"
                last_name="Techakalayatum"
                email="hello@gmail.com"
                subject="Math, English"
                grade="K-8"
                gender="female"
                tutoring_mode="Hybrid"
                special_needs="yes"
                parent_first_name="Bob"
                parent_last_name="Alice"
                phone="(123)456-7890"
              />
            </div>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
