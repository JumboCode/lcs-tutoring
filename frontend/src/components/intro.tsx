import elephantLogo from "@/assets/images/gray_logo.svg"; // Assuming you have the logo
import "./LcsTutoringIntro.css"; // this implements the css

export default function LcsTutoringIntro() {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-col items-left">
          <div className="flex items-center mb-4">
            <span className="text-lg mr-2 text-gray-700">
              TUFTS LCS TUTORING
            </span>
            <div
              className="border-b border-gray-600"
              style={{ width: "40px" }}
            ></div>
          </div>
          <p className="text-left text-[3.5rem] w-[600px] mb-6">
            Leonard Carmichael Society Tutoring
          </p>
          <button className="bg-[#BFDBF7] w-[170px] rounded-full font-semibold py-2 px-5">
            Become a Tutor!
          </button>
        </div>
        <img src={elephantLogo} alt="image" className="w-[300px] h-[300px]" />
      </div>
    </div>
  );
}
