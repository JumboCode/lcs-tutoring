"use client";
import { useState } from "react";

import { IBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { IoMdCall } from "react-icons/io";

export default function TuteeInfoBox({ box_props }: { box_props: IBoxProps }) {
  const {
    date,
    first_name,
    last_name,
    email,
    subject,
    grade,
    gender,
    tutoring_mode,
    special_needs,
    parent_first_name,
    parent_last_name,
    phone,
  } = box_props;
  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
  };

  return (
    <div className="w-[900px] h-auto border bg-[#FFFFFF] flex flex-col text-left">
      <div className="flex flex-row text-[black] px-8 justify-start h-[98px] items-center">
        <span className="pl-3 w-1/4">{date}</span>
        <div className="w-1/4">
          <p>
            {first_name} {last_name}
          </p>
          <div className="text-[#888888] flex items-center gap-x-2">
            <BsEnvelope />
            <p>{email}</p>
          </div>
        </div>
        <span className="pl-3 w-1/4">{subject}</span>
        <div className="w-1/4 flex flex-row justify-between">
          <span>{grade}</span>
          <button
            className="flex flex-row items-center"
            onClick={handleToggleDescription}
          >
            <div
              style={{ color: "#888888", transition: "transform 0.3s" }}
              className={`transform ${isRotated ? "rotate-90" : ""}`}
            >
              <IoIosArrowForward size={20} />
            </div>
            <span className="text-[#888888] ml-1">Details</span>
          </button>
        </div>
      </div>

      {showDescription && (
        <div className="flex flex-col border-t border-gray-200">
          <div className="px-8 flex flex-row h-[30px] items-center bg-gray-100 justify-start">
            <span className="text-gray-500 pl-3 w-1/4">Gender</span>
            <span className="text-gray-500 w-1/4">Tutoring Mode</span>
            <span className="text-gray-500 pl-3 w-1/4">Special Needs</span>
            <span className="text-gray-500 w-1/4">Parent Information</span>
          </div>
          <div className="px-8 flex flex-row h-[80px] justify-start items-center">
            <span className="pl-3 w-1/4">{gender}</span>
            <span className="w-1/4">{tutoring_mode}</span>
            <span className="pl-3 w-1/4">{special_needs}</span>
            <div className="w-1/4 flex flex-col">
              <span>
                {parent_first_name} {parent_last_name}
              </span>
              <div
                className="flex flex-row gap-x-2 items-center"
                style={{ color: "#6B7280" }}
              >
                <IoMdCall />
                <span className="text-gray-500">{phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
