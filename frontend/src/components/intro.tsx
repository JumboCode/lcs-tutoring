import Intropage_Picture from "@/assets/images/Intropage_Picture.svg";

export default function Intro() {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-[#FFFFFF]">
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-col items-left">
          <div className="flex items-center mb-4">
            <span className="font-interMedium text-lg mr-2 text-gray-700">
              TUFTS LCS TUTORING
            </span>
            <div
              className="border-b border-gray-600"
              style={{ width: "40px" }}
            ></div>
          </div>
          <p className="font-inter font-bold text-left text-[3.5rem] w-[600px] mb-6">
            Leonard Carmichael Society Tutoring
          </p>
          <button className="font-inter font-semibold bg-[#BFDBF7] hover:bg-blue-300 w-[170px] rounded-full font-semibold py-2 px-5">
            Become a Tutor!
          </button>
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
