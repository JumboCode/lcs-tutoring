import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import AnneRainierButton from "@/components/buttonAnneRainier";
import ArayHunterButton from "./components/buttonArayHunter";

// import Testimonials from "./components/testimonials";
// import Footer from "./components/Footer";
// import IntroPage from "./components/intro";
// import Header from "./components/header";
// import ServicesBoxes from "./components/services";

import TuteeInfoBox from "./components/TuteeInfoBox";
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
          element={<div>
            <TuteeInfoBox
            date="09/19/2024"
            name= "Moya Techakalayatum"
            email= "hello@gmail.com"
            subject= "Math, English"
            grade= "K-8"/>
          </div>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
