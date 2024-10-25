// import { useState } from "react";

import { RiArrowDropDownLine } from "react-icons/ri";
import elephantLogo from "../assets/images/elephant.svg"

export default function Header() {

  return (
    <>
        {/* <header className={"bg-[#dbeafa] m-5 p-2 rounded-lg flow-root"}> */}
        <header className={"bg-[#dbeafa] flex m-3 py-3 px-16 justify-between items-center"}>
            <img className={"h-8 w-8"} src={elephantLogo}/>
            <div className={"flex flex-row space-x-4"}>
                <p>About</p>
                <p>Team</p>
                <div className={"flex flex-row items-center"}>
                    <a>Forms</a>
                    <RiArrowDropDownLine className={"h-5 w-5"}/>
                </div>
            </div>
        </header>
        {/* </header> */}
    </>
  );
}
