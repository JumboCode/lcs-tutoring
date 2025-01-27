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

const MatchSuggestionBlock = ({
  tutor_info,
  tutee1,
  tutee2,
  tutee3,
}: {
  tutor_info: tutorInfo;
  tutee1: tuteeInfo;
  tutee2: tuteeInfo;
  tutee3: tuteeInfo;
}) => {
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
  }, []);

  return (
    <div className="border rounded-lg bg-white p-6 mx-8 my-8">
      <div className="flex p-6 space-x-6 mx-6">
        <span className="font-interBlack text-lg">
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

      <div className="py-1 font-interBlack flex flex-row text-gray-500 px-8 bg-gray-100 justify-start items-center mx-12">
        <span className="w-1/4">Grade</span>
        <span className="w-1/4">Subject</span>
        <span className="w-1/4">Open to Disability</span>
        <span className="w-1/4">Tutoring Mode</span>
      </div>
      <div className="py-2 font-interBlack flex flex-row text-[black] px-8 justify-start items-center mx-12">
        <span className="w-1/4">{grade.join(", ")}</span>
        <span className="w-1/4">{subject}</span>
        <span className="w-1/4">{open_to_disability}</span>
        <span className="w-1/4">{tutoring_mode}</span>
      </div>

      {/*tutee info in below div*/}
      <div className="flex flex-row m-6 space-x-6 items-center justify-center ">
        <TuteeSuggestionBox tutee_info={tutee1} />
        <TuteeSuggestionBox tutee_info={tutee2} />
        <TuteeSuggestionBox tutee_info={tutee3} />
      </div>

      {/*buttons*/}
      <div className="flex flex-row-reverse space-x-6 space-x-reverse">
        <button
          className="rounded-lg bg-[#1E3B68] px-5 py-3 text-white text-lg hover:bg-blue-700"
          type="button"
        >
          <span className="inline-block ml-0.5">
            <FaCheck />
          </span>{" "}
          Approve
        </button>
        <button
          onClick={openModal}
          className="rounded-lg bg-white px-5 py-3 border text-gray-700 text-lg hover:bg-gray-200"
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
