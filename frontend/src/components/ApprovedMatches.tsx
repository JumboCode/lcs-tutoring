import config from "../config.ts";
import MatchedInfoBox from "./MatchedInfoBox";
import { useState, useEffect } from "react";
import filtersIcon from "../assets/images/filter/filter.svg";
import { tuteeBoxProps, tutorBoxProps } from "../types";
import FilterModal from "./filters";
import { useAuth } from "@clerk/clerk-react";

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
  sent_email: boolean;
  pair_date: string;
  inactive_date: string;
  tutor: tutorBoxProps;
  tutee: tuteeBoxProps;
}

type TabType = (typeof TABS)[keyof typeof TABS];

interface FilterValues {
  gradeLevels?: number[];
  selectedSubjects?: string[];
  tutoringMode?: string;
  disability?: boolean;
}

export default function ApprovedMatches() {
  const [isActive, setIsActive] = useState<TabType>(TABS.ACTIVE);
  const [active_matches, setActiveMatches] = useState<Match[]>([]);
  const [inactive_matches, setInactiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(
    null
  );

  const { getToken } = useAuth();

  useEffect(() => {
    console.log("im in approved matches useeffect");
    const fetchMatches = async () => {
      try {
        const token = await getToken();
        const queryFilter = new URLSearchParams(
          appliedFilters as any
        ).toString();
        const response = await fetch(
          `${config.backendUrl}/approved-matches?${queryFilter}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        console.log("Fetched approved matches: ", data.activeApprovedMatches);
        setActiveMatches(data.activeApprovedMatches);
        setInactiveMatches(data.inactiveApprovedMatches);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [appliedFilters]);

  // useEffect(() => {
  //   console.log("Active matches: ", active_matches); // Added logging
  //   console.log("Inactive matches: ", inactive_matches); // Added logging
  // }, [active_matches, inactive_matches]);

  return (
    <div className="w-full flex justify-end flex-col">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Approved Matches</h1>
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
            console.log("FILTERS ARE: ", filters);
          }}
        />
      </div>
      <hr className="border-t-1 border-gray w-full my-2 mt-3" />

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
        <div
          className={`flex-grow border ${COLORS.BORDER} rounded-lg bg-white p-4 mt-3`}
        >
          <div className="flex flex-col">
            <div className="relative w-full px-4">
              <div className="flex flex-row justify-start space-x-8 py-4">
                {/* Tabs */}
                <div
                  className="flex flex-row space-x-2 items-center cursor-pointer text-lg"
                  onClick={() => setIsActive(TABS.ACTIVE)}
                >
                  <h1
                    className={
                      isActive === TABS.ACTIVE ? COLORS.ACTIVE : COLORS.INACTIVE
                    }
                  >
                    Matched
                  </h1>
                  <div
                    className={
                      "flex w-8 h-8 rounded-full items-center justify-center " +
                      (isActive === TABS.ACTIVE
                        ? COLORS.ACTIVE_BG
                        : COLORS.INACTIVE_BG)
                    }
                  >
                    {active_matches.length}
                  </div>
                </div>

                <div
                  className="flex flex-row space-x-2 items-center cursor-pointer text-lg"
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
                    {inactive_matches.length}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E7E7E7] rounded-full" />
              <div
                className="absolute bottom-0 h-0.5 rounded-full bg-[#8DAADD] transition-all duration-300"
                style={{
                  width: isActive === TABS.ACTIVE ? "8rem" : "7.5rem",
                  left: isActive === TABS.ACTIVE ? "1rem" : "10rem",
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
                  <h1 className="text-gray-500 text-lg">Tutor</h1>
                </td>
                <td className="w-1/5">
                  <h1 className="text-gray-500 text-lg">Tutee</h1>
                </td>
                <td className="w-1/5">
                  <h1 className="text-gray-500 text-lg text-center">Status</h1>
                </td>
                <td className="w-1/5"></td>
              </tr>
            </thead>
          </table>
          {isActive === TABS.INACTIVE && (
            <div>
              {inactive_matches.map((match, index) => (
                <MatchedInfoBox
                  key={index}
                  tutee_props={match.tutee} // Pass the tutee object
                  tutor_props={match.tutor} // Pass the tutor object
                  matchId={match.matchId.toString()} // Ensure matchId is a string
                  flagged={match.flagged}
                  sent_email={match.sent_email}
                  bgColor="bg-white"
                  pair_date={match.pair_date}
                  inactive_date={match.inactive_date}
                  isActive={false}
                  onPermDelete={(deletedMatchId) => {
                    // Remove the deleted match from inactive matches
                    setInactiveMatches((prev) =>
                      prev.filter(
                        (pair) => pair.matchId.toString() !== deletedMatchId
                      )
                    );
                  }}
                />
              ))}
            </div>
          )}
          {isActive === TABS.ACTIVE && (
            <div>
              {active_matches.map((match, index) => (
                <MatchedInfoBox
                  key={index}
                  tutee_props={match.tutee} // Pass the tutee object
                  tutor_props={match.tutor} // Pass the tutor object
                  matchId={match.matchId.toString()} // Ensure matchId is a string
                  flagged={match.flagged}
                  sent_email={match.sent_email}
                  bgColor="bg-white"
                  pair_date={match.pair_date}
                  isActive={true}
                  onUnpair={(deletedMatchId) => {
                    // Remove the deleted match from active matches
                    setActiveMatches((prev) =>
                      prev.filter(
                        (pair) => pair.matchId.toString() !== deletedMatchId
                      )
                    );

                    // Find the match to move
                    const matchToMove = active_matches.find(
                      (pair) => pair.matchId.toString() === deletedMatchId
                    );

                    // Only add the match if it's found
                    if (matchToMove) {
                      setInactiveMatches((prev) => [...prev, matchToMove]);
                    }
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
