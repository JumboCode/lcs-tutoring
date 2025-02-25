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

/* Admin View */
import FilterModal from "./components/filters";
import filtersIcon from "./assets/images/filter/filter.svg";
import NavigationBar from "./components/navigationBar";
import TuteeTable from "./components/TuteeTable";
import TutorTable from "./components/TutorTable";
import ApprovedMatches from "./components/ApprovedMatches";
import AddAdmin from "./components/addAdmin";
import AdminLogin from "./components/adminSignIn"; // Added this
import MatchSuggestions from "./components/matchSuggestionBlock";
import AdminHeader from "./components/HeaderAdmin";

import SuccessPage from "./components/SuccessPage";

function App() {
  const [modalShow, setModalShow] = useState(false);

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
        <Route
          path="/adminLogin"
          element={
            <div>
              <AdminLogin />
            </div>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
