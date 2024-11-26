import "./services_styles.css";
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

      <h1
        style={{ fontSize: "32px", color: "#1F3A68" }}
        className="font-inter text-center hr-lines"
      >
        OUR SERVICES
      </h1>
      <div className="flex flex-row flex-wrap justify-center gap-12 m-6">
        <div id="box 1" className="flex flex-col rounded-lg box-style z-10">
          <h2 className="header-style">Weekly Tutoring Sessions</h2>
          <p className="text-style">
            Tutoring takes place once a week for 1 hour either in person (on
            campus) or virtually.
          </p>
        </div>

        <div id="box 2" className="flex flex-col rounded-lg box-style">
          <h2 className="header-style">Resources for Tutors</h2>
          <p className="text-style">
            Parents are required to provide materials, but we also have
            resources available for some subjects to further your student's
            learning - don't buy things yourself!
          </p>
        </div>

        <div id="box 3" className="flex flex-col rounded-lg box-style">
          <h2 className="header-style">All Grades Welcome</h2>
          <p className="text-style">
            Tufts students tutor any and all subjects from reading for 1st
            graders to calculus for high school students.
          </p>
        </div>

        <div id="box 4" className="flex flex-col rounded-lg box-style">
          <h2 className="header-style">Flexible Subject Choice</h2>
          <p className="text-style">
            We have over 15+ subjects available for you to choose from including
            language, sciences, and SAT/ACT prep.
          </p>
        </div>
      </div>
    </div>
  );
}
