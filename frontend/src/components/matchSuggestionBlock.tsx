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

import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { BsPlusLg } from "react-icons/bs";
import { tutorInfo } from "../types";
import { tuteeInfo } from "../types";

import { Modal } from "react-bootstrap";
import { useState } from "react";
import { Flag } from "lucide-react";

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
  unmatched_names,
}: {
  tutor_info: tutorInfo;
  tutee1: tuteeInfo | null;
  tutee2: tuteeInfo | null;
  tutee3: tuteeInfo | null;
  flagged: Boolean;
  unmatched_names: TuteeName[];
}) => {
  const [selectedTuteeId, setselectedTuteeId] = useState<string | null>(null);
  const [selectedCustomId, setselectedCustomId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finishedSubmitting, setFinishedSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      console.log("approve match");
      console.log(tutor_info.id);
      const tutorId = tutor_info.id;

      console.log(selectedTuteeId);
      let idToSend = selectedTuteeId;
      console.log(`start: ${idToSend}`);
      if (selectedTuteeId == null) {
        console.log(`here 1: ${idToSend}`);
        if (selectedCustomId != null) {
          idToSend = selectedCustomId;
          console.log(`here 2: ${idToSend}`);
        }
      }
      console.log(`final: ${idToSend}`);

      const response = await fetch(`${config.backendUrl}/approve-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tutorId, selectedTuteeId: idToSend }),
      });

      console.log("Got response");

      if (!response.ok) {
        throw new Error("Failed to approve match");
      }
    } catch (error) {
      console.error("Error approving match:", error);
      alert("Failed to approve match. Please try again.");
    } finally {
      setIsSubmitting(false);
      setFinishedSubmitting(true);
      console.log("Got here");
    }
  };
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
    <>
      {!finishedSubmitting && (
        <div className="border rounded-lg bg-white p-6 my-6">
          <div className="flex space-x-6 mx-6 my-3">
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
          </div>
          {tutor_info.flagged && (
            <div className="bg-[#FEFDF2] p-2 rounded mx-auto my-2">
              <div className="flex items-center gap-2 ">
                <Flag className="text-[#F3CA42]" />
                <span className="text-sm font-normal text-[#F3CA42]">
                  Priority Selection Flag
                </span>
              </div>
            </div>
          )}
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
              <strong className="text-red-600 text-sm">
                Special Request:{" "}
              </strong>
              <span className="text-sm">{notes}</span>
            </div>
          )}

          {/*tutee info in below div*/}
          <div className="flex flex-row m-6 space-x-6 items-center justify-between">
            {tutee1 && (
              <TuteeSuggestionBox
                tutee_info={tutee1}
                isSelected={selectedTuteeId === tutee1.id}
                onSelect={() => setselectedTuteeId(tutee1.id)}
              />
            )}
            {tutee2 && (
              <TuteeSuggestionBox
                tutee_info={tutee2}
                isSelected={selectedTuteeId === tutee2.id}
                onSelect={() => setselectedTuteeId(tutee2.id)}
              />
            )}
            {tutee3 && (
              <TuteeSuggestionBox
                tutee_info={tutee3}
                isSelected={selectedTuteeId === tutee3.id}
                onSelect={() => setselectedTuteeId(tutee3.id)}
              />
            )}
          </div>

          {/*buttons*/}
          <div className="flex flex-row-reverse space-x-6 space-x-reverse">
            <button
              className={`rounded-xl px-5 py-3 text-lg w-[200px] ${
                selectedTuteeId
                  ? "bg-[#7ea5e4] text-white hover:bg-[#4174c2]"
                  : "bg-gray-200 border border-gray-950 text-gray-500 cursor-not-allowed"
              }`}
              type="button"
              onClick={handleApprove}
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
              <div>
                <ul>
                  {unmatched_names.map((name, index) => (
                    <li key={index}>
                      <input
                        className="mr-2"
                        type="radio"
                        onClick={() => {
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
                onClick={handleApprove}
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
      )}
    </>
  );
};

export default MatchSuggestionBlock;
