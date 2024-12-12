import { useState } from "react";
import Mail from "../assets/images/nav_icons/mailing_list.svg";
import Matching from "../assets/images/nav_icons/matching_suggestion.svg";
import TuteeDB from "../assets/images/nav_icons/tutee_db.svg";
import ApprovedMatch from "../assets/images/nav_icons/approved_match.svg";
import TutorDB from "../assets/images/nav_icons/tutor_db.svg";
import Collapse from "../assets/images/nav_icons/collapse.svg";

import TuteeTable from "./TuteeTable";
import TutorTable from "./TutorTable";
import ApprovedMatches from "./ApprovedMatches";

export default function NavigationBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("Match Suggestions");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
            <span>No functionality yet :(((((</span>
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
