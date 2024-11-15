"use client";
import { useState } from "react";

import { tuteeBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";

const STYLES = {
  colors: {
    textGray: "#888888",
    phoneGray: "#6B7280",
    evenBackground: "#FAFCFE",
  },
  transitions: {
    arrow: "transform 0.3s",
    colors: "transition-colors duration-150",
  },
} as const;

type TuteeInfoBoxProps = {
  box_props: tuteeBoxProps;
  bgColor: string;
};

export default function TuteeInfoBox({
  box_props,
  bgColor,
}: TuteeInfoBoxProps) {
  const {
    date,
    first_name,
    last_name,
    parent_email,
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
    <div className={`h-auto border-b-1 text-left ${STYLES.transitions.colors}`}>
      <table className="table-fixed w-full">
        <thead>
          <tr className={`h-[80px] ${bgColor} border-b`}>
            <th className="font-normal w-1/5 px-3">{date}</th>
            <th className="font-normal w-1/5">
              <p className="">
                {first_name} {last_name}
              </p>
              <div className="text-[#888888] flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <BsEnvelope />
                </div>
                <p className="max-w-full overflow-hidden text-ellipsis hover:text-clip hover:overflow-visible hover:whitespace-normal hover:break-words">
                  {parent_email}
                </p>
              </div>
            </th>
            <th className="font-normal w-1/5">{subject}</th>
            <th className="w-1/5">
              <div className="font-normal items-center justify-center">
                <span>K-{grade}</span>
              </div>
            </th>
            <th className="w-1/5">
              <div className="flex items-center flex-row">
                <button
                  className="flex items-center text-[#888888] hover:text-gray-600"
                  onClick={handleToggleDescription}
                >
                  <div
                    style={{
                      transition: STYLES.transitions.arrow,
                    }}
                    className={`transform ${isRotated ? "rotate-90" : ""}`}
                  >
                    <IoIosArrowForward size={20} />
                  </div>
                  <span className="ml-2 p-0 font-normal">Details</span>
                </button>
                <span
                  style={{ color: STYLES.colors.textGray }}
                  className="mb-2 ml-5 p-0 text-lg"
                >
                  {" "}
                  ...{" "}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        {showDescription && (
          <tbody className="bg-inherit">
            <tr className="h-[35px] bg-gray-100/50 border-b text-sm">
              <td className="text-gray-400 px-3 w-1/5">Gender</td>
              <td className="text-gray-400 w-1/5">Tutoring Mode</td>
              <td className="text-gray-400 w-1/5">Special Needs</td>
              <td className="text-gray-400 w-1/5">Parent Information</td>
              <td className="text-gray-400 w-1/5"></td>
            </tr>
            <tr className="h-[55px] border-b text-sm">
              <td className="px-3 w-1/5">{gender}</td>
              <td className="w-1/5">{tutoring_mode}</td>
              <td className="w-1/5">{special_needs}</td>
              <td className="w-1/5">
                <div className="flex flex-col">
                  <span>
                    {parent_first_name} {parent_last_name}
                  </span>
                  <div
                    className="flex items-center gap-x-2"
                    style={{ color: STYLES.colors.phoneGray }}
                  >
                    <FiPhone />
                    <span>{phone}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
