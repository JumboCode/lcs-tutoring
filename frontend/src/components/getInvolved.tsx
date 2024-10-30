"use client";

import Studying from "../assets/images/homepage_studying.svg";
import TutorTutee from "../assets/images/homepage_tutor_tutee_2.svg";

const GetInvolved = () => {
    return (
      <div className="bg-[#FBFAFC] p-24">
      <div className="max-w-6xl mx-auto space-y-15">
        <div className="flex flex-col">
          <h1 className="font-interMedium text-2xl mr-2 text-[#253965] text-center">
                GET INVOLVED
          </h1>

        </div>
      <div className="flex flex-row flex-wrap justify-center gap-12">
        <div className="flex flex-row justify-center">
          
          <div className="basis-1/2 space-y-10">
              <h1 className="text-3xl">For Tufts Students</h1>
              <div className="text-left text-lg space-y-6">
                <p>This is a great opportunity for students to give back to their local community and is a rewarding experience</p>
                <p>You can sign up to be a tutor anytime through this form</p>

                <button className="rounded-full bg-[#1E3B68] p-4 text-white" type="button">Become a Tutor!</button>
              </div>
          </div>
          
          <div>
          <img src={Studying} alt="Girl in purple sweater studying"/>
          </div>

          
        </div>
        
        <div className="flex flex-row justify-center">
          <div>
            <img src={TutorTutee} alt="Your SVG"/>
          </div>
          <div className="basis-1/2 space-y-6">
            <div className="space-y-10">
              <h1 className="text-3xl">For Parents</h1>
              <p className="text-lg">
                Tutoring sessions take place for one hour a week in the Campus Center
                or Library at Tufts University.
              </p>
            </div>
            
            <p className="text-lg">
              You can sign up for your child to find a tutor anytime through this
              form. Once we have this information, we will set your child up with a
              volunteer tutor from Tufts who macthes the specifications as soon as possible.
            </p>

            <button className="rounded-full bg-[#1E3B68] p-4 text-white" type="button">Sign Up for a Tutor!</button>

          </div>
        </div>
      </div>
    </div>
    </div>
    );
}

export default GetInvolved;