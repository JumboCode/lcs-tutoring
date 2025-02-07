import TuteeInfoBox from "./TuteeInfoBox";
import { useState, useEffect } from "react";
import { tuteeBoxProps } from "../types";

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

export default function TuteeTable() {
  const [isActive, setIsActive] = useState<TabType>(TABS.UNMATCHED);
  const [unmatchedTutees, setUnmatchedTutees] = useState<tuteeBoxProps[]>([]);
  const [matchedTutees, setMatchedTutees] = useState<tuteeBoxProps[]>([]);
  const [historyTutees, setHistoryTutees] = useState<tuteeBoxProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutees = async () => {
      try {
        // https://jumbocodegpt.onrender.com/tutees
        // http://localhost:3000/tutees
        const response = await fetch("http://localhost:3000/tutees");
        const data = await response.json();
        const { matchedTutees, unmatchedTutees, historyTutees } = data;
        setMatchedTutees(matchedTutees);
        setUnmatchedTutees(unmatchedTutees);
        setHistoryTutees(historyTutees);
      } catch (error) {
        console.error("Error fetching tutees:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutees();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-[70vw]">
      <h1 className="w-full text-3xl font-bold text-left">Tutee Database</h1>

      {/* When awaiting the fetch */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <p className="text-lg text-gray-500">Loading tutees...</p>
        </div>
      )}

      {/* Error if fetch fails */}
      {error && (
        <div className="flex items-center justify-center py-10 text-red-500">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      )}

      {/* Successful load and no errors */}
      {!loading && !error && (
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
                  {unmatchedTutees.length}
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
                  {matchedTutees.length}
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
                  {historyTutees.length}
                </div>
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="h-[35px] bg-gray-100/50">
                <td className="px-3 w-1/5">
                  <h1 className="text-gray-500 text-lg">Date</h1>
                </td>
                <td className="w-1/5">
                  <h1 className="text-gray-500 text-lg ">Name</h1>
                </td>
                <td className="w-1/5">
                  <h1 className="text-gray-500 text-lg ">Subject</h1>
                </td>
                <td className="w-1/5">
                  <h1 className="text-gray-500 text-lg ">Grade</h1>
                </td>
                <td className="w-1/5"></td>
              </tr>
            </thead>
          </table>
          {isActive === TABS.UNMATCHED && (
            <div>
              {unmatchedTutees.map((box_props, index) => (
                <TuteeInfoBox
                  box_props={box_props}
                  key={index}
                  bgColor={index % 2 === 0 ? "bg-white" : "bg-[#FAFCFE]"}
                />
              ))}
            </div>
          )}
          {isActive === TABS.MATCHED && (
            <div>
              {matchedTutees.map((box_props, index) => (
                <TuteeInfoBox
                  box_props={box_props}
                  key={index}
                  bgColor={index % 2 === 0 ? "bg-white" : "bg-[#FAFCFE]"}
                />
              ))}
            </div>
          )}
        </div>
        <table className="w-full">
          <thead>
            <tr className="h-[35px] bg-gray-100/50">
              <td className="px-3 w-1/5">
                <h1 className="text-gray-500 text-lg">Date</h1>
              </td>
              <td className="w-1/5">
                <h1 className="text-gray-500 text-lg ">Name</h1>
              </td>
              <td className="w-1/5">
                <h1 className="text-gray-500 text-lg ">Subject</h1>
              </td>
              <td className="w-1/5">
                <h1 className="text-gray-500 text-lg ">Grade</h1>
              </td>
              <td className="w-1/5"></td>
            </tr>
          </thead>
        </table>
        {isActive === TABS.UNMATCHED && (
          <div>
            {unmatchedTutees.map((box_props, index) => (
              <TuteeInfoBox
                box_props={box_props}
                key={index}
                bgColor={index % 2 === 0 ? "bg-white" : "bg-[#FAFCFE]"}
              />
            ))}
          </div>
        )}
        {isActive === TABS.MATCHED && (
          <div>
            {matchedTutees.map((box_props, index) => (
              <TuteeInfoBox
                box_props={box_props}
                key={index}
                bgColor={index % 2 === 0 ? "bg-white" : "bg-[#FAFCFE]"}
              />
            ))}
          </div>
        )}
        {isActive === TABS.HISTORY && (
          <div>
            {historyTutees.map((box_props, index) => (
              <TuteeInfoBox
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
