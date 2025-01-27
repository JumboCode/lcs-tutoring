import { useState } from "react";
import Mail from "../assets/images/nav_icons/mailing_list_gray.svg";
import Matching from "../assets/images/nav_icons/match_suggestion_gray.svg";
import TuteeDB from "../assets/images/nav_icons/tutee_db_gray.svg";
import ApprovedMatch from "../assets/images/nav_icons/approved_match_gray.svg";
import TutorDB from "../assets/images/nav_icons/tutor_db_gray.svg";
import Collapse from "../assets/images/nav_icons/collapse.svg";

import TuteeTable from "./TuteeTable";
import TutorTable from "./TutorTable";
import ApprovedMatches from "./ApprovedMatches";
import MatchSuggestionBlock from "./matchSuggestionBlock";

import { tutorInfo, tuteeInfo } from "../types";

export default function NavigationBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("Match Suggestions");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
    notes: "I would like to be paired with xxx",
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

  const menuItems = [
    { name: "Match Suggestions", icon: Matching },
    { name: "Approved Matches", icon: ApprovedMatch },
    { name: "Tutor Database", icon: TutorDB },
    { name: "Tutee Database", icon: TuteeDB },
    { name: "Mailing List", icon: Mail },
  ];

  return (
    <div className="flex flex-row">
      <div
        className={`flex flex-col bg-[#FFFFFF] min-h-screen transition-all duration-300 border-r-2 ${
          isCollapsed ? "w-[50px]" : "w-[250px]"
        }`}
      >
        <div
          onClick={toggleCollapse}
          className="flex justify-end cursor-pointer p-2"
        >
          <img
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : "rotate-0"
            }`}
            src={Collapse}
            alt="Collapse Icon"
            style={{ width: "15px", height: "15px" }}
          />
        </div>

        <div className="flex flex-col mt-5 space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`rounded box-border h-10 w-30 flex flex-row items-center ml-2 text-left font-semibold cursor-pointer text-[#888888] hover:bg-[#E3EFFB] hover:text-[#1F3A68] ${
                currentPage === item.name ? "bg-[#E3EFFB] text-[#1F3A68]" : ""
              }`}
              onClick={() => setCurrentPage(item.name)}
            >
              <img
                className="ml-2"
                src={item.icon}
                alt={`${item.name} Icon`}
                style={{ width: "24px", height: "24px" }}
              />
              {!isCollapsed && <span className="ml-2">{item.name}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow p-4 bg-gray-100/50">
        <div className="mt-4">
          {currentPage === "Match Suggestions" && (
            <MatchSuggestionBlock
              tutee1={tutee1}
              tutee2={tutee2}
              tutee3={tutee3}
              tutor_info={tutor1}
            />
          )}
          {currentPage === "Tutor Database" && <TutorTable />}
          {currentPage === "Tutee Database" && <TuteeTable />}
          {currentPage === "Approved Matches" && <ApprovedMatches />}
          {currentPage === "Mailing List" && (
            <span>No functionality yet :(((((</span>
          )}
          {/* TODO: other pages when finished */}
        </div>
      </div>
    </div>
  );
}
