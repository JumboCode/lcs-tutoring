"use client";
import Testimonial from "./testimonials.tsx";
import Pen from "../assets/images/homepage_pen.svg";
import Notebook from "../assets/images/homepage_notebook.svg";

const PastTutors = () => {
    return(
        <div className="m-6 lg:m-24 relative">

            <div className="absolute size-40 lg:size-60 top-10 lg:top-0 right-0 z-0">
            <img src={Pen} alt="Pen" style={{ width: '250px', height: 'auto' }}/>
            </div>
            <div className="absolute -bottom-10 left-0 z-0">
            <img src={Notebook} alt="Blue notebook" style={{ width: '250px', height: 'auto' }}/>
            </div>


            <div className="flex flex-col">
                <div className="flex items-center justify-center">
                    <div className=" border-b-2 border-[#E0D1ED]" style={{ width: "40px" }}></div>
                    <h1 className="font-interMedium mx-4 text-center" style={{ fontSize: "32px", color: "#1F3A68" }}>
                    PAST TUTORS
                    </h1>
                    <div className=" border-b-2 border-[#E0D1ED]" style={{ width: "40px" }}></div>
                </div>

            </div>
            <div className="flex flex-col lg:flex-row justify-center m-10 space-y-10 lg:space-y-0 lg:space-x-10 relative z-5">
                <Testimonial 
                    name="Anna" 
                    message="I love “AHA” moments. Once, I was explaining to someone how to deal with exponents in fractions, and I saw the exact moment it clicked in their brain. Knowing that I helped someone finally understand something that was plaguing them was extremely rewarding." 
                    major="BIOCHEM & BIOPSYCH" 
                    year="2025"/>
                <Testimonial 
                    name="Teagan" 
                    message="My favorite memory while tutoring my student is when we were talking about fractions, and she was nodding, still trying to figure it out before her eyes sort of cleared and she said “I GOT IT!” and proceed to give an example. Her dedication always makes our sessions rewarding. In addition, she also drew spectacular frog army on the whiteboard, but that doesn’t relate too much to the sessions themselves." 
                    major="UNDECIDED (IR)" 
                    year="2027"/>
                <Testimonial 
                    name="Lina" 
                    message="I love reading my student’s creative stories! They’re pretty much all about dragons, super interesting. Get to know your student(s)! They’re much more attentive if they see you as a friend." 
                    major="BIOCHEMISTRY" 
                    year="2024"/>
            </div>
        </div>
    )
}

export default PastTutors;