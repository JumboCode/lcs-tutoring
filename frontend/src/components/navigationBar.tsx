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
import Elephant from "../assets/images/elephant.svg";
import LogoutGray from "../assets/images/nav_icons/logout_gray.svg";
import LogoutBlue from "../assets/images/nav_icons/logout_blue.svg";

import TuteeTable from "./TuteeTable";
import TutorTable from "./TutorTable";
import ApprovedMatches from "./ApprovedMatches";
import MatchSuggestionTable from "./matchSuggestionTable";

import { SignOutButton, UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";

export default function NavigationBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("Match Suggestions");
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useUser();

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

  // Define the nav bar width based on collapsed state
  const navBarWidth = isCollapsed ? "50px" : "225px";

  return (
    <div>
      {/* Fixed navigation bar */}
      <div
        className="fixed top-0 left-0 flex flex-col bg-[#E3EFFB] min-h-screen transition-all duration-300 border-r-2"
        style={{ width: navBarWidth }}
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
        {!isCollapsed && (
          <div>
            <img
              src={Elephant}
              style={{ padding: "5px", marginLeft: "15px" }}
            ></img>
          </div>
        )}

        <div
          className={`flex flex-col ${isCollapsed ? "mt-5" : "mt-4"} space-y-4`}
        >
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`group rounded box-border h-10 w-30 flex flex-row items-center ml-2 text-left font-semibold cursor-pointer text-[#888888] hover:bg-[#BFDBF7] hover:text-[#1F3A68] ${
                currentPage === item.name ? "bg-[#BFDBF7] text-[#1F3A68]" : ""
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

        <div className="flex justify-center items-end pb-4 mt-auto">
          <div className="flex flex-row">
            {!isCollapsed && user && (
              <div className="flex items-center mr-2">
                <UserButton>
                  <img
                    src={user.imageUrl || "https://via.placeholder.com/150"}
                    alt="User Profile"
                    className="w-8 h-8 mr-2 rounded-full object-cover"
                  />
                </UserButton>
              </div>
            )}
            {!isCollapsed && user && (
              <div
                className="text-xs flex flex-col items-start"
                onMouseEnter={() => setShowPopup(true)}
                onMouseLeave={() => setShowPopup(false)}
              >
                <span className="w-[120px] overflow-hidden text-ellipsis whitespace-nowrap font-bold flex items-center">
                  <span className="mr-1">{user.firstName}</span>
                  <span>{user.lastName}</span>
                </span>
                <span className="w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-[#888888]">
                  {user.primaryEmailAddress
                    ? user.primaryEmailAddress.emailAddress
                    : "No email available"}
                </span>
              </div>
            )}
            {showPopup && user && (
              <div className="absolute bottom-[60px] mb-2 text-xs w-auto p-2 bg-white border border-gray-300 shadow-lg z-10">
                <div className="flex flex-col">
                  <div>
                    <span className="mr-1">{user.firstName}</span>
                    <span>{user.lastName}</span>
                  </div>
                  {user.primaryEmailAddress
                    ? user.primaryEmailAddress.emailAddress
                    : "No email available"}
                </div>
              </div>
            )}
            <SignOutButton redirectUrl="/admin">
              <button className="group hover:bg-[#BFDBF7] rounded">
                <img
                  src={LogoutBlue}
                  className="hidden group-hover:block"
                  style={{ width: "35px", height: "35px", padding: "5px" }}
                ></img>
                <img
                  src={LogoutGray}
                  className="block group-hover:hidden"
                  style={{ width: "35px", height: "35px", padding: "5px" }}
                ></img>
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>

      {/* Main content with left margin equal to the nav bar width */}
      <div
        className="p-4 bg-gray-100/50 min-h-screen"
        style={{ marginLeft: navBarWidth }}
      >
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
