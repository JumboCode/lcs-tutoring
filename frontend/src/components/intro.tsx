import Intropage_Picture from "@/assets/images/Intropage_Picture.svg";
import { Link } from "react-router-dom";

export default function Intro() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-col items-left">
          <div className="flex items-center mb-4">
            <span className="font-interBlack text-lg mr-2 text-gray-700">
              TUFTS LCS TUTORING
            </span>
            <div
              className="border-b border-gray-600"
              style={{ width: "40px" }}
            ></div>
          </div>

          <p className="font-interRegular font-bold italic text-left text-[3.5rem] w-[600px] mb-6">
            Leonard Carmichael Society Tutoring
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
          className="w-[500px] h-[500px]"
        />
      </div>
    </div>
  );
}
