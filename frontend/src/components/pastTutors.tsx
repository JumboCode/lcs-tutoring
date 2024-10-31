"use client";
import Testimonial from "./testimonials.tsx";

const PastTutors = () => {
    return(
        <div className="m-24">
            <div className="flex flex-col">
                {/*Edit the header below*/}
                <h1 className="font-interMedium text-2xl mr-2 text-[#253965] text-center">
                    PAST TUTORS
                </h1>

            </div>
            <div className="flex flex-row justify-center m-10 space-x-10">
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