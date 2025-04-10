"use client";
import config from "../config.ts";
import { useState } from "react";
import RED_FLAG from "../assets/images/admin_view/red_flag.svg";
import { tuteeBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import TrashCan from "../assets/images/delete.svg";
import { useRaceConditionHandler } from "../hooks/useRaceConditionHandler";

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
  isUnmatched: boolean;
  onDelete?: (tutee: tuteeBoxProps) => void;
};

export default function TuteeInfoBox({
  box_props,
  isUnmatched,
  onDelete,
}: TuteeInfoBoxProps) {
  const {
    id,
    date,
    history_date,
    tutee_first_name,
    tutee_last_name,
    parent_email,
    subjects,
    grade,
    gender,
    tutoring_mode,
    special_needs,
    parent_first_name,
    parent_last_name,
    parent_phone,
    notes,
    flagged,
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

  const { handleAsyncOperation } = useRaceConditionHandler();

  const handleSubmit = async () => {
    setIsDropdownOpen(false);
    console.log("id from front end: ", id);

    await handleAsyncOperation(async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/move-tutee-to-history/${id}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to move tutee to history");
        }

        const data = await response.json();
        if (onDelete) onDelete(box_props);
        return data;
      } catch (error) {
        console.error("Error moving tutee to history:", error);
        throw error;
      }
    });
  };

  return (
    <div
      className={`h-auto border-b-1 text-left ${STYLES.transitions.colors} odd:bg-white even:bg-gray-50`}
    >
      <table className="table-fixed w-full">
        <thead>
          <tr className={`h-[80px] border-b-2`}>
            <th className="font-normal w-1/5 px-3">
              <div className="flex flex-col">
                {history_date && (
                  <span className="font-medium">Inactive {history_date}</span>
                )}
                <span className="text-gray-500">Joined {date}</span>
              </div>
            </th>
            <th className="font-normal w-1/5">
              <span>
                {tutee_first_name} {tutee_last_name}
              </span>
              <span className="text-[#D70000]">
                {notes && ` *`}
                {flagged && (
                  <img
                    src={RED_FLAG}
                    className="w-4 h-4 inline-block ml-3 mr-2"
                  />
                )}
              </span>
              <div className="text-[#888888] relative flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <BsEnvelope />
                </div>
                <p
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  onMouseEnter={() => setShowPopup(true)}
                  onMouseLeave={() => setShowPopup(false)}
                >
                  {parent_email}
                </p>
                {showPopup && (
                  <div className="absolute top-full mt-2 w-auto p-2 bg-white border border-gray-300 shadow-lg">
                    {parent_email}
                  </div>
                )}
              </div>
            </th>
            <th className="font-normal w-1/5">{subjects.join(", ")}</th>
            <th className="w-1/5">
              <div className="font-normal items-center justify-center">
                <span>
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
                        <button onClick={handleSubmit} className="">
                          Delete Tutee
                        </button>
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
              <td className="text-gray-400 px-3 w-1/5">Gender</td>
              <td className="text-gray-400 w-1/5">Tutoring Mode</td>
              <td className="text-gray-400 w-1/5">Special Needs</td>
              <td className="text-gray-400 w-1/5">Parent Information</td>
              <td className="text-gray-400 w-1/5"></td>
            </tr>
            <tr className="h-[55px] border-b text-sm">
              <td className="px-3 w-1/5">{gender}</td>
              <td className="w-1/5">{tutoring_mode}</td>
              <td className="w-1/5">{special_needs ? special_needs : "N/A"}</td>
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
                    <span>{parent_phone}</span>
                  </div>
                </div>
              </td>
            </tr>
            {notes && (
              <tr className="bg-[#FFD6D6] text-sm">
                <td className="text-[#D70000] px-3" colSpan={5}>
                  <strong>Special Request:</strong> {notes}
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>
    </div>
  );
}
