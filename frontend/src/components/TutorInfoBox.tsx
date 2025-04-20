"use client";
import config from "../config.ts";
import { useState, useEffect, useRef } from "react";
import RED_FLAG from "../assets/images/admin_view/red_flag.svg";
import { tutorBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import TrashCan from "../assets/images/delete.svg";
import PriorityFlag from "../assets/images/admin_view/flag.svg";
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

type TutorInfoBoxProps = {
  box_props: tutorBoxProps;
  isUnmatched: boolean;
  isHistory: boolean;
  onDelete?: (tutor: tutorBoxProps) => void;
  onPermDelete?: (tutor: tutorBoxProps) => void;
};

export default function TutorInfoBox({
  box_props,
  isUnmatched,
  isHistory,
  onDelete,
  onPermDelete,
}: TutorInfoBoxProps) {
  const {
    id,
    date,
    history_date,
    first_name,
    last_name,
    email,
    subject_pref = [],
    pronouns,
    major,
    year_grad,
    phone,
    grade_level_pref = [],
    num_tutees,
    disability_pref,
    tutoring_mode,
    notes,
    priority,
  } = box_props;
  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isPriority, setIsPriority] = useState(false);
  const { handleAsyncOperation } = useRaceConditionHandler();

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    setIsDropdownOpen(false);

    await handleAsyncOperation(async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/move-tutor-to-history/${id}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to move tutor to history");
        }

        const data = await response.json();
        if (onDelete) onDelete(box_props);
        return data;
      } catch (error) {
        console.error("Error moving tutor to history:", error);
        throw error;
      }
    });
  };
  const checkPriorityFlag = async () => {
    console.log("priority");
    const POST_BODY = { tutor_id: id };
    console.log(POST_BODY);
    setIsDropdownOpen(false);
    const response = await fetch(`${config.backendUrl}/check-priority-flag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(POST_BODY),
    });
    const data = await response.json();
    console.log(data.priority);
    return data.priority;
  };
  const handleTogglePriority = async () => {
    console.log("priority toggle");
    const POST_BODY = { tutor_id: id };
    const response = await fetch(`${config.backendUrl}/toggle-priority-flag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(POST_BODY),
    });
    const data = await response.json();
    setIsPriority(data.priority);
    setIsDropdownOpen(false);
  };
  const handlePermDelete = () => {
    console.log("permdelete");
    setIsDropdownOpen(false);
    fetch(`${config.backendUrl}/perm-delete-tutor/${id}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (onPermDelete) onPermDelete(box_props);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    checkPriorityFlag().then((priority) => {
      setIsPriority(priority);
    });
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
    };
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`h-auto border-b-1 text-left ${STYLES.transitions.colors}  ${
        isPriority ? "bg-yellow-100" : "odd:bg-white even:bg-gray-50"
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
              </div>{" "}
            </th>
            <th className="font-normal w-1/5">
              <span>
                {first_name} {last_name}
              </span>
              <span className="text-[#D70000]">
                {notes && ` *`}
                {priority && (
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
                      <div className="flex flex-col whitespace-nowrap transform -translate-x-24 translate-y-10 text-gray-700 over:bg-gray-100 bg-white border border-gray-200 rounded-md shadow-lg px-4 py-2">
                        <div className="flex items-center mb-2">
                          <img src={TrashCan} className="w-4 h-4 mr-2" />
                          <button onClick={handleDelete} className="mr-2">
                            Delete Tutor
                          </button>
                        </div>
                        <div className="flex items-center mb-2">
                          <img src={PriorityFlag} className="w-4 h-4 mr-2" />
                          <button
                            onClick={handleTogglePriority}
                            className="mr-2"
                          >
                            {isPriority ? "Deprioritize" : "Priority"} Tutor
                          </button>
                        </div>
                      </div>
                    )}
                    {isDropdownOpen && isHistory && (
                      <div className="flex flex-row whitespace-nowrap transform -translate-x-24 translate-y-10 text-gray-700 over:bg-gray-100 bg-white border border-gray-200 rounded-md shadow-lg px-4 py-2">
                        <button onClick={handlePermDelete}>
                          Permanently Delete
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
              <td className="text-gray-400 w-1/5">Grade Level Preferences</td>
              <td className="text-gray-400 w-1/5"># of Tutees</td>
              <td className="text-gray-400 w-1/5">Open to Disability</td>
              <td className="text-gray-400 w-1/5">Tutoring Mode</td>
            </tr>
            <tr className="h-[55px] border-b text-sm">
              <td className="px-3 w-1/5">asd</td>
              <td className="w-1/5">{grade_level_pref.join(", ")}</td>
              <td className="w-1/5">{num_tutees}</td>
              <td className="w-1/5">
                {disability_pref === true ? <span>Yes</span> : <span>No</span>}
              </td>
              <td className="w-1/5">{tutoring_mode}</td>
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
