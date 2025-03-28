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
import { useState, useEffect } from "react";
import { tuteeInfo, tutorInfo } from "../types";
// import FilterButton from "./FilterButton";
// tutees not passed in from algorithm yet
interface MatchSuggestion {
  flagged: boolean;
  tutor: tutorInfo;
  tutee1: tuteeInfo | null;
  tutee2: tuteeInfo | null;
  tutee3: tuteeInfo | null;
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

  useEffect(() => {
    console.log("im in approved match suggestions useeffect");
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/match-suggestions`);
        if (!response.ok) {
          throw new Error("Failed to fetch match suggestions");
        }
        const data = await response.json();
        console.log("Match Suggestions:", data);
        console.log("GONNA SET");
        setMatchSuggestions(data.matchSuggestions);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTutees = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/tutees`);
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
        setUnmatchedNames(names);
        console.log("Unmatched Tutee Names: ", names);
        //console.log(data);
      } catch (error) {
        console.error("Error fetching tutees: ", error);
      }
    };

    fetchTutees();
    fetchSuggestions();
  }, []);

  return (
    <div>
      <div className="w-full flex justify-center flex-col">
        <h1 className="text-3xl font-bold">Match Suggestions</h1>
        <h2 className="text-lg py-3 text-gray-500">Start pairing tutors and tutees</h2>
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
              {matchSuggestions.map((match, index) => (
                <MatchSuggestionBlock
                  key={index}
                  tutor_info={match.tutor}
                  tutee1={match.tutee1}
                  tutee2={match.tutee2}
                  tutee3={match.tutee3}
                  flagged={match.flagged}
                  unmatched_names={unmatchedNames}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
