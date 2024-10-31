"use client";
import { useState } from "react";

interface boxProps {
  date: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  grade: string;
  gender: string;
  tutoring_mode: string;
  special_needs: string;
  parent_first_name: string;
  parent_last_name: string;
  phone: string;
}

import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { IoMdCall } from "react-icons/io";

export default function TuteeSuggestionBox({
  first_name,
  last_name,
  email,
  subject,
  grade,
  special_needs,
  tutoring_mode,
}: boxProps) {
  return (
    <div className="w-[500px] h-auto font-interBlack border bg-[#FFFFFF] flex flex-col text-left">
      <div className="font-interBlack flex flex-row text-[black] px-8 justify-start h-[100px] items-center">
        <span>
          {first_name} {last_name}
        </span>
      </div>
    </div>
  );
}
