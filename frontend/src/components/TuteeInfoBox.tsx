"use client";
import { useState } from "react";

import { IBoxProps } from "../types";
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
  sizes: {
    headerHeight: "98px",
    detailsHeaderHeight: "30px",
    detailsRowHeight: "80px",
    arrowSize: 20,
  },
} as const;

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
    matched,
  } = box_props;
  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
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
                {first_name} {last_name}
              </p>
              <div className="text-[#888888] flex items-center gap-x-2">
                <BsEnvelope />
                <p>{email}</p>
              </div>
            </th>
            <th className="w-1/5 px-3">{subject}</th>
            <th className="w-1/5">
              <div className="flex flex-grow vertical-align-middle items-center justify-center">
                <span>K-{grade}</span>
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
              <td className="text-gray-400 font-thin px-3 w-1/5">Gender</td>
              <td className="text-gray-400 w-1/5 font-thin">Tutoring Mode</td>
              <td className="text-gray-400 px-3 w-1/5">Special Needs</td>
              <td className="text-gray-400 w-1/5">Parent Information</td>
              <td className="text-gray-400 w-1/5"></td>
            </tr>
            <tr className={`h-[${STYLES.sizes.detailsRowHeight}] border-b`}>
              <td className="px-3 w-1/5">{gender}</td>
              <td className="w-1/5">{tutoring_mode}</td>
              <td className="px-3 w-1/5">{special_needs}</td>
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
