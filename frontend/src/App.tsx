import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

/* Demo Buttons */
import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import AnneRainierButton from "@/components/buttonAnneRainier";
import ArayHunterButton from "./components/buttonArayHunter";

/* General View */
import HomePage from "./components/homePage";
import TutorForm from "./components/TutorForm";
import TuteeForm from "./components/TuteeForm";
import TeamPage from "./components/teamPage";
import Header from "./components/header";
import Footer from "./components/Footer";

/* Admin View */
import TuteeInfoBox from "./components/TuteeInfoBox";
import TuteeSuggestionBox from "./components/tuteeSuggestionBox";
import FilterModal from "./components/filters";
import filtersIcon from "./assets/images/filter/filter.svg";
import NavigationBar from "./components/navigationBar";
import MatchSuggestionBlock from "./components/matchSuggestionBlock";
import TuteeTable from "./components/TuteeTable";
import ApprovedMatches from "./components/ApprovedMatches";

/* Type definitions */
import { tutorInfo } from "./types";
import { tuteeInfo } from "./types";

function App() {
  const [modalShow, setModalShow] = useState(false);

  const tutor_info: tutorInfo = {
    first_name: "Moya",
    last_name: "Techakalayatum",
    email: "hello@gmail.com",
    phone: "(123) 456-7890",
    subject: ["Math", "English"],
    grade: ["8th", "9th", "10th"],
    open_to_disability: true,
    tutoring_mode: "Hybrid",
  };

  const tutee1: tuteeInfo = {
    first_name: "Tutee",
    last_name: "Lastname 1",
    email: "parent@gmail.com",
    subject: "Math",
    grade: "4th",
    special_needs: "No",
    tutoring_mode: "In-person",
  };

  const tutee2: tuteeInfo = {
    first_name: "Tutee",
    last_name: "Lastname 2",
    email: "parent@gmail.com",
    subject: "English",
    grade: "4th",
    special_needs: "No",
    tutoring_mode: "In-person",
  };

  const tutee3: tuteeInfo = {
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
        {/* Client View */}
        <Route
          path="/"
          element={
            <div className="flex flex-col">
              <Header />
              <HomePage />
              <Footer />
            </div>
          }
        ></Route>
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
        <Route
          path="/team"
          element={
            <div className="flex flex-col">
              <Header />
              <TeamPage />
              <Footer />
            </div>
          }
        ></Route>
        <Route
          path="/tutor-form"
          element={
            <div className="flex flex-col">
              <Header />
              <TutorForm />
              <Footer />
            </div>
          }
        ></Route>
        <Route
          path="/tutee-form"
          element={
            <div className="flex flex-col">
              <Header />
              <TuteeForm />
              <Footer />
            </div>
          }
        ></Route>

        {/* Admin View WIP */}
        <Route
          path="/approved-matches"
          element={
            <div>
              <ApprovedMatches />
            </div>
          }
        ></Route>
        <Route
          path="/filters"
          element={
            <div>
              <button
                className={
                  "flex flex-row items-center px-4 py-2 bg-[#FFFFFF] border-[#E7E7E7] rounded-lg border-1 text-[#888888]"
                }
                onClick={() => setModalShow(true)}
              >
                <img className={"mr-2"} src={filtersIcon} />
                Filters
              </button>
              <FilterModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                onApply={() => {
                  setModalShow(false);
                }}
              />
            </div>
          }
        ></Route>
        <Route
          path="/navigationBar"
          element={
            <div>
              <NavigationBar />
            </div>
          }
        ></Route>
        <Route
          path="/tuteetable"
          element={
            <div>
              <TuteeTable />
            </div>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
