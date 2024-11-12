import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import AnneRainierButton from "@/components/buttonAnneRainier";
import ArayHunterButton from "./components/buttonArayHunter";
import TuteeTable from "./components/TuteeTable";
import ApprovedMatches from "./components/ApprovedMatches";
// import Testimonials from "./components/testimonials";
// import Footer from "./components/Footer";
// import IntroPage from "./components/intro";
// import Header from "./components/header";
// import ServicesBoxes from "./components/services";
// import TuteeInfoBox from "./components/tuteeInfoBox";
// import TuteeSuggestionBox from "./components/tuteeSuggestionBox";

import HomePage from "./components/homePage";

function App() {
  // const tutee_data = {
  //   date: "10/31/2024",
  //   first_name: "Moya",
  //   last_name: "Techakalayatum",
  //   email: "hello@gmail.com",
  //   subject: "Math, English",
  //   grade: "8",
  //   special_needs: "Yes",
  //   gender: "Female",
  //   tutoring_mode: "Hybrid",
  //   parent_first_name: "Alice",
  //   parent_last_name: "Bob",
  //   phone: "(123) 456-7890",
  // };

  const tutee_data = [
    {
      id: 1,
      name: "John Doe",
    },
  ];

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
          path="/approved-matches"
          element={
            <div>
              <ApprovedMatches />
            </div>
          }
        ></Route>
        <Route
          path="/homepage" // TODO: Change the path name to match that of your component
          element={
            <div>
              <HomePage />
            </div>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
