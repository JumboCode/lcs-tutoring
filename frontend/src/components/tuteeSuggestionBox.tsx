"use client";

interface boxProps {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  grade: string;
  special_needs: string;
  tutoring_mode: string;
}

import { BsEnvelope } from "react-icons/bs";

export default function TuteeSuggestionBox({
  box_props,
}: {
  box_props: boxProps;
}) {
  const {
    first_name,
    last_name,
    email,
    subject,
    grade,
    special_needs,
    tutoring_mode,
  } = box_props;

  return (
    <div className="w-[300px] h-auto font-interBlack border bg-[#FFFFFF] flex flex-col text-left rounded-md">
      <span className="w-full text-center font-interBlack text-lg pt-2">
        {first_name} {last_name}
      </span>
      <div
        className="w-full flex items-center justify-center text-center pb-2"
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
    </div>
  );
}
