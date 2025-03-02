/************ MatchSuggestionTable **************
 *
 * This component handles the table aspect of the match suggestions in admin
 * view.
 *
 * Fetches the match suggestions from the backend and passes in all the match
 * suggestion blocks
 */

import MatchSuggestionBlock from "./matchSuggestionBlock";
import { useState, useEffect } from "react";
import { tuteeInfo, tutorInfo } from "../types";
// import FilterButton from "./FilterButton";

// tutees not passed in from algorithm yet
interface MatchSuggestion {
  flagged: boolean;
  tutor: tutorInfo;
  tutee1: tuteeInfo;
  tutee2: tuteeInfo;
  tutee3: tuteeInfo;
}

export default function MatchSuggestionTable() {
  const tutee1: tuteeInfo = {
    id: "12",
    first_name: "Bill",
    last_name: "Smith",
    email: "bill.smith@hi.com",
    subjects: ["Math", "Geometry"],
    grade: "8",
    special_needs: "No",
    tutoring_mode: "Hybrid",
  };

  const tutee2: tuteeInfo = {
    id: "13",
    first_name: "Bob",
    last_name: "Jones",
    email: "bob.jones@hi.com",
    subjects: ["Science"],
    grade: "10",
    special_needs: "Dyslexia",
    tutoring_mode: "In-Person",
  };

  const tutee3: tuteeInfo = {
    id: "14",
    first_name: "Ana",
    last_name: "Todd",
    email: "ana.todd@hi.com",
    subjects: ["English"],
    grade: "9",
    special_needs: "No",
    tutoring_mode: "Hybrid",
  };

  interface TuteeName {
    firstName: string;
    lastName: string;
  }

  const [matchsuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>(
    []
  );
  const [unmatchedNames, setUnmatchedNames] = useState<TuteeName[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("im in approved match suggestions useeffect");
    const fetchSuggestions = async () => {
      try {
        const response = await fetch("http://localhost:3000/match-suggestions");
        if (!response.ok) {
          throw new Error("Failed to fetch match suggestions");
        }
        const data = await response.json();
        console.log("Match Suggestions:", data);
        setMatchSuggestions(data.matchSuggestions);
        // todo
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTutees = async () => {
      try {
        const response = await fetch("http://localhost:3000/tutees");
        if (!response.ok) {
          throw new Error("Failed to fetch tutees");
        }
        const data = await response.json(); // Parse the response body as JSON
        const { _, unmatchedTutees } = data;
        void _;
        const names = unmatchedTutees.map((formData: any) => ({
          firstName: formData.tutee_first_name,
          lastName: formData.tutee_last_name,
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
          <div>
            <div>
              {matchsuggestions.map((match, index) => (
                <MatchSuggestionBlock
                  key={index}
                  tutor_info={match.tutor}
                  tutee1={tutee1}
                  tutee2={tutee2}
                  tutee3={tutee3}
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
