"use client";
import Pin from "../assets/images/homepage_pin.svg";

const AboutUs = () => {
    return (
        <div className="p-12 md:p-24 bg-[#FBFAFC]">
            <div className="flex items-center mb-4">
            <span className="font-interMedium md:mr-2" style={{ fontSize: "32px", color: "#1F3A68" }}>
              ABOUT US
            </span>
            <div
              className="border-b border-[#E0D1ED]"
              style={{ width: "40px" }}
            ></div>
            <img src={Pin} alt="pin" className="w-14 h-14 object-right" />
            </div>


            <p className="text-2xl/relaxed md:text-5xl/relaxed" style={{color: "#7D7D7D" }}>
                We are <span className="text-[#23355E]">LCS Tutoring</span>,
                a <span className="text-[#23355E]">community service</span> organization 
                at Tufts devoted to <span className="text-[#23355E]">
                pairing Jumbos with K-12 students</span> in the 
                Medford/Somerville areas for free tutoring.
            </p>
            
        </div>
    )
}

export default AboutUs;

//#23355E