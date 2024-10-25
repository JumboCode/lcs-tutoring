import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Testimonials from "./components/testimonials" 
import Footer from "./components/Footer";
import LcsTutoringIntro from "./components/intro";
import Header from "./components/header";
import ServicesBoxes from "./components/services";

import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import AnneRainierButton from "@/components/buttonAnneRainier";
import ArayHunterButton from "./components/buttonArayHunter";

function App() {

  const testimonialExample = {
    name: "Anna",
    message: "I love 'AHA' moments. Once, I was explaining to someone how to deal with exponents in fractions, and I saw the exact moment it clicked in their brain. Knowing that I helped someone finally understand something that was plaguing them was extremely rewarding.",
    major: "BIOCHEM & BIOPSYCH",
    year: "2025",
  }

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
          path="/testimonials" // TODO: Change the path name to match that of your component
          element={<div><Testimonials
            name={testimonialExample.name}
            message={testimonialExample.message}
            major={testimonialExample.major}
            year={testimonialExample.year}
            /></div>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
