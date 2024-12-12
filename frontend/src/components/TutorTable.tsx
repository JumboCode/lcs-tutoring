import TutorInfoBox from "./TutorInfoBox";
import { useState, useEffect } from "react";
import { tutorBoxProps } from "../types";

// Add these constants at the top of the file, after imports
const TABS = {
  UNMATCHED: 0,
  MATCHED: 1,
  HISTORY: 2,
} as const;

const COLORS = {
  ACTIVE: "text-[#8DAADD]",
  HISTORY: "text-gray-500",
  ACTIVE_BG: "bg-[#8DAADD] text-white",
  HISTORY_BG: "bg-[#F1F7FD] text-gray-500",
  TABLE_BG: "bg-[#FAFCFE]",
  BORDER: "border-[#F5F5F3]",
} as const;

type TabType = (typeof TABS)[keyof typeof TABS];

export default function TutorTable() {
  const [isActive, setIsActive] = useState<TabType>(TABS.UNMATCHED);
  const [matchedTutors, setMatchedTutors] = useState<tutorBoxProps[]>([]);
  const [unmatchedTutors, setUnmatchedTutors] = useState<tutorBoxProps[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch("http://localhost:3000/tutors");
        const data = await response.json();
        const { matchedTutors, unmatchedTutors } = data;
        console.log("Matched filtered Tutors: ", matchedTutors);
        console.log("Unmatched filtered Tutors: ", unmatchedTutors);
        setMatchedTutors(matchedTutors);
        setUnmatchedTutors(unmatchedTutors);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-[70vw]">
      <h1 className="w-full text-3xl font-bold text-left">Tutor Database</h1>
      <div
        className={`w-full flex-grow border-2 ${COLORS.BORDER} rounded-lg bg-white p-4 mt-4`}
      >
        <div className="flex flex-col">
          <div className="flex flex-row justify-start space-x-8 py-4 px-4">
            <div
              className={
                "flex flex-row space-x-2 items-center cursor-pointer text-lg"
              }
              onClick={() => setIsActive(TABS.UNMATCHED)}
            >
              <h1
                className={
                  isActive === TABS.UNMATCHED ? COLORS.ACTIVE : COLORS.HISTORY
                }
              >
                Unmatched
              </h1>
              <div
                className={
                  "flex w-8 h-8 rounded-full  items-center justify-center " +
                  (isActive === TABS.UNMATCHED
                    ? COLORS.ACTIVE_BG
                    : COLORS.HISTORY_BG)
                }
              >
                {unmatchedTutors.length}
              </div>
            </div>
            <div
              className={
                "flex flex-row space-x-2 items-center cursor-pointer text-lg"
              }
              onClick={() => setIsActive(TABS.MATCHED)}
            >
              <h1
                className={
                  isActive === TABS.MATCHED ? COLORS.ACTIVE : COLORS.HISTORY
                }
              >
                Matched
              </h1>
              <div
                className={
                  "flex w-8 h-8 rounded-full  items-center justify-center " +
                  (isActive === TABS.MATCHED
                    ? COLORS.ACTIVE_BG
                    : COLORS.HISTORY_BG)
                }
              >
                {matchedTutors.length}
              </div>
            </div>
            <div
              className={
                "flex flex-row space-x-2 items-center cursor-pointer text-lg"
              }
              onClick={() => setIsActive(TABS.HISTORY)}
            >
              <h1
                className={
                  isActive === TABS.HISTORY ? COLORS.ACTIVE : COLORS.HISTORY
                }
              >
                History
              </h1>
              <div
                className={
                  "flex w-8 h-8 rounded-full  items-center justify-center " +
                  (isActive === TABS.HISTORY
                    ? COLORS.ACTIVE_BG
                    : COLORS.HISTORY_BG)
                }
              >
                0
              </div>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="h-[35px] bg-gray-200">
              <td className="px-3 w-1/5">
                <h1 className="text-gray-500 text-lg">Date</h1>
              </td>
              <td className="w-1/5">
                <h1 className="text-gray-500 text-lg ">Name</h1>
              </td>
              <td className="w-1/5">
                <h1 className="text-gray-500 text-lg ">Tufts ID</h1>
              </td>
              <td className="w-1/5">
                <h1 className="text-gray-500 text-lg ">Subjects</h1>
              </td>
              <td className="w-1/5"></td>
            </tr>
          </thead>
        </table>
        {isActive === TABS.UNMATCHED && (
          <div>
            {unmatchedTutors.map((box_props, index) => (
              <TutorInfoBox
                box_props={box_props}
                key={index}
                bgColor={index % 2 === 0 ? "bg-white" : "bg-[#FAFCFE]"}
              />
            ))}
          </div>
        )}
        {isActive === TABS.MATCHED && (
          <div>
            {matchedTutors.map((box_props, index) => (
              <TutorInfoBox
                box_props={box_props}
                key={index}
                bgColor={index % 2 === 0 ? "bg-white" : "bg-[#FAFCFE]"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
