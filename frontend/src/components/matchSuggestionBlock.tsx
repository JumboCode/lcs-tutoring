/************ MatchSuggestionBlock **************
 *
 * This component handles the individual match suggestion blocks and how they
 * are displayed. For each tutor, uses the MatchedInfoBox component to display
 * three tutees.
 *
 * handles the custom match and approve functionalities.
 */

"use client";

import TuteeSuggestionBox from "./tuteeSuggestionBox";

import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { BsPlusLg } from "react-icons/bs";
import { tutorInfo } from "../types";
import { tuteeInfo } from "../types";

import { Modal } from "react-bootstrap";
import { useState } from "react";

// const BG_COLOR = "#fbfbfb";
interface TuteeName {
  firstName: string;
  lastName: string;
}

const MatchSuggestionBlock = ({
  tutor_info,
  tutee1,
  tutee2,
  tutee3,
  flagged,
  unmatched_names,
}: {
  tutor_info: tutorInfo;
  tutee1: tuteeInfo;
  tutee2: tuteeInfo;
  tutee3: tuteeInfo;
  flagged: Boolean;
  unmatched_names: TuteeName[];
}) => {
  const [selectedTuteeId, setselectedTuteeId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finishedSubmitting, setFinishedSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      console.log("approve match");
      console.log(tutor_info.id);
      const tutorId = tutor_info.id;

      console.log(selectedTuteeId);

      const response = await fetch("http://localhost:3000/approve-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tutorId, selectedTuteeId }),
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
  } = tutor_info;

  const [modalVisible, setModalVisible] = useState(false);

  // Modal open function
  const openModal = () => setModalVisible(true);

  // Modal close function
  const closeModal = () => setModalVisible(false);

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

          <div
            className={
              "py-1 flex flex-row text-gray-500 px-2 bg-[#fbfbfb] justify-start items-center mx-3"
            }
          >
            <span className="w-1/4">Subject</span>
            <span className="w-1/4">Grade</span>
            <span className="w-1/4">Open to Disability</span>
            <span className="w-1/4">Tutoring Mode</span>
          </div>
          <div className="py-2 flex flex-row text-[black] px-2 justify-start items-center mx-3">
            <span className="w-1/4">{subject.join(", ")}</span>
            <span className="w-1/4">{grade_level_pref.join(", ")}</span>
            <span className="w-1/4">{disability_pref ? "Yes" : "No"}</span>
            <span className="w-1/4">{tutoring_mode}</span>
          </div>

          {/*tutee info in below div*/}
          <div className="flex flex-row m-6 space-x-6 items-center justify-center ">
            <TuteeSuggestionBox
              tutee_info={tutee1}
              isSelected={selectedTuteeId === tutee1.id}
              onSelect={() => setselectedTuteeId(tutee1.id)}
            />
            <TuteeSuggestionBox
              tutee_info={tutee2}
              isSelected={selectedTuteeId === tutee2.id}
              onSelect={() => setselectedTuteeId(tutee2.id)}
            />
            <TuteeSuggestionBox
              tutee_info={tutee3}
              isSelected={selectedTuteeId === tutee3.id}
              onSelect={() => setselectedTuteeId(tutee3.id)}
            />
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
                  {/* TODO: Make selectable! */}
                  {unmatched_names.map((name, index) => (
                    <li key={index}>
                      {name.firstName} {name.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            </Modal.Body>
            <Modal.Footer>
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
