"use client";
import Pin from "../assets/images/homepage_pin.svg";

export default function AboutUs() {
  return (
    <div className="p-12 md:p-24 bg-[#FBFAFC]">
      <div className="flex items-center mb-4">
        <span className="font-interMedium mr-2 text-3xl text-[#1F3A68]">
          ABOUT US
        </span>
        <div className="border-b border-[#E0D1ED] w-[40px]"></div>
        <img src={Pin} alt="pin" className="w-14 h-14 object-right" />
      </div>

      <p className="text-2xl/relaxed md:text-4xl/relaxed text-[#7D7D7D]">
        We are <span className="text-[#23355E]">LCS Tutoring</span>, a{" "}
        <span className="text-[#23355E]">community service</span> organization
        at Tufts devoted to{" "}
        <span className="text-[#23355E]">
          pairing Jumbos with K-12 students
        </span>{" "}
        in the Medford/Somerville areas for free tutoring.
      </p>
    </div>
  );
}
