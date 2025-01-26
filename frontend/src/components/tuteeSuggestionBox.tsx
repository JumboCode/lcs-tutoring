"use client";

import { tuteeInfo } from "../types";
import { BsEnvelope } from "react-icons/bs";

export default function TuteeSuggestionBox({
  tutee_info,
}: {
  tutee_info: tuteeInfo;
}) {
  const {
    first_name,
    last_name,
    email,
    subject,
    grade,
    special_needs,
    tutoring_mode,
    notes,
  } = tutee_info;

  return (
    
    <div className="font-interBlack border bg-[#FFFFFF] flex flex-col text-left rounded-md w-full">
      <span className="text-center font-interBlack text-lg pt-2">
        {first_name} {last_name}
      </span>
      <div
        className="flex items-center justify-center text-center pb-2"
        style={{ color: "#6B7280" }}
      >
        <BsEnvelope />
        <span className="pl-2 text-sm font-interblack text-gray-500">
          {email}
        </span>
      </div>
      <div className="py-1 font-interBlack flex flex-row text-gray-500 px-8 bg-gray-100 justify-start items-center">
        <span className="w-1/2">Grade</span>
        <span className="w-1/2">Subject</span>
      </div>
      <div className="py-2 font-interBlack flex flex-row text-[black] px-8 justify-start items-center">
        <span className="w-1/2">{grade}</span>
        <span className="w-1/2">{subject}</span>
      </div>
      <div className="py-1 font-interBlack flex flex-row text-gray-500 px-8 bg-gray-100 justify-start items-center">
        <span className="w-1/2">Special Needs</span>
        <span className="w-1/2">Tutoring Mode</span>
      </div>
      <div className="py-2 font-interBlack flex flex-row text-[black] px-8 justify-start items-center">
        <span className="w-1/2">{special_needs}</span>
        <span className="w-1/2">{tutoring_mode}</span>
      </div>
      {notes && (
        <>
        <div className="py-1 font-interBlack flex flex-row text-[#D70000] px-8 bg-[#FFD6D6] justify-start items-center">
          Special Request:
        </div>
        <div className="py-2 px-8 pb-2">
          {notes}
        </div>
        </>
      )}
    </div>
  );
}
