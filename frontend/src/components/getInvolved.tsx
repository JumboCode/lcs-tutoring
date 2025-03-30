"use client";

import { Link } from "react-router-dom";
import Studying from "../assets/images/homepage_studying.svg";
import TutorTutee from "../assets/images/homepage_tutor_tutee_2.svg";

export default function GetInvolved() {
  return (
    <div className="bg-[#FBFAFC] p-12 md:p-24">
      <div className="max-w-6xl mx-auto space-y-15">
        <div className="flex items-center justify-center pb-10">
          <div className="border-b-2 border-[#E0D1ED] w-[40px]"></div>
          <h1 className="text-3xl text-[#1F3A68] mx-4 text-center">
            GET INVOLVED
          </h1>
          <div className="border-b-2 border-[#E0D1ED] w-[40px]"></div>
        </div>

        <div className="flex flex-wrap">
          <div className="flex flex-col lg:flex-row">
            <div className="basis-full lg:basis-1/2 space-y-10 mb-24">
              <h1 className="text-left font-inter font-semibold text-3xl">
                For Tufts Students
              </h1>
              <div className="text-left space-y-6 text-[#545353] text-xl">
                <p>
                  This is a great opportunity for students to give back to their
                  local community and is a rewarding experience
                </p>
                <p>You can sign up to be a tutor anytime through this form:</p>
                <div className="pt-6">
                  <Link
                    className="rounded-full bg-[#1E3B68] py-3 px-4 text-white text-lg hover:bg-[#375e98]"
                    to="/tutor-form"
                  >
                    Become a Tutor!
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-24">
              <img src={Studying} alt="Girl in purple sweater studying" />
            </div>
          </div>

          <div className="flex flex-col-reverse lg:flex-row justify-center">
            <div className="mt-24 lg:mt-0">
              <img src={TutorTutee} alt="Your SVG" />
            </div>

            <div className="basis-1/2 space-y-10">
              <div className="space-y-6">
                <h1 className="text-left font-inter font-semibold text-3xl">
                  For Parents
                </h1>
                <p className="text-left text-xl text-[#545353]">
                  Tutoring sessions take place for one hour a week in the Campus
                  Center or Library at Tufts University.
                </p>
              </div>

              <p className="text-left text-xl text-[#545353]">
                You can sign up for your child to find a tutor anytime through
                this form. Once we have this information, we will set your child
                up with a volunteer tutor from Tufts who matches the
                specifications as soon as possible.
              </p>
              <div className="pt-2">
                <Link
                  className="rounded-full bg-[#1E3B68] py-3 px-4 text-white text-lg hover:bg-[#375e98]"
                  to="/tutee-form"
                >
                  Sign Up for a Tutor!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
