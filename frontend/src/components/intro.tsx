import Intropage_Picture from "@/assets/images/Intropage_Picture.svg";
import { Link } from "react-router-dom";

export default function Intro() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] w-full">
      <div className="flex flex-row items-center justify-center pl-8 md:p-0">
        <div className="flex flex-col items-left">
          <div className="flex items-center mb-4">
            <span className="font-interBlack text-lg mr-2 text-gray-700">
              LEONARD CARMICHAEL SOCIETY
            </span>
            <div
              className="border-b border-gray-600"
              style={{ width: "40px" }}
            ></div>
          </div>
          <p className="font-bold italic text-left text-[3.5rem] md:w-[600px] mb-6">
            Tufts LCS Tutoring
          </p>
          <Link
            className="font-inter bg-[#BFDBF7] hover:bg-blue-300 w-[180px] rounded-full font-semibold py-3 text-center"
            to="/tutor-form"
          >
            Become a Tutor!
          </Link>
        </div>
        <img
          src={Intropage_Picture}
          alt="Intropage Picture"
          className="w-[500px] h-[500px] hidden xl:block"
        />
      </div>
    </div>
  );
}
