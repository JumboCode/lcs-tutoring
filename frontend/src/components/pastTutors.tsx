"use client";
import box from "./testimonials.tsx";
import boxProps from "./testimonials.tsx";

const PastTutors = () => {
    return(
        <div>
            <div className="flex flex-col">
                {/*Edit the header below*/}
                <h1 className="font-interMedium text-2xl mr-2 text-[#253965] text-center">
                    PAST TUTORS
                </h1>

            </div>
            <div className="flex flex-row">
                {/*
                Not sure how to use the box function
                <box name="name" message="message" major="major" year="year"/>
                */}
            </div>
        </div>
    )
}

export default PastTutors;