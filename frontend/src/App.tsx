import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

/* Demo Buttons */
import BrandonButton from "@/components/buttonBrandon";
import SethRachelButton from "./components/buttonSethRachel";
import ValentinaCharlieButton from "./components/buttonValentinaCharlie";
import AnneRainierButton from "@/components/buttonAnneRainier";
import ArayHunterButton from "./components/buttonArayHunter";
import Demo from "./components/request_demo";

/* General View */
import HomePage from "./components/homePage";
import TutorForm from "./components/TutorForm";
import TuteeForm from "./components/TuteeForm";
import TeamPage from "./components/teamPage";
import Header from "./components/header";
import Footer from "./components/Footer";

/* Admin View */
import FilterModal from "./components/filters";
import filtersIcon from "./assets/images/filter/filter.svg";
import NavigationBar from "./components/navigationBar";
import TuteeTable from "./components/TuteeTable";
import TutorTable from "./components/TutorTable";
import ApprovedMatches from "./components/ApprovedMatches";

/* Type definitions */
// import { tutorBoxProps, tuteeBoxProps } from "./types";

function App() {
  const [modalShow, setModalShow] = useState(false);

  // const tutor_info: tutorBoxProps = {
  //   id: "1234567",
  //   date: "2024-11-26",
  //   first_name: "John",
  //   last_name: "Doe",
  //   email: "john.doe@example.com",
  //   subject_pref: ["Math", "Science", "English"],
  //   pronouns: "he/him",
  //   major: "Computer Science",
  //   year_grad: "2025",
  //   phone: "123-456-7890",
  //   previous_tutee: false,
  //   grade_level_pref: ["7", "8", "9"],
  //   num_tutees: 2,
  //   disability_pref: true,
  //   tutoring_mode: "In-person",
  // };

  // const tutee_info: tuteeBoxProps = {
  //   date: "10/31/2024",
  //   tutee_first_name: "Moya",
  //   tutee_last_name: "Techakalayatum",
  //   parent_email: "hello@gmaiasdasdl.com",
  //   subject: "Math, English",
  //   grade: "8",
  //   special_needs: "Yes",
  //   gender: "Female",
  //   tutoring_mode: "Hybrid",
  //   parent_first_name: "Alice",
  //   parent_last_name: "Bob",
  //   parent_phone: "(123) 456-7890",
  // };

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

        <Route
          path="/approvedmatchestable"
          element={
            <div>
              <ApprovedMatches />
            </div>
          }
        ></Route>

        <Route
          path="/tutortable"
          element={
            <div>
              <TutorTable />
            </div>
          }
        ></Route>

        <Route
          path="/demo"
          element={
            <div>
              <Demo />
            </div>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
