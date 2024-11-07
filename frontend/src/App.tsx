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
import TuteeSuggestionBox from "./components/tuteeSuggestionBox";
import TutorForm1 from "./components/tutorForm1";

import HomePage from "./components/homePage";
import MatchSuggestionBlock from "./components/matchSuggestionBlock";
import boxProps from "./tuteeSuggestionBox";
import tutorInfo from "./components/matchSuggestionBlock"

function App() {
  const tutee_data = {
    date: "10/31/2024",
    first_name: "Moya",
    last_name: "Techakalayatum",
    email: "hello@gmail.com",
    subject: "Math, English",
    grade: "8",
    special_needs: "Yes",
    gender: "Female",
    tutoring_mode: "Hybrid",
    parent_first_name: "Alice",
    parent_last_name: "Bob",
    phone: "(123) 456-7890",
  };

  const tutor_info: tutorInfo = {
    first_name: "Moya",
    last_name:  "Techakalayatum",
    email: "hello@gmail.com",
    phone: "(123) 456-7890",
    subject: "Math, English",
    grade: ["8th", "9th", "10th"],
    open_to_disability: ["Yes"],
    tutoring_mode: "Hybrid",
  };

  const tutee1: boxProps = {
    first_name: "Tutee",
    last_name: "Lastname 1",
    email: "parent@gmail.com",
    subject: "Math",
    grade: "4th",
    special_needs: "No",
    tutoring_mode: "In-person",
  };

  const tutee2: boxProps = {
    first_name: "Tutee",
    last_name: "Lastname 2",
    email: "parent@gmail.com",
    subject: "English",
    grade: "4th",
    special_needs: "No",
    tutoring_mode: "In-person",
  };

  const tutee3: boxProps = {
    first_name: "Tutee",
    last_name: " Lastname 3",
    email: "parent@gmail.com",
    subject: "English",
    grade: "3rd",
    special_needs: "No",
    tutoring_mode: "In-person",
  };

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
          path="/matchSuggestionBlock" // TODO: Change the path name to match that of your component
          element={
            <div>
              <MatchSuggestionBlock 
                tutor_info = {tutor_info} 
                tutee1={tutee1}
                tutee2={tutee2}
                tutee3={tutee3}/>
            </div>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
