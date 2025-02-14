import { useState } from "react";
import MailGray from "../assets/images/nav_icons/mailing_list_gray.svg";
import MatchingGray from "../assets/images/nav_icons/match_suggestion_gray.svg";
import TuteeDBGray from "../assets/images/nav_icons/tutee_db_gray.svg";
import ApprovedMatchGray from "../assets/images/nav_icons/approved_match_gray.svg";
import TutorDBGray from "../assets/images/nav_icons/tutor_db_gray.svg";
import MailBlue from "../assets/images/nav_icons/mailing_list_blue.svg";
import MatchingBlue from "../assets/images/nav_icons/match_suggestion_blue.svg";
import TuteeDBBlue from "../assets/images/nav_icons/tutee_db_blue.svg";
import ApprovedMatchBlue from "../assets/images/nav_icons/approved_match_blue.svg";
import TutorDBBlue from "../assets/images/nav_icons/tutor_db_blue.svg";
import Collapse from "../assets/images/nav_icons/collapse.svg";

import TuteeTable from "./TuteeTable";
import TutorTable from "./TutorTable";
import ApprovedMatches from "./ApprovedMatches";
import MatchSuggestionTable from "./matchSuggestionTable";

export default function NavigationBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("Match Suggestions");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    {
      name: "Match Suggestions",
      icon_gray: MatchingGray,
      icon_blue: MatchingBlue,
    },
    {
      name: "Approved Matches",
      icon_gray: ApprovedMatchGray,
      icon_blue: ApprovedMatchBlue,
    },
    { name: "Tutor Database", icon_gray: TutorDBGray, icon_blue: TutorDBBlue },
    { name: "Tutee Database", icon_gray: TuteeDBGray, icon_blue: TuteeDBBlue },
    { name: "Mailing List", icon_gray: MailGray, icon_blue: MailBlue },
  ];

  return (
    <div className="flex flex-row">
      <div
        className={`flex flex-col bg-[#FFFFFF] min-h-screen transition-all duration-300 border-r-2 ${
          isCollapsed ? "min-w-[50px]" : "min-w-[225px]"
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
              className={`group rounded box-border h-10 w-30 flex flex-row items-center ml-2 text-left font-semibold cursor-pointer text-[#888888] hover:bg-[#E3EFFB] hover:text-[#1F3A68] ${
                currentPage === item.name ? "bg-[#E3EFFB] text-[#1F3A68]" : ""
              }`}
              onClick={() => setCurrentPage(item.name)}
            >
              <img
                className="ml-2 hidden group-hover:block"
                src={item.icon_blue}
                alt={`${item.name} Icon`}
                style={{ width: "24px", height: "24px" }}
              />
              <img
                className="ml-2 block group-hover:hidden"
                src={item.icon_gray}
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
          {currentPage === "Match Suggestions" && <MatchSuggestionTable />}
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
