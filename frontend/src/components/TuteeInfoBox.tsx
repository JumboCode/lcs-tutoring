"use client";
import config from "../config.ts";
import { useState, useEffect, useRef } from "react";
import YELLOW_FLAG from "../assets/images/admin_view/yellow_flag.svg";
import { tuteeBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import TrashCan from "../assets/images/delete.svg";
import PriorityFlag from "../assets/images/admin_view/flag.svg";
import { useRaceConditionHandler } from "../hooks/useRaceConditionHandler";

import { useAuth } from "@clerk/clerk-react";

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
  isHistory: boolean;
  onDelete?: (tutee: tuteeBoxProps) => void;
  onPermDelete?: (tutee: tuteeBoxProps) => void;
  onPriority?: (tutee: tuteeBoxProps) => void;
};

export default function TuteeInfoBox({
  box_props,
  isUnmatched,
  isHistory,
  onDelete,
  onPermDelete,
  onPriority,
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
    priority,
  } = box_props;
  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showTuteeDeleteDialog, setShowTuteeDeleteDialog] = useState(false);
  const [showTuteePermDeleteDialog, setShowTuteePermDeleteDialog] =
    useState(false);

  // auth functions
  const { handleAsyncOperation } = useRaceConditionHandler();
  const { getToken } = useAuth();

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    setIsDropdownOpen(false);

    await handleAsyncOperation(async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${config.backendUrl}/move-tutee-to-history/${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  const handlePermDelete = async () => {
    try {
      setIsDropdownOpen(false);
      const token = await getToken();
      const response = await fetch(
        `${config.backendUrl}/perm-delete-tutee/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to permanently delete tutee");
      }

      const data = await response.json();
      if (onPermDelete) onPermDelete(box_props);
      return data;
    } catch (error) {
      console.error("Error permanently deleting tutee:", error);
      throw error;
    }
  };

  const handleTogglePriority = async () => {
    console.log("priority toggle");
    const token = await getToken();
    const response = await fetch(
      `${config.backendUrl}/toggle-tutee-priority-flag/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (onPriority) onPriority(box_props);
    const data = await response.json();
    if (!response.ok) {
      console.error("Error toggling priority flag:", data.message);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`h-auto border-b-1 text-left ${STYLES.transitions.colors} ${
        priority ? "bg-[#FFFCF0]" : "odd:bg-white even:bg-gray-50"
      }`}
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
                {priority && (
                  <img
                    src={YELLOW_FLAG}
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

                {(isUnmatched || isHistory) && (
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

                    {isDropdownOpen && !isHistory && (
                      <div className="absolute z-50 flex flex-col whitespace-nowrap transform translate-x-4 translate-y-14 text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg">
                        <button
                          className="flex items-center hover:bg-gray-100 cursor-pointer px-3 py-2"
                          onClick={() => setShowTuteeDeleteDialog(true)}
                        >
                          <img
                            src={TrashCan}
                            className="w-4 h-4 inline-block mr-2"
                          />
                          <span>Delete Tutee</span>
                        </button>
                        <button
                          onClick={handleTogglePriority}
                          className="flex items-center hover:bg-gray-100 cursor-pointer px-3 py-2"
                        >
                          <img
                            src={PriorityFlag}
                            className="w-4 h-4 inline-block mr-2"
                          />
                          {priority ? "Deprioritize" : "Prioritize"} Tutee
                        </button>
                      </div>
                    )}

                    {isDropdownOpen && isHistory && (
                      <div className="absolute transform translate-y-10 -translate-x-2 z-50 w-max text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg">
                        <button
                          className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setShowTuteePermDeleteDialog(true)}
                        >
                          <img src={TrashCan} className="w-4 h-4" />
                          <span>Permanently Delete</span>
                        </button>
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

      {showTuteeDeleteDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this tutee?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowTuteeDeleteDialog(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-[#6a7eae] text-white hover:bg-[#313F60]"
                onClick={() => {
                  handleSubmit();
                  setShowTuteeDeleteDialog(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showTuteePermDeleteDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Permanent Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this tutee?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowTuteePermDeleteDialog(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-[#6a7eae] text-white hover:bg-[#313F60]"
                onClick={() => {
                  handlePermDelete();
                  setShowTuteePermDeleteDialog(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
