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
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./components/homePage";
import TutorForm from "./components/TutorForm";
import TuteeForm from "./components/TuteeForm";
import TeamPage from "./components/teamPage";
import Header from "./components/header";
import Footer from "./components/Footer";
import EListForm from "./components/E-ListForm";

/* Admin View */
import FilterModal from "./components/filters";
import filtersIcon from "./assets/images/filter/filter.svg";
import NavigationBar from "./components/navigationBar";
import TuteeTable from "./components/TuteeTable";
import TutorTable from "./components/TutorTable";
import ApprovedMatches from "./components/ApprovedMatches";
import AddAdmin from "./components/addAdmin";
import MatchSuggestions from "./components/matchSuggestionBlock";
import AdminHeader from "./components/HeaderAdmin";

import SuccessPage from "./components/SuccessPage";

/* Type definitions */
// import { tutorBoxProps, tuteeBoxProps } from "./types";
import { tutorInfo, tuteeInfo } from "./types";

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

  const tutor1: tutorInfo = {
    first_name: "Brandon",
    last_name: "Dionisio",
    email: "brandon.dionisio@tufts.edu",
    phone: "8454204946",
    subject: ["Math", "Science"],
    grade: ["9", "10"],
    open_to_disability: true,
    tutoring_mode: "Hybrid",
  };

  const tutee1: tuteeInfo = {
    first_name: "Bill",
    last_name: "Smith",
    email: "bill.smith@hi.com",
    subject: "Math",
    grade: "8",
    special_needs: "No",
    tutoring_mode: "Hybrid",
  };

  const tutee2: tuteeInfo = {
    first_name: "Bob",
    last_name: "Jones",
    email: "bob.jones@hi.com",
    subject: "Science",
    grade: "10",
    special_needs: "Dyslexia",
    tutoring_mode: "In-Person",
  };

  const tutee3: tuteeInfo = {
    first_name: "Ana",
    last_name: "Todd",
    email: "ana.todd@hi.com",
    subject: "English",
    grade: "9",
    special_needs: "No",
    tutoring_mode: "Hybrid",
  };

  return (
    <Router>
      <Routes>
        {/* Client View */}
        <Route
          path="/"
          element={
            <div className="flex flex-col">
              <ScrollToTop />
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
              <ScrollToTop />
              <Header />
              <TeamPage />
              <EListForm />
              <Footer />
            </div>
          }
        ></Route>
        <Route
          path="/tutor-form"
          element={
            <div className="flex flex-col">
              <ScrollToTop />
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
              <ScrollToTop />
              <Header />
              <TuteeForm />
              <Footer />
            </div>
          }
        ></Route>

        <Route
          path="/success-page"
          element={
            <div className="flex flex-col">
              <ScrollToTop />
              <Header />
              <SuccessPage />
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
          path="/adminview"
          element={
            <div>
              <AdminHeader />
              <NavigationBar />
            </div>
          }
        ></Route>

        <Route
          path="/matchsuggestions"
          element={
            <div>
              <MatchSuggestions
                tutee1={tutee1}
                tutee2={tutee2}
                tutee3={tutee3}
                tutor_info={tutor1}
              />
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
        <Route
          path="/admin"
          element={
            <div>
              <AddAdmin />
            </div>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
