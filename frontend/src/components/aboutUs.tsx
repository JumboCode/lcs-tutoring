"use client";

const AboutUs = () => {
    return (
        <div className="mx-auto p-24 bg-[#FBFAFC]">
            <div className="flex items-center mb-4">
            <span className="font-interMedium text-2xl mr-2 text-[#253965]">
              ABOUT US
            </span>
            <div
              className="border-b border-[#E0D1ED]"
              style={{ width: "40px" }}
            ></div>
            </div>


            <p className="text-[#7D7D7D] text-3xl">
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