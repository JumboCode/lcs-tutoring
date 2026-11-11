/************ MatchSuggestionBlock **************
 *
 * This component handles the individual match suggestion blocks and how they
 * are displayed. For each tutor, uses the MatchedInfoBox component to display
 * three tutees.
 *
 * handles the custom match and approve functionalities.
 */

"use client";

import config from "../config.ts";
import TuteeSuggestionBox from "./tuteeSuggestionBox";

import YELLOW_FLAG from "../assets/images/admin_view/yellow_flag.svg";
import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { BsPlusLg } from "react-icons/bs";
import { tutorInfo } from "../types";
import { tuteeInfo } from "../types";

import { Modal } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

// const BG_COLOR = "#fbfbfb";
interface TuteeName {
  firstName: string;
  lastName: string;
  unmatchedTuteeId: string;
}

const MatchSuggestionBlock = ({
  tutor_info,
  tutee1,
  tutee2,
  tutee3,
  unmatched_tutor_id,
  unmatched_names,
  refetchSuggestions,
}: {
  tutor_info: tutorInfo;
  tutee1: tuteeInfo | null;
  tutee2: tuteeInfo | null;
  tutee3: tuteeInfo | null;
  unmatched_tutor_id: number;
  flagged: boolean;
  unmatched_names: TuteeName[];
  refetchSuggestions: (unmatchedTutorId: number, tuteeId: string) => void;
}) => {
  const [selectedTuteeId, setselectedTuteeId] = useState<string | null>(null);
  const [selectedCustomId, setselectedCustomId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const tuteeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    if (selectedTuteeId && ![tutee1, tutee2, tutee3].some((tutee) => tutee?.id === selectedTuteeId)) {
      setselectedTuteeId(null);
    }
    if (selectedCustomId && !unmatched_names.some((name) => name.unmatchedTuteeId === selectedCustomId)) {
      setselectedCustomId(null);
    }
  }, [tutee1, tutee2, tutee3, unmatched_names, selectedTuteeId, selectedCustomId]);

  const approveMatch = async (tutee_id: string | null) => {
    if (!tutee_id || submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setApprovalError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${config.backendUrl}/approve-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorId: tutor_info.id,
          selectedTuteeId: tutee_id,
          unmatchedTutorId: unmatched_tutor_id,
        }),
      });

      if (!response.ok) {
        // Use the backend's reason when it sends one (e.g. tutee already matched)
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Failed to approve match");
      }

      const data = await response.json();

      refetchSuggestions(unmatched_tutor_id, tutee_id);
      setModalVisible(false);
      setselectedCustomId(null);
      return data;
    } catch (error) {
      // Show the backend's reason when it sent one, e.g. the match is no longer pending
      console.error("Error approving match:", error);
      setApprovalError((error as Error).message || "Could not approve this match. Please try again.");
    } finally {
      // Always re-enable the button, including after a failure, so the admin can retry
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    tuteeRefs.current = tuteeRefs.current.slice(0, 3);

    const calculateMaxHeight = () => {
      const heights = tuteeRefs.current
        .filter((ref): ref is HTMLDivElement => ref !== null)
        .map((ref) => ref.getBoundingClientRect().height);

      if (heights.length > 0) {
        const max = Math.max(...heights);
        setMaxHeight(max);
      }
    };

    requestAnimationFrame(calculateMaxHeight);

    window.addEventListener("resize", calculateMaxHeight);
    return () => window.removeEventListener("resize", calculateMaxHeight);
  }, [tutee1, tutee2, tutee3]);

  const {
    first_name,
    last_name,
    email,
    phone,
    subject = [],
    grade_level_pref = [],
    disability_pref,
    tutoring_mode,
    notes,
  } = tutor_info;

  const [modalVisible, setModalVisible] = useState(false);

  // Modal open function
  const openModal = () => setModalVisible(true);

  // Modal close function
  const closeModal = () => {
    setModalVisible(false);
    setselectedCustomId(null);
  };

  return (
    <div className="border rounded-lg bg-white p-6 my-6">
      <div className="flex flex-row items-center space-x-6 mx-6 my-3">
        <span className="font-bold text-lg">
          {first_name} {last_name}
        </span>
        <div className="flex pt-2" style={{ color: "#6B7280" }}>
          <BsEnvelope />
          <span className="pl-2 text-sm text-gray-500 ">{email}</span>
        </div>
        <div className="flex pt-2" style={{ color: "#6B7280" }}>
          <FiPhone />
          <span className="pl-2 text-sm text-gray-500">{phone}</span>
        </div>
        {tutor_info.priority && (
          <img src={YELLOW_FLAG} alt="flag" className="w-6 h-6" />
        )}
      </div>
      <div
        className={
          "py-1 flex flex-row text-gray-500 px-2 bg-[#fbfbfb] justify-start items-center mx-3"
        }
      >
        <span className="w-1/4">Subject Preferences</span>
        <span className="w-1/4">Grade Preferences</span>
        <span className="w-1/4">Open to Special Needs</span>
        <span className="w-1/4">Tutoring Mode</span>
      </div>
      <div className="py-2 flex flex-row text-[black] px-2 justify-start items-center mx-3">
        <span className="w-1/4">{subject.join(", ")}</span>
        <span className="w-1/4">
          {grade_level_pref
            .map((grade) =>
              grade == "0"
                ? "Kindergarten"
                : grade == "1"
                ? "1st"
                : grade == "2"
                ? "2nd"
                : grade == "3"
                ? "3rd"
                : grade + "th"
            )
            .join(", ")}
        </span>
        <span className="w-1/4">{disability_pref ? "Yes" : "No"}</span>
        <span className="w-1/4">{tutoring_mode}</span>
      </div>

      {/*special request being displayed in below div*/}
      {notes && (
        <div className="mx-3 mt-2 px-2 pt-2 py-2 bg-red-100 border-red-500 text-black">
          <strong className="text-red-600 text-sm">Special Request: </strong>
          <span className="text-sm">{notes}</span>
        </div>
      )}

      {/*tutee info in below div*/}
      <div className="flex flex-row m-6 space-x-6 items-center justify-between">
        <div className="w-1/3">
          {tutee1 && (
            <div
              ref={(el) => (tuteeRefs.current[0] = el)}
              style={maxHeight > 0 ? { height: `${maxHeight}px` } : {}}
            >
              <TuteeSuggestionBox
                tutee_info={tutee1}
                isSelected={selectedTuteeId === tutee1.id}
                onSelect={() => setselectedTuteeId(tutee1.id)}
              />
            </div>
          )}
        </div>
        <div className="w-1/3">
          {tutee2 && (
            <div
              ref={(el) => (tuteeRefs.current[1] = el)}
              style={maxHeight > 0 ? { height: `${maxHeight}px` } : {}}
            >
              <TuteeSuggestionBox
                tutee_info={tutee2}
                isSelected={selectedTuteeId === tutee2.id}
                onSelect={() => setselectedTuteeId(tutee2.id)}
              />
            </div>
          )}
        </div>
        <div className="w-1/3">
          {tutee3 && (
            <div
              ref={(el) => (tuteeRefs.current[2] = el)}
              style={maxHeight > 0 ? { height: `${maxHeight}px` } : {}}
            >
              <TuteeSuggestionBox
                tutee_info={tutee3}
                isSelected={selectedTuteeId === tutee3.id}
                onSelect={() => setselectedTuteeId(tutee3.id)}
              />
            </div>
          )}
        </div>
      </div>

      {approvalError && !modalVisible && <p role="alert" className="text-red-600">{approvalError}</p>}
      {/*buttons*/}
      <div className="flex flex-row-reverse space-x-6 space-x-reverse">
        <button
          className={`rounded-xl px-5 py-3 text-lg w-[200px] ${
            selectedTuteeId
              ? "bg-[#7ea5e4] text-white hover:bg-[#4174c2]"
              : "bg-gray-200 border border-gray-950 text-gray-500 cursor-not-allowed"
          }`}
          type="button"
          onClick={() => {
            approveMatch(selectedTuteeId);
          }}
          disabled={!selectedTuteeId || isSubmitting}
        >
          <span
            className={`${
              selectedTuteeId ? "flex flex-row gap-x-2 items-center" : ""
            }`}
          >
            {selectedTuteeId && <FaCheck />}
            {isSubmitting ? "Processing..." : "Approve"}
          </span>
        </button>
        <button
          disabled={isSubmitting}
          onClick={openModal}
          className="rounded-xl bg-[#ffffff] hover:bg-gray-100 px-5 py-3 border text-gray-700 text-lg "
          type="button"
        >
          {/* This is where you will complete your ticket */}
          <span className="flex flex-row items-center gap-x-2">
            <BsPlusLg />
            Custom Match
          </span>
        </button>
      </div>
      <Modal show={modalVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Custom Match</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {approvalError && <p role="alert" className="text-red-600">{approvalError}</p>}
          <div>
            <ul>
              {unmatched_names.map((name, index) => (
                <li key={index}>
                  <input
                    className="mr-2"
                    type="radio"
                    onChange={() => {
                      setselectedCustomId(name.unmatchedTuteeId);
                      setselectedTuteeId(null);
                    }}
                    checked={selectedCustomId === name.unmatchedTuteeId}
                  />
                  {name.firstName} {name.lastName}
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className={`btn btn-secondary ${
              selectedCustomId
                ? "bg-[#7ea5e4] text-white hover:bg-[#4174c2] border-0"
                : "bg-gray-200 border border-gray-950 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => {
              approveMatch(selectedCustomId);
            }}
            disabled={!selectedCustomId || isSubmitting}
          >
            Approve
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MatchSuggestionBlock;
