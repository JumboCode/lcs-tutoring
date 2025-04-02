import config from "../config.ts";
("use client");
import { useEffect, useState } from "react";
import { tuteeBoxProps, tutorBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { BsCheck2 } from "react-icons/bs";
import FLAG from "../assets/images/admin_view/flag.svg";
import RED_FLAG from "../assets/images/admin_view/red_flag.svg";
import deleteIcon from "../assets/images/delete.svg";
import unmatch_pair from "../assets/images/approved_matches/unmatch_pair.svg";

const STYLES = {
  colors: {
    textGray: "#888888",
    phoneGray: "#6B7280",
    evenBackground: "#FAFCFE",
    flaggedBackground: "black",
  },
  transitions: {
    arrow: "transform 0.3s",
    colors: "transition-colors duration-150",
  },
} as const;

type MatchedInfoBoxProps = {
  tutee_props: tuteeBoxProps;
  tutor_props: tutorBoxProps;
  matchId: string;
  flagged: boolean;
  bgColor: string;
  pair_date: string;
  inactive_date?: string;
  isActive: boolean;
  sent_email: boolean;
  onUnpair?: (matchId: string) => void;
};

export default function MatchedInfoBoxbox_props({
  tutee_props,
  tutor_props,
  matchId,
  flagged,
  pair_date,
  inactive_date,
  isActive,
  sent_email,
  onUnpair,
}: MatchedInfoBoxProps) {
  const { first_name, last_name, email } = tutor_props;

  const {
    tutee_first_name,
    tutee_last_name,
    parent_email,
    tutoring_mode,
    special_needs,
    subjects,
    grade,
  } = tutee_props;
  const [isCurrentlyFlagged, setIsCurrentlyFlagged] = useState(flagged);
  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [emailSent, setEmailSent] = useState(sent_email);
  console.log("email sent: ", emailSent);
  console.log("SENT EMAIL: ", sent_email);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [showParentPopup, setShowParentPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const unmatchPair = () => {
    setIsDropdownOpen(false);

    console.log("about to fetch unmatch pair");

    fetch(`${config.backendUrl}/unmatch-pair/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (onUnpair) onUnpair(matchId);
      })
      .catch((error) => console.error(error));
  };

  const deletePair = () => {
    setIsDropdownOpen(false);
    fetch(`${config.backendUrl}/delete-pair/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (onUnpair) onUnpair(matchId);
      })
      .catch((error) => console.error(error));
  };

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
  };

  const handleSendEmail = async () => {
    setIsDropdownOpen(false);
    try {
      const response = await fetch(`${config.backendUrl}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId: matchId,
          tutorEmail: tutor_props.email,
          tuteeParentEmail: tutee_props.parent_email,
          //email_sent: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setEmailSent(true);
      localStorage.setItem(`emailSent-${matchId}`, "true");
    } catch (error) {
      console.error("Failed to send email!");
    }
  };

  useEffect(() => {
    const sentStatus = localStorage.getItem(`emailSent-${matchId}`);
    if (sentStatus === "true") {
      setEmailSent(true);
    }
  }, [matchId]);

  const handleToggleFlag = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/flag/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: matchId }),
      });
      if (response.ok) {
        setIsCurrentlyFlagged(!isCurrentlyFlagged);
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div
      className={`${
        isCurrentlyFlagged ? "bg-red-50" : "odd:bg-white even:bg-gray-50"
      } w-full h-auto border-b text-left transition-colors`}
    >
      <table className="table-fixed w-full">
        <thead>
          <tr className={`h-[80px] border-b`}>
            <th className="w-1/5 px-3 font-normal">
              {isCurrentlyFlagged && (
                <img src={RED_FLAG} className="w-4 h-4 inline-block mr-2" />
              )}
              <div className="flex flex-col">
                {inactive_date && (
                  <span className="font-medium">Inactive {inactive_date}</span>
                )}
                <span className="text-gray-500">Active {pair_date}</span>
              </div>
            </th>
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
                {isActive && (
                  <button
                    onClick={handleSendEmail}
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
                )}
                {!isActive && <span className="font-normal">N/A</span>}
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

                {isActive && (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="mb-2 ml-5 p-0 text-lg text-gray-400"
                    >
                      ...
                      <div
                        className={`transition-transform duration-300 ${
                          isDropdownOpen ? "scale-y-[-1]" : "scale-y-[1]"
                        }`}
                      ></div>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-1 bg-white rounded shadow min-w-[170px] z-50">
                        {/* <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100">
                        <div className="className=" mr-2 w-4 h-4 inline-block>
                          <BsTrashFill size={20} />
                        </div>
                        Remove Pair
                      </button> */}
                        {emailSent && (
                          <button
                            onClick={handleToggleFlag}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            {isCurrentlyFlagged ? (
                              <>
                                <img
                                  src={RED_FLAG}
                                  className="w-4 h-4 inline-block mr-2"
                                />
                                Unflag
                              </>
                            ) : (
                              <>
                                <img
                                  src={FLAG}
                                  className="w-4 h-4 inline-block mr-2"
                                />
                                Flag
                              </>
                            )}
                          </button>
                        )}
                        <button
                          className="flex flex-row w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={unmatchPair}
                        >
                          <img
                            src={unmatch_pair}
                            className="w-4 h-4 inline-block mr-2"
                          />
                          Unmatch Pair
                        </button>
                        <button
                          className="flex flex-row w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={deletePair}
                        >
                          <img
                            src={deleteIcon}
                            className="w-4 h-4 inline-block mr-2"
                          />
                          Delete Pair
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
              <td className="px-3 w-1/5">{subjects.join(", ")}</td>
              <td className="w-1/5">
                {grade == "0"
                  ? "Kindergarten"
                  : grade == "1"
                  ? "1st"
                  : grade == "2"
                  ? "2nd"
                  : grade == "3"
                  ? "3rd"
                  : grade + "th"}
              </td>
              <td className="w-1/5">{special_needs ? special_needs : "No"}</td>
              <td className="w-1/5">{tutoring_mode}</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
