"use client";
import { useState } from "react";
import { IBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { BsCheck2 } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import approved_match from "../assets/images/nav_icons/approved_match.svg";
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
  sizes: {
    headerHeight: "98px",
    detailsHeaderHeight: "30px",
    detailsRowHeight: "80px",
    arrowSize: 20,
  },
} as const;

interface IMatchedInfoBox extends IBoxProps {
  matched: boolean;
  handleEmailSend: (index: number) => void;
}

export default function MatchedInfoBox({
  box_props,
  handleEmailSend,
  index,
}: {
  box_props: IMatchedInfoBox;
  index: number;
}) {
  const {
    date,
    tutor_first_name,
    tutor_last_name,
    tutee_first_name,
    tutee_last_name,
    tutor_email,
    tutee_email,
    status,
    grade,
    subject,
    tutoring_mode,
    special_needs,
  } = box_props;

  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  console.log(emailSent);

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
  };

  const handleEmailClick = () => {
    handleEmailSend(index);
    setEmailSent(true);
  };

  return (
    <div
      className={`odd:bg-white even:bg-[${STYLES.colors.evenBackground}] w-100 h-auto font-interBlackrounded-lg border-b-1 text-left ${STYLES.transitions.colors} my-2`}
    >
      <table className="w-full">
        <thead>
          <tr className={`h-[${STYLES.sizes.headerHeight}] border-b`}>
            <th className="w-1/5 px-3">{date}</th>
            <th className="w-1/5">
              <p>
                {tutor_first_name} {tutor_last_name}
              </p>
              <div className="text-[#888888] flex items-center gap-x-2">
                <BsEnvelope />
                <p>{tutor_email}</p>
              </div>
            </th>
            <th className="w-1/5 px-3">
              <p>
                {tutee_first_name} {tutee_last_name}
              </p>
              <div className="text-[#888888] flex items-center gap-x-2">
                <BsEnvelope />
                <p>{tutee_email}</p>
              </div>
            </th>
            <th className="w-1/5">
              <div className="flex flex-grow justify-center items-center">
                <button
                  onClick={() => setEmailSent(true)}
                  disabled={emailSent}
                  className={`flex justify-center items-center rounded-full px-4 border-2 text-sm py-2 transition-colors duration-150 ${
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

                  <p className="font-thin ml-2">
                    {emailSent ? "Sent Email" : "Send Email"}
                  </p>
                </button>
              </div>
            </th>
            <th className="w-1/5">
              <div className="flex items-center justify-center flex-row">
                <button
                  className="flex items-center"
                  onClick={handleToggleDescription}
                >
                  <div
                    style={{
                      color: STYLES.colors.textGray,
                      transition: STYLES.transitions.arrow,
                    }}
                    className={`transform ${isRotated ? "rotate-90" : ""}`}
                  >
                    <IoIosArrowForward size={STYLES.sizes.arrowSize} />
                  </div>
                </button>
                <div className="flex-row flex items-center align-middle justify-center">
                  <span
                    style={{ color: STYLES.colors.textGray }}
                    className="ml-2 p-0"
                  >
                    Details
                  </span>
                  <span
                    style={{ color: STYLES.colors.textGray }}
                    className="mb-2 ml-5 p-0 text-lg"
                  >
                    {" "}
                    ...{" "}
                  </span>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        {showDescription && (
          <tbody className="bg-inherit">
            <tr
              className={`h-[${STYLES.sizes.detailsHeaderHeight}] bg-gray-100/50 border-b`}
            >
              <td className="text-gray-400 font-thin px-3 w-1/5">Subject</td>
              <td className="text-gray-400 w-1/5 font-thin">Grade</td>
              <td className="text-gray-400 px-3 w-1/5">Special Needs</td>
              <td className="text-gray-400 w-1/5">Tutoring Mode</td>
              <td className="text-gray-400 w-1/5"></td>
            </tr>
            <tr className={`h-[${STYLES.sizes.detailsRowHeight}] border-b`}>
              <td className="px-3 w-1/5">{subject}</td>
              <td className="w-1/5">K-{grade}</td>
              <td className="px-3 w-1/5">{special_needs}</td>
              <td className="w-1/5">{tutoring_mode}</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
