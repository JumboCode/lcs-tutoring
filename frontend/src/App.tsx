
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
// import Button from 'react-bootstrap/Button';
import { Button } from 'react-bootstrap';

import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import AnneRainierButton from "@/components/buttonAnneRainier";
import ArayHunterButton from "./components/buttonArayHunter";

import TuteeTable from "./components/TuteeTable";
import TutorForm1 from "./components/tutorForm1";
import TutorForm2 from "./components/TutorForm2";
import Testimonials from "./components/testimonials";
import Footer from "./components/Footer";
import IntroPage from "./components/intro";
import Header from "./components/header";
import ServicesBoxes from "./components/services";
import TuteeInfoBox from "./components/TuteeInfoBox";
import TuteeSuggestionBox from "./components/tuteeSuggestionBox";
import FilterModal from "./components/filters";
import filtersIcon from './assets/images/filter/filter.svg';
import NavigationBar from "./components/navigationBar";
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

  // const tutee_data = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //   },
  // ];

  const [modalShow, setModalShow] = useState(false);

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
          path="/filters"
          element={
            <div>
              <button className={"flex flex-row items-center px-4 py-2 bg-[#FFFFFF] border-[#E7E7E7] rounded-lg border-1 text-[#888888]"} onClick={() => setModalShow(true)}>
                  <img className={"mr-2"} src={filtersIcon}/>
                  Filters
              </button>
              <FilterModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
        ></Route>
        <Route
          path="/tutorform2"
          element={
            <div className="flex flex-col">
              <TutorForm1 />
              <TutorForm2 />
            </div>
          }
        ></Route>
        <Route
          path="/navigationBar" // TODO: Change the path name to match that of your component
          element={
            <div>
              <NavigationBar />
            </div>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
