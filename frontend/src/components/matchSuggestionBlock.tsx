"use client";

import TuteeSuggestionBox from "./tuteeSuggestionBox";
import boxProps from "./tuteeSuggestionBox";

import { BsEnvelope } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";

interface tutorInfo {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    subject: string; /* why is this not a array */
    grade: string[];
    open_to_disability: string[]; /* why is this not a string */
    tutoring_mode: string;
}

const MatchSuggestionBlock = ({
    tutor_info, tutee1, tutee2, tutee3
  }: {
    tutor_info: tutorInfo;
    tutee1: boxProps;
    tutee2: boxProps;
    tutee3: boxProps;
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
    // const boxProps = {
    //     first_name: "Anne",
    //     last_name: "Wu",
    //     email: "sometign@gmail.com",
    //     subject: "CS",
    //     grade: "10",
    //     special_needs: "no",
    //     tutoring_mode: "zoom",
    // };

    return(
        <div className="border rounded-lg bg-white p-6 mx-8 my-8">
            <div className="flex p-6 space-x-6 mx-6">
                <span className="font-interBlack text-lg">
                    {first_name} {last_name}
                </span>
                <div
                    className="flex pt-2"
                    style={{ color: "#6B7280" }}
                >
                    <BsEnvelope />
                    <span className="pl-2 text-sm font-interBlack text-gray-500 ">
                    {email}
                    </span>
                </div>
                <div
                    className="flex pt-2"
                    style={{ color: "#6B7280" }}
                >
                    <FiPhone />
                    <span className="pl-2 text-sm font-interBlack text-gray-500">
                    {phone}
                    </span>
                </div>

                <div className="flex flex-1 justify-end">
                    <RiArrowDropDownLine size={40}/>
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
                <span className="w-1/4">{open_to_disability[0]}</span>
                <span className="w-1/4">{tutoring_mode}</span>
            </div>

            {/*tutee info in below div*/}
            <div className="flex flex-row m-6 space-x-6 items-center justify-center ">
                <TuteeSuggestionBox box_props={tutee1} />
                <TuteeSuggestionBox box_props={tutee2} />
                <TuteeSuggestionBox box_props={tutee3} />
            </div>

            {/*buttons*/}
            <div className="flex flex-row-reverse space-x-6 space-x-reverse">
                <button className="rounded-lg bg-[#1E3B68] px-5 py-3 text-white text-lg" type="button">
                    <FaCheck className="inline ml-0.5"/> Approve
                </button>
                <button className="rounded-lg bg-white px-5 py-3 border text-grey text-lg" type="button">
                    <FaPlus className="inline ml-0.5"/> Custom Match
                </button>
            </div>


        </div>
    )
}

export default MatchSuggestionBlock;