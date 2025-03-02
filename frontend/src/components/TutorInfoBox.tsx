"use client";
import { useState } from "react";

import { tutorBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import TrashCan from "../assets/images/delete.svg";

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

type TutorInfoBoxProps = {
  box_props: tutorBoxProps;
  bgColor: string;
  isUnmatched: boolean;
  onDelete?: (tutor: tutorBoxProps) => void;
};

export default function TutorInfoBox({
  box_props,
  bgColor,
  isUnmatched,
  onDelete,
}: TutorInfoBoxProps) {
  const {
    id,
    date,
    first_name,
    last_name,
    email,
    subject_pref = [],
    pronouns,
    major,
    year_grad,
    phone,
    previous_tutee,
    grade_level_pref = [],
    num_tutees,
    disability_pref,
    tutoring_mode,
  } = box_props;
  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSubmit = () => {
    setIsDropdownOpen(false);
    fetch(`http://localhost:3000/move-tutor-to-history/${id}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (onDelete) onDelete(box_props);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={`h-auto border-b-1 text-left ${STYLES.transitions.colors}`}>
      <table className="table-fixed w-full">
        <thead>
          <tr className={`h-[80px] ${bgColor} border-b`}>
            <th className="font-normal w-1/5 px-3">{date}</th>
            <th className="font-normal w-1/5">
              <p>
                {first_name} {last_name}
              </p>
              <div className="text-[#888888] relative flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <BsEnvelope />
                </div>
                <p
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  onMouseEnter={() => setShowPopup(true)}
                  onMouseLeave={() => setShowPopup(false)}
                >
                  {email}
                </p>
                {showPopup && (
                  <div className="absolute top-full mt-2 w-auto p-2 bg-white border border-gray-300 shadow-lg">
                    {email}
                  </div>
                )}
              </div>
            </th>
            <th className="font-normal w-1/5">{id}</th>
            <th className="w-1/5">
              <div className="font-normal items-center justify-center">
                <span>{subject_pref.join(", ")}</span>
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

                {isUnmatched && (
                  <>
                    <button
                      style={{ color: STYLES.colors.textGray }}
                      className="mb-2 ml-5 p-0 text-lg"
                      onClick={toggleDropdown}
                    >
                      {" "}
                      ...{" "}
                      <div
                        className={`transition-transform duration-300 ${
                          isDropdownOpen ? "scale-y-[-1]" : "scale-y-[1]"
                        }`}
                      ></div>
                    </button>

                    {isDropdownOpen && (
                      <div className="flex flex-row whitespace-nowrap transform -translate-x-24 translate-y-10 text-gray-700 over:bg-gray-100 bg-white border border-gray-200 rounded-md shadow-lg px-4 py-2">
                        <button onClick={handleSubmit}>Delete Tutor</button>
                        <img src={TrashCan} className="mx-2" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </th>
          </tr>
        </thead>
        {showDescription && (
          <tbody className="bg-inherit">
            <tr className="h-[35px] bg-gray-100/50 border-b text-sm">
              <td className="text-gray-400 px-3 w-1/5">Pronouns</td>
              <td className="text-gray-400 w-1/5">Major</td>
              <td className="text-gray-400 w-1/5">Year of Grad</td>
              <td className="text-gray-400 w-1/5">Phone Number</td>
              <td className="text-gray-400 w-1/5"></td>
            </tr>
            <tr className="h-[55px] border-b text-sm">
              <td className="px-3 w-1/5">{pronouns}</td>
              <td className="w-1/5">{major}</td>
              <td className="w-1/5">{year_grad}</td>
              <td className="w-1/5">
                <div
                  className="flex items-center gap-x-2"
                  style={{ color: STYLES.colors.phoneGray }}
                >
                  <FiPhone />
                  <span>{phone}</span>
                </div>
              </td>
            </tr>
            <tr className="h-[35px] bg-gray-100/50 border-b text-sm">
              <td className="text-gray-400 px-3 w-1/5">Previous Tutee</td>
              <td className="text-gray-400 w-1/5">Grade Level</td>
              <td className="text-gray-400 w-1/5"># of Tutees</td>
              <td className="text-gray-400 w-1/5">Open to Disability</td>
              <td className="text-gray-400 w-1/5">Tutoring Mode</td>
            </tr>
            <tr className="h-[55px] border-b text-sm">
              <td className="px-3 w-1/5">
                {previous_tutee === true ? <span>Yes</span> : <span>No</span>}
              </td>
              <td className="w-1/5">{grade_level_pref.join(", ")}</td>
              <td className="w-1/5">{num_tutees}</td>
              <td className="w-1/5">
                {disability_pref === true ? <span>Yes</span> : <span>No</span>}
              </td>
              <td className="w-1/5">{tutoring_mode}</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
