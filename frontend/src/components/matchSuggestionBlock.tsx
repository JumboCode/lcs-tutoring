"use client";

import TuteeSuggestionBox from "./tuteeSuggestionBox";

import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import { tutorInfo } from "../types";
import { tuteeInfo } from "../types";

import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

const BG_COLOR = "#fbfbfb"

const MatchSuggestionBlock = ({
  tutor_info,
  tutee1,
  tutee2,
  tutee3,
  onMatchApproved,
}: {
  tutor_info: tutorInfo;
  tutee1: tuteeInfo;
  tutee2: tuteeInfo;
  tutee3: tuteeInfo;
  onMatchApproved: (tutorId: string, tuteeId: string) => void;
}) => {

  const [selectedTuteeEmail, setselectedTuteeEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    if (!selectedTuteeEmail) {
      alert("Please select a tutee first");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("approve match");
      console.log(tutor_info);
    
      console.log(selectedTuteeEmail);
      const response = await fetch('/api/matches/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutorId: tutor_info.id,
          tuteeId: selectedTuteeEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve match');
      }

      onMatchApproved(tutor_info.id, selectedTuteeEmail);
    } catch (error) {
      console.error('Error approving match:', error);
      alert('Failed to approve match. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const {
    first_name,
    last_name,
    email,
    phone,
    subject,
    grade,
    open_to_disability,
    tutoring_mode,
  } = tutor_info;

  const [modalVisible, setModalVisible] = useState(false);

  // Modal open function
  const openModal = () => setModalVisible(true);

  // Modal close function
  const closeModal = () => setModalVisible(false);


  interface TuteeName {
    firstName: string;
    lastName: string;
  }
    const [unmatchedNames, setUnmatchedNames] = useState<TuteeName[]>([]);

    useEffect(() => {
        const fetchTutees = async () => {
          try {
            const response = await fetch("http://localhost:5432/tutees");
            if (!response.ok) {
              throw new Error("Failed to fetch tutees");
            }
            const data = await response.json(); // Parse the response body as JSON
            const { matchedTutees, unmatchedTutees } = data;
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
      }, []);
  

  return (
    <div className="border rounded-lg bg-white p-6 m-8">
      <div className="flex space-x-6 mx-6">
        <span className="font-interBlack font-bold text-lg">
          {first_name} {last_name}
        </span>
        <div className="flex pt-2" style={{ color: "#6B7280" }}>
          <BsEnvelope />
          <span className="pl-2 text-sm font-interBlack text-gray-500 ">
            {email}
          </span>
        </div>
        <div className="flex pt-2" style={{ color: "#6B7280" }}>
          <FiPhone />
          <span className="pl-2 text-sm font-interBlack text-gray-500">
            {phone}
          </span>
        </div>

        <div className="flex flex-1 justify-end">
          <RiArrowDropDownLine size={40} />
        </div>
      </div>

      <div className={"py-1 font-interBlack flex flex-row text-gray-500 px-2 bg-[#fbfbfb] justify-start items-center mx-3"}>
        <span className="w-1/4">Subject</span>
        <span className="w-1/4">Grade</span>
        <span className="w-1/4">Open to Disability</span>
        <span className="w-1/4">Tutoring Mode</span>
      </div>
      <div className="py-2 font-interBlack flex flex-row text-[black] px-2 justify-start items-center mx-3">
        <span className="w-1/4">{subject.join(", ")}</span>
        <span className="w-1/4">{grade.join(", ")}</span>
        <span className="w-1/4">{open_to_disability}</span>
        <span className="w-1/4">{tutoring_mode}</span>
      </div>

      {/*tutee info in below div*/}
      <div className="flex flex-row m-6 space-x-6 items-center justify-center ">
      <TuteeSuggestionBox 
  tutee_info={tutee1}
  isSelected={selectedTuteeEmail === tutee1.email}
  onSelect={() => setselectedTuteeEmail(tutee1.email)}
/>
<TuteeSuggestionBox 
  tutee_info={tutee2}
  isSelected={selectedTuteeEmail === tutee2.email}
  onSelect={() => setselectedTuteeEmail(tutee2.email)}
/>
<TuteeSuggestionBox 
  tutee_info={tutee3}
  isSelected={selectedTuteeEmail === tutee3.email}
  onSelect={() => setselectedTuteeEmail(tutee3.email)}
/>
      </div>

      {/*buttons*/}
      <div className="flex flex-row-reverse space-x-6 space-x-reverse">
        <button
          className="rounded-xl bg-[#1E3B68] px-5 py-3 text-white text-lg hover:bg-blue-700 disabled:opacity-50"
          type="button"
          onClick={handleApprove}
          disabled={!selectedTuteeEmail || isSubmitting}
        >
          <span className="inline-block ml-0.5">
            <FaCheck />
          </span>{" "}
          {isSubmitting ? 'Processing...' : 'Approve'}
        </button>
        <button
          onClick={openModal} 
          className="rounded-xl bg-white px-5 py-3 border text-gray-700 text-lg hover:bg-gray-200"
          type="button"
        >
          {/* This is where you will complete your ticket */}
          <span className="inline-block ml-0.5">
            <FaCheck />
          </span>{" "}
          Custom Match
        </button>
      </div>
      <Modal show={modalVisible} onHide={closeModal}>
        <Modal.Header closeButton>
            <Modal.Title>Custom Match</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
            <ul>
            {unmatchedNames.map((name, index) => (
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
  );
};

export default MatchSuggestionBlock;
