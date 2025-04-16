"use client";

import { tuteeInfo } from "../types";
import { BsEnvelope } from "react-icons/bs";
import { useState } from "react";
import { Flag } from "lucide-react";
// const BG_COLOR = "#fbfbfb";

export default function TuteeSuggestionBox({
  tutee_info,
  isSelected,
  onSelect,
}: {
  tutee_info: tuteeInfo;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const {
    first_name,
    last_name,
    email,
    subjects = [],
    grade,
    special_needs,
    tutoring_mode,
    flagged,
    notes,
  } = tutee_info;

  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="relative border rounded-lg min-h-[250px] h-full w-full max-w-full">
      <div className="flex gap-4 items-center ml-5 p-2">
        <input
          type="radio"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 mt-1.5 accent-gray-500"
        />
        <div>
          <div className="text-lg font-bold flex flex-col items-start gap-2">
            <div className="flex items-center">
              {first_name} {last_name}
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <BsEnvelope size={12} color="mr-1" />
            <span className="text-sm">{email}</span>
          </div>
        </div>
      </div>
      {flagged && (
        <div className="bg-[#FEFDF2] p-2 rounded w-5/6 mx-auto">
          <div className="flex items-center gap-2 ">
            <Flag className="text-[#F3CA42]" />
            <span className="text-sm font-normal text-[#F3CA42]">
              Priority Selection
            </span>
          </div>
        </div>
      )}

      {/*Display Tutee Special Request in box*/}
      {notes && (
        <div className="mx-2 mb-2 px-4 py-2 bg-red-100 border-red-500 text-black break-words">
          <strong className="text-red-600 text-sm">Special Request: </strong>
          <span className="text-sm">{notes}</span>
        </div>
      )}

      <div className="py-1 flex flex-row text-gray-500 px-8 bg-[#fbfbfb] justify-start items-center mx-2">
        <span className="w-1/2">Grade</span>
        <span className="w-1/2">Subjects</span>
      </div>
      <div className="py-2 flex flex-row text-[black] px-8 justify-start items-center mx-2">
        <span className="w-1/2">
          {grade == "0"
            ? "Kindergarten"
            : grade == "1"
            ? "1st"
            : grade == "2"
            ? "2nd"
            : grade == "3"
            ? "3rd"
            : grade + "th"}
        </span>
        <p
          className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full break-words"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
        >
          {subjects.join(", ")}
        </p>
        {showPopup && (
          <div className="absolute mt-[70px] ml-[90px] w-auto p-2 bg-white border border-gray-300 shadow-lg">
            {subjects.join(", ")}
          </div>
        )}
      </div>
      <div className="py-1 flex flex-row text-gray-500 px-8 bg-[#fbfbfb] justify-start items-center mx-2">
        <span className="w-1/2">Special Needs</span>
        <span className="w-1/2">Tutoring Mode</span>
      </div>
      <div className="py-2 flex flex-row text-[black] px-8 justify-start items-center mx-2">
        <span className="w-1/2">{special_needs ? special_needs : "N/A"}</span>
        <span className="w-1/2">{tutoring_mode}</span>
      </div>
    </div>
  );
}
