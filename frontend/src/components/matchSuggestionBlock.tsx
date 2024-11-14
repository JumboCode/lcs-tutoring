"use client";

import TuteeSuggestionBox from "./tuteeSuggestionBox";

import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import { tutorInfo } from "../types";
import { tuteeInfo } from "../types";

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
          className="rounded-lg bg-white px-5 py-3 border text-grey text-lg hover:bg-gray-200"
          type="button"
        >
          <span className="inline-block ml-0.5">
            <FaCheck />
          </span>{" "}
          Custom Match
        </button>
      </div>
    </div>
  );
};

export default MatchSuggestionBlock;
