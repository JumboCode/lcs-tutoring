/************ MatchSuggestionTable **************
 *
 * This component handles the table aspect of the match suggestions in admin
 * view.
 *
 * Fetches the match suggestions from the backend and passes in all the match
 * suggestion blocks
 */

import config from "../config.ts";
import MatchSuggestionBlock from "./matchSuggestionBlock";
import { useState, useEffect, useRef } from "react";
import { tuteeInfo, tutorInfo } from "../types";
import { useAuth } from "@clerk/clerk-react";

interface MatchSuggestion {
  flagged: boolean;
  tutor: tutorInfo;
  tutee1: tuteeInfo | null;
  tutee2: tuteeInfo | null;
  tutee3: tuteeInfo | null;
  unmatchedTutorId: number;
}

export default function MatchSuggestionTable() {
  interface TuteeName {
    firstName: string;
    lastName: string;
    unmatchedTuteeId: string;
  }

  const [matchSuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>(
    []
  );
  const [unmatchedNames, setUnmatchedNames] = useState<TuteeName[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  const approvedTutorSlots = useRef(new Set<number>());
  const approvedTutees = useRef(new Set<string>());

  const { getToken } = useAuth();

  const removeApproved = (suggestions: MatchSuggestion[]) => suggestions
    .filter((match) => !approvedTutorSlots.current.has(match.unmatchedTutorId))
    .map((match) => ({
      ...match,
      tutee1: match.tutee1 && !approvedTutees.current.has(String(match.tutee1.id)) ? match.tutee1 : null,
      tutee2: match.tutee2 && !approvedTutees.current.has(String(match.tutee2.id)) ? match.tutee2 : null,
      tutee3: match.tutee3 && !approvedTutees.current.has(String(match.tutee3.id)) ? match.tutee3 : null,
    }));

  const refetchAfterApprove = (unmatchedTutorId: number, tuteeId: string) => {
    approvedTutorSlots.current.add(unmatchedTutorId);
    approvedTutees.current.add(String(tuteeId));
    setMatchSuggestions(removeApproved);
    setUnmatchedNames((names) => names.filter((name) => String(name.unmatchedTuteeId) !== String(tuteeId)));
    setRefetchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let cancelled = false;
    const fetchSuggestions = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${config.backendUrl}/match-suggestions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch match suggestions");
        }
        const data = await response.json();
        if (!cancelled) {
          setMatchSuggestions(removeApproved(data.matchSuggestions));
          setError(null);
        }
      } catch (error) {
        if (!cancelled) setError((error as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const fetchTutees = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${config.backendUrl}/tutees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tutees");
        }
        const data = await response.json(); // Parse the response body as JSON
        const { _, unmatchedTutees } = data;
        void _;
        const names = unmatchedTutees.map((formData: any) => ({
          firstName: formData.tutee_first_name,
          lastName: formData.tutee_last_name,
          unmatchedTuteeId: formData.id,
        }));
        if (!cancelled) setUnmatchedNames(names.filter((name: TuteeName) => !approvedTutees.current.has(String(name.unmatchedTuteeId))));
      } catch (error) {
        console.error("Error fetching tutees: ", error);
      }
    };

    fetchTutees();
    fetchSuggestions();
    return () => { cancelled = true; };
  }, [refetchTrigger]);

  return (
    <div>
      <div className="w-full flex justify-center flex-col">
        <h1 className="text-3xl font-bold">Match Suggestions</h1>
        <h2 className="text-lg py-3 text-gray-500">
          Start pairing tutors and tutees
        </h2>
        <hr className="py-3"></hr>

        {/* When awaiting the fetch */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-gray-500">Loading suggestions...</p>
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
          <div>
            <div>
              {matchSuggestions.map((match) => (
                <MatchSuggestionBlock
                  key={match.unmatchedTutorId}
                  tutor_info={match.tutor}
                  tutee1={match.tutee1}
                  tutee2={match.tutee2}
                  tutee3={match.tutee3}
                  unmatched_tutor_id={match.unmatchedTutorId}
                  flagged={match.flagged}
                  unmatched_names={unmatchedNames}
                  refetchSuggestions={refetchAfterApprove}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
