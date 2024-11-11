import { useState } from "react";
import Mail from "../assets/images/nav_icons/mailing_list.svg";
import Matching from "../assets/images/nav_icons/matching_suggestion.svg";
import TuteeDB from "../assets/images/nav_icons/tutee_db.svg";
import ApprovedMatch from "../assets/images/nav_icons/approved_match.svg";
import TutorDB from "../assets/images/nav_icons/tutor_db.svg";
import Collapse from "../assets/images/nav_icons/collapse.svg";

export default function NavigationBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col bg-[#FFFFFF] h-screen transition-all duration-300 border-r-2 ${
        isCollapsed ? "w-[50px]" : "w-[250px]"
      }`}
    >
      <div onClick={toggleCollapse} className="flex justify-end cursor-pointer p-2">
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
        <a
          className="rounded box-border h-10 w-30 flex flex-row items-center ml-2 text-left font-semibold text-[#888888] hover:bg-[#E3EFFB] hover:text-[#1F3A68]"
          href="/matchingSuggestion"
        >
          <img className="ml-2" src={Matching} alt="Matching Suggestion Icon" style={{ width: "24px", height: "24px" }} />
          {!isCollapsed && <span className="ml-2">Matching Suggestion</span>}
        </a>

        <a
          className="rounded box-border h-10 w-30 flex flex-row items-center ml-2 text-left font-semibold text-[#888888] hover:bg-[#E3EFFB] hover:text-[#1F3A68]"
          href="/approvedSuggestion"
        >
          <img className="ml-2" src={ApprovedMatch} alt="Approved Match Icon" style={{ width: "24px", height: "24px" }} />
          {!isCollapsed && <span className="ml-2">Approved Match</span>}
        </a>

        <a
          className="rounded box-border h-10 w-30 flex flex-row items-center ml-2 text-left font-semibold text-[#888888] hover:bg-[#E3EFFB] hover:text-[#1F3A68]"
          href="/tutordata"
        >
          <img className="ml-2" src={TutorDB} alt="Tutor Database Icon" style={{ width: "24px", height: "24px" }} />
          {!isCollapsed && <span className="ml-2">Tutor Database</span>}
        </a>

        <a
          className="rounded box-border h-10 w-30 flex flex-row items-center ml-2 text-left font-semibold text-[#888888] hover:bg-[#E3EFFB] hover:text-[#1F3A68]"
          href="/tuteedata"
        >
          <img className="ml-2" src={TuteeDB} alt="Tutee Database Icon" style={{ width: "24px", height: "24px" }} />
          {!isCollapsed && <span className="ml-2">Tutee Database</span>}
        </a>

        <a
          className="rounded box-border h-10 w-30 flex flex-row items-center ml-2 text-left font-semibold text-[#888888] hover:bg-[#E3EFFB] hover:text-[#1F3A68]"
          href="/mailinglist"
        >
          <img className="ml-2" src={Mail} alt="Mailing List Icon" style={{ width: "24px", height: "24px" }} />
          {!isCollapsed && <span className="ml-2">Mailing List</span>}
        </a>
      </div>
    </div>
  );
}
