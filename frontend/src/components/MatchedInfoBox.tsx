"use client";
import { useState } from "react";
import { tuteeBoxProps, tutorBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { BsCheck2 } from "react-icons/bs";

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

type MatchedInfoBoxProps = {
  tutee_props: tuteeBoxProps;
  tutor_props: tutorBoxProps;
  bgColor: string;
  date: string;
};

export default function MatchedInfoBoxbox_props({
  tutee_props,
  tutor_props,
  bgColor,
  date,
}: MatchedInfoBoxProps) {
  const { first_name, last_name, email } = tutor_props;

  const {
    tutee_first_name,
    tutee_last_name,
    parent_email,
    tutoring_mode,
    special_needs,
    subject,
    grade,
  } = tutee_props;

  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [showParentPopup, setShowParentPopup] = useState(false);

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
  };

  return (
    <div
      className={`odd:bg-[${bgColor}] even:bg-[${STYLES.colors.evenBackground}] w-100 h-auto rounded-lg border-b-1 text-left ${STYLES.transitions.colors} my-2`}
    >
      <table className="table-fixed w-full">
        <thead>
          <tr className={`h-[80px] border-b`}>
            <th className="w-1/5 px-3 font-normal">{date}</th>
            <th className="w-1/5 font-normal">
              <p>
                {first_name} {last_name}
              </p>
              <div className="text-[#888888] relative flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <BsEnvelope />
                </div>
                <p
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  onMouseEnter={() => setShowStudentPopup(true)}
                  onMouseLeave={() => setShowStudentPopup(false)}
                >
                  {email}
                </p>
                {showStudentPopup && (
                  <div className="absolute top-full mt-2 w-auto p-2 bg-white border border-gray-300 shadow-lg">
                    {email}
                  </div>
                )}
              </div>
            </th>
            <th className="w-1/5 font-normal">
              <p>
                {tutee_first_name} {tutee_last_name}
              </p>
              <div className="text-[#888888] relative flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <BsEnvelope />
                </div>
                <p
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  onMouseEnter={() => setShowParentPopup(true)}
                  onMouseLeave={() => setShowParentPopup(false)}
                >
                  {parent_email}
                </p>
                {showParentPopup && (
                  <div className="absolute top-full mt-2 w-auto p-2 bg-white border border-gray-300 shadow-lg">
                    {parent_email}
                  </div>
                )}
              </div>
            </th>
            <th className="w-1/5">
              <div className="flex flex-grow justify-center items-center">
                <button
                  onClick={() => setEmailSent(true)}
                  disabled={emailSent}
                  className={`w-[150px] flex justify-center items-center rounded-full border-2 text-sm py-2 transition-colors duration-150 ${
                    emailSent
                      ? "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed"
                      : "border-[#1F3A68] text-[#1F3A68] bg-[#f1f7fd] hover:bg-[#e5f1fc]"
                  }`}
                >
                  {emailSent ? (
                    <BsCheck2 size={20} />
                  ) : (
                    <BsEnvelope size={20} />
                  )}

                  <p className="font-medium ml-2">
                    {emailSent ? "Sent Email" : "Send Email"}
                  </p>
                </button>
              </div>
            </th>
            <th className="w-1/5">
              <div className="flex items-center justify-center flex-row">
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
            <tr className={`h-[35px] bg-gray-100/50 border-b`}>
              <td className="text-gray-400 px-3 w-1/5">Subject</td>
              <td className="text-gray-400 w-1/5">Grade</td>
              <td className="text-gray-400 w-1/5">Special Needs</td>
              <td className="text-gray-400 w-1/5">Tutoring Mode</td>
              <td className="text-gray-400 w-1/5"></td>
            </tr>
            <tr className={`h-[55px] border-b`}>
              <td className="px-3 w-1/5">{subject}</td>
              <td className="w-1/5">{grade}</td>
              <td className="w-1/5">{special_needs}</td>
              <td className="w-1/5">{tutoring_mode}</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
