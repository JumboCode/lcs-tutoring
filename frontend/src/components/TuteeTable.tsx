import config from "../config.ts";
import TuteeInfoBox from "./TuteeInfoBox";
import { useState, useEffect } from "react";
import filtersIcon from "../assets/images/filter/filter.svg";
import { tuteeBoxProps } from "../types";
import FilterModal from "./filters";
import { useAuth } from "@clerk/clerk-react";

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

interface FilterValues {
  gradeLevels?: number[];
  selectedSubjects?: string[];
  tutoringMode?: string;
  disability?: boolean;
}

export default function TuteeTable() {
  const [isActive, setIsActive] = useState<TabType>(TABS.UNMATCHED);
  const [unmatchedTutees, setUnmatchedTutees] = useState<tuteeBoxProps[]>([]);
  const [matchedTutees, setMatchedTutees] = useState<tuteeBoxProps[]>([]);
  const [historyTutees, setHistoryTutees] = useState<tuteeBoxProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(
    null
  );

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTutees = async () => {
      try {
        const token = await getToken();
        const queryFilter = new URLSearchParams(
          appliedFilters as any
        ).toString();
        const response = await fetch(
          `${config.backendUrl}/tutees?${queryFilter}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          // not signed in — handle however you'd like
          window.location.href = "/"; // or redirect to login
          return;
        }
        const data = await response.json();
        const { matchedTutees, unmatchedTutees, historyTutees } = data;
        // const firstNames = matchedTutees.map((matchedTutees) => matchedTutees.first_name);
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
  }, [appliedFilters]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex flex-row justify-between">
        <h1 className="text-3xl font-bold text-left">Tutee Database</h1>
        <button
          className="px-6 py-2 bg-[#ffffff] hover:bg-gray-200/50 border border-[#E7E7E7] rounded-lg text-[#888888]"
          onClick={() => setModalShow(true)}
        >
          <div className="flex flex-row gap-x-2 items-center justify-center">
            <img src={filtersIcon} />
            <p>Filters</p>
          </div>
        </button>
        <FilterModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          onApply={(filters) => {
            setAppliedFilters(filters);
            setModalShow(false);
          }}
        />
      </div>
      <hr className="border-t-1 border-gray w-full my-2 mt-3" />

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
          className={`w-full flex-grow border ${COLORS.BORDER} rounded-lg bg-white p-4 mt-3`}
        >
          <div className="flex flex-col">
            <div className="relative w-full px-4">
              <div className="flex flex-row justify-start space-x-8 py-4">
                {/* Tabs */}
                <div
                  className="flex flex-row space-x-2 items-center cursor-pointer text-lg"
                  onClick={() => setIsActive(TABS.UNMATCHED)}
                >
                  <h1
                    className={
                      isActive === TABS.UNMATCHED
                        ? COLORS.ACTIVE
                        : COLORS.HISTORY
                    }
                  >
                    Unmatched
                  </h1>
                  <div
                    className={
                      "flex w-8 h-8 rounded-full items-center justify-center " +
                      (isActive === TABS.UNMATCHED
                        ? COLORS.ACTIVE_BG
                        : COLORS.HISTORY_BG)
                    }
                  >
                    {unmatchedTutees.length}
                  </div>
                </div>

                <div
                  className="flex flex-row space-x-2 items-center cursor-pointer text-lg"
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
                      "flex w-8 h-8 rounded-full items-center justify-center " +
                      (isActive === TABS.MATCHED
                        ? COLORS.ACTIVE_BG
                        : COLORS.HISTORY_BG)
                    }
                  >
                    {matchedTutees.length}
                  </div>
                </div>

                <div
                  className="flex flex-row space-x-2 items-center cursor-pointer text-lg"
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
                      "flex w-8 h-8 rounded-full items-center justify-center " +
                      (isActive === TABS.HISTORY
                        ? COLORS.ACTIVE_BG
                        : COLORS.HISTORY_BG)
                    }
                  >
                    {historyTutees.length}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E7E7E7] rounded-full" />
              <div
                className="absolute bottom-0 h-0.5 rounded-full bg-[#8DAADD] transition-all duration-300"
                style={{
                  width:
                    isActive === TABS.UNMATCHED
                      ? "9rem"
                      : isActive === TABS.MATCHED
                      ? "7.75rem"
                      : "6.5rem",
                  left:
                    isActive === TABS.UNMATCHED
                      ? "1rem"
                      : isActive === TABS.MATCHED
                      ? "11.5rem"
                      : "21rem",
                }}
              />
            </div>
          </div>
          <table className="w-full mt-4">
            <thead>
              <tr className="h-[35px] bg-[#F1F7FD]">
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
                  isUnmatched={true}
                  isHistory={false}
                  onDelete={(deletedTutee) => {
                    const updatedTutee = {
                      ...deletedTutee,
                      history_date: new Date().toISOString().split("T")[0],
                      priority: false,
                    };
                    // Remove the deleted tutee from unmatched tutees
                    setUnmatchedTutees((prev) =>
                      prev.filter((tutee) => tutee.id !== deletedTutee.id)
                    );
                    // Add the deleted tutee to history tutees
                    setHistoryTutees((prev) => [...prev, updatedTutee]);
                  }}
                  onPriority={(priorityTutee) => {
                    setUnmatchedTutees((prevTutees) =>
                      prevTutees.map((tutee) =>
                        tutee.id === priorityTutee.id
                          ? { ...tutee, priority: !tutee.priority }
                          : tutee
                      )
                    );
                  }}
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
                  isUnmatched={false}
                  isHistory={false}
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
                  isUnmatched={false}
                  isHistory={true}
                  onPermDelete={(deletedTutee) => {
                    // Remove the deleted tutee from unmatched tutees
                    setHistoryTutees((prev) =>
                      prev.filter((tutee) => tutee.id !== deletedTutee.id)
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
