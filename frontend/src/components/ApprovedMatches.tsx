import MatchedInfoBox from "./MatchedInfoBox";
import { useState, useEffect } from "react";
import { BsPlusLg } from "react-icons/bs";
import { tuteeBoxProps, tutorBoxProps } from "../types";
// import FilterButton from "./FilterButton";

// Add these constants at the top of the file, after imports
const TABS = {
  ACTIVE: 0,
  INACTIVE: 1,
} as const;

const COLORS = {
  ACTIVE: "text-[#8DAADD]",
  INACTIVE: "text-gray-500",
  ACTIVE_BG: "bg-[#8DAADD] text-white",
  INACTIVE_BG: "bg-[#F1F7FD] text-gray-500",
  TABLE_BG: "bg-[#FAFCFE]",
  BORDER: "border-[#F5F5F3]",
} as const;

interface Match {
  matchId: number;
  flagged: boolean;
  tutor: tutorBoxProps;
  tutee: tuteeBoxProps;
}

type TabType = (typeof TABS)[keyof typeof TABS];

export default function ApprovedMatches() {
  const [isActive, setIsActive] = useState<TabType>(TABS.ACTIVE);
  const date = "11/27/2024";

  // Add state to track which emails have been sent
  // const handleEmailSend = (index: number) => {
  //   // Here you would typically implement the actual email sending logic
  //   console.log(`Sending email for index ${index}`);
  // };

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("im in approved matches useeffect");
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:3000/approved-matches");
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        console.log("Matches:", data);
        setMatches(data.approvedMatches);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <div className="w-[70vw] items-center flex justify-center">
        <div className="w-full items-center justify-center flex flex-col">
          <div className="flex flex-row w-full justify-between">
            <h1 className="text-3xl font-bold">Approved Matches</h1>
            <div className="gap-x-2 flex flex-row items-center">
              <button className="px-6 py-2 bg-white border-2 border-[#E7E7E7] rounded-lg text-[#888888]">
                <div className="flex flex-row gap-x-2 items-center justify-center ">
                  <BsPlusLg color="gray" size={20} />
                  <p>Filters</p>
                </div>
              </button>
              <button className="px-6 py-2 bg-white border-2 border-[#E7E7E7] rounded-lg text-[#888888]">
                <div className="flex flex-row gap-x-2 items-center justify-center ">
                  <BsPlusLg color="gray" size={20} />
                  <p>Add</p>
                </div>
              </button>
            </div>
          </div>

          {/* When awaiting the fetch */}
          {loading && (
            <div className="flex items-center justify-center py-10">
              <p className="text-lg text-gray-500">Loading matches...</p>
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
            <div className="flex flex-row justify-center items-center w-full">
              <div
                className={`flex-grow border-2 ${COLORS.BORDER} rounded-lg bg-white p-4 mt-4`}
              >
                <div className="flex flex-col">
                  <div className="flex flex-row justify-start space-x-8 py-4 px-4">
                    <div
                      className={
                        "flex flex-row space-x-2 items-center cursor-pointer"
                      }
                      onClick={() => setIsActive(TABS.ACTIVE)}
                    >
                      <h1
                        className={
                          isActive === TABS.ACTIVE
                            ? COLORS.ACTIVE
                            : COLORS.INACTIVE
                        }
                      >
                        Active
                      </h1>
                      <div
                        className={
                          "flex w-8 h-8 rounded-full items-center justify-center " +
                          (isActive === TABS.ACTIVE
                            ? COLORS.ACTIVE_BG
                            : COLORS.INACTIVE_BG)
                        }
                      >
                        {matches.length}
                      </div>
                    </div>
                    <div
                      className={
                        "flex flex-row space-x-2 items-center cursor-pointer"
                      }
                      onClick={() => setIsActive(TABS.INACTIVE)}
                    >
                      <h1
                        className={
                          isActive === TABS.INACTIVE
                            ? COLORS.ACTIVE
                            : COLORS.INACTIVE
                        }
                      >
                        Inactive
                      </h1>
                      <div
                        className={
                          "flex w-8 h-8 rounded-full items-center justify-center " +
                          (isActive === TABS.INACTIVE
                            ? COLORS.ACTIVE_BG
                            : COLORS.INACTIVE_BG)
                        }
                      >
                        0
                      </div>
                    </div>
                  </div>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="h-[35px] bg-gray-100">
                      <td className="px-3 w-1/5">
                        <h1 className="text-gray-500 text-lg">Date</h1>
                      </td>
                      <td className="w-1/5">
                        <h1 className="text-gray-500 text-lg">Tutor</h1>
                      </td>
                      <td className="w-1/5">
                        <h1 className="text-gray-500 text-lg">Tutee</h1>
                      </td>
                      <td className="w-1/5">
                        <h1 className="text-gray-500 text-lg text-center">
                          Status
                        </h1>
                      </td>
                      <td className="w-1/5"></td>
                    </tr>
                  </thead>
                </table>
                {isActive === TABS.INACTIVE && (
                  <div>No inactive functionality yet</div>
                )}
                {isActive === TABS.ACTIVE && (
                  <div>
                    {matches.map((match, index) => (
                      <MatchedInfoBox
                        key={index}
                        tutee_props={match.tutee} // Pass the tutee object
                        tutor_props={match.tutor} // Pass the tutor object
                        matchId={match.matchId.toString()} // Ensure matchId is a string
                        flagged={match.flagged}
                        bgColor="bg-white"
                        date={date}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
