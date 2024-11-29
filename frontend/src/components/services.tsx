import Notepad from "../assets/images/homepage_notepad.svg";
import Ruler from "../assets/images/homepage_ruler.svg";

export default function ServicesBoxes() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 relative mb-16">
      <div className="absolute bottom-[-30px] right-0 z-0">
        <img src={Ruler} alt="Triangular Ruler" />
      </div>
      <div className="absolute top-[7vh] left-[-10vh] md:left-[10vh] lg:left-[5vh] z-0">
        <img src={Notepad} alt="Notepad" />
      </div>
      <h1 className="text-3xl text-[#1F3A68] text-center relative max-w-[400px] m-12 mx-auto">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-[62.47px] bg-[#E4D1F0]" />
        OUR SERVICES
        <span className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-[62.47px] bg-[#E4D1F0]" />
      </h1>
      <div className="flex flex-row flex-wrap justify-center gap-12 m-6">
        <div
          id="box 1"
          className="px-8 flex flex-col rounded-lg bg-[#FBFAFC] w-[526px] z-10"
        >
          <h2 className="text-3xl text-[#1F3A68] pt-5">
            Weekly Tutoring Sessions
          </h2>
          <p className="text-2xl text-[#555454] pt-4 pb-5">
            Tutoring takes place once a week for 1 hour either in person (on
            campus) or virtually.
          </p>
        </div>
        <div
          id="box 2"
          className="px-8 flex flex-col rounded-lg bg-[#FBFAFC] w-[526px]"
        >
          <h2 className="text-3xl text-[#1F3A68] pt-5">Resources for Tutors</h2>
          <p className="text-2xl text-[#555454] pt-4 pb-5">
            Parents are required to provide materials, but we also have
            resources available for some subjects to further your student's
            learning - don't buy things yourself!
          </p>
        </div>
        <div
          id="box 3"
          className="px-8 flex flex-col rounded-lg bg-[#FBFAFC] w-[526px]"
        >
          <h2 className="text-3xl text-[#1F3A68] pt-5">All Grades Welcome</h2>
          <p className="text-2xl text-[#555454] pt-4 pb-5">
            Tufts students tutor any and all subjects from reading for 1st
            graders to calculus for high school students.
          </p>
        </div>
        <div
          id="box 4"
          className="px-8 flex flex-col rounded-lg bg-[#FBFAFC] w-[526px]"
        >
          <h2 className="text-3xl text-[#1F3A68] pt-5">
            Flexible Subject Choice
          </h2>
          <p className="text-2xl text-[#555454] pt-4 pb-5">
            We have over 15+ subjects available for you to choose from including
            language, sciences, and SAT/ACT prep.
          </p>
        </div>
      </div>
    </div>
  );
}
