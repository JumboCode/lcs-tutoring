// import { useState } from "react";

import { RiArrowDropDownLine } from "react-icons/ri";
import elephantLogo from "../assets/images/elephant.svg";

export default function Header() {
  return (
    <>
      <header
        className={
          "bg-[#dbeafa] flex w-screen py-3 px-16 justify-between items-center"
        }
      >
        <img className={"h-12 w-12"} src={elephantLogo} />
        <ul className="flex flex-row space-x-8">
          <li className="hover:text-gray-700 hover:border-b-2 hover:border-black">
            About
          </li>
          <li className="hover:text-gray-700 hover:border-b-2 hover:border-black">
            Team
          </li>
          <div className={"flex flex-row items-center"}>
            <li className="hover:text-gray-700 hover:border-b-2 hover:border-black">
              Forms
            </li>
            <RiArrowDropDownLine className="" />
          </div>
        </ul>
      </header>
    </>
  );
}
