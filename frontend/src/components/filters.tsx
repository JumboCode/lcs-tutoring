import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import closeButton from "../assets/images/filter/close_button.svg";
// import { ButtonGroup } from 'react-bootstrap';
// import { ToggleButton } from 'react-bootstrap';
// import { ToggleButtonGroup } from 'react-bootstrap';

const buttonStyle: string =
  "items-center px-2 py-2 min-w-[50px] hover:bg-gray-100 m-2 text-xs bg-[#FFFFFF] border-[#E7E7E7] border-1 !rounded-xl text-[#888888]";
const buttonStyleActive: string =
  "items-center px-2 py-2 min-w-[50px] m-2 bg-[#d8e0ed] text-xs bg-[#FFFFFF] border-[#5874a3] border-1 !rounded-xl text-[#1F3A68]";
const applyButtonStyle: string =
  "items-center px-2 py-2 min-w-[80px] m-2 text-xs bg-[#7ea5e4] text-white border-[#E7E7E7] hover:bg-[#4174c2] border-1 !rounded-xl text-[#000000]";
const resetButtonStyle: string =
  "items-center px-2 py-2 min-w-[80px] m-2 text-xs bg-[#FFFFFF] border-[#E7E7E7] hover:bg-gray-200 border-1 !rounded-xl text-[#000000]";

interface FilterModalProps {
  onHide: () => void;
  onApply: (filters: FilterValues) => void;
  show: boolean;
}

interface FilterValues {
  gradeLevels?: number[];
  selectedSubjects?: string[];
  tutoringMode?: string;
  disability?: boolean;
}

export default function FilterModal(props: FilterModalProps) {
  const [gradeLevels, setGradeLevels] = useState<number[]>([]);
  const [selectedButtonDisability, setSelectedButtonDisability] =
    useState<boolean>();
  const [selectedButtonMode, setSelectedButtonMode] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleToggleDisability = (button: boolean) => {
    setSelectedButtonDisability(button);
  };
  const handleToggleMode = (button: string) => {
    setSelectedButtonMode(button);
  };

  const handleGradeClick = (gradeLevel: number) => {
    console.log(gradeLevels);
    setGradeLevels((prevSelected) =>
      prevSelected.includes(gradeLevel)
        ? prevSelected.filter((grade) => grade !== gradeLevel)
        : [...prevSelected, gradeLevel]
    );
  };

  const handleSubjectClick = (subjectName: string) => {
    console.log(selectedSubjects);
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectName)
        ? prevSelected.filter((name) => name !== subjectName)
        : [...prevSelected, subjectName]
    );
  };

  const resetFilters = () => {
    setGradeLevels([]);
    setSelectedSubjects([]);
    setSelectedButtonMode("");
    setSelectedButtonDisability(undefined);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* <Modal.Header closeButton>
        
      </Modal.Header> */}
      <Modal.Body>
        <div className={"flex justify-end"}>
          <button onClick={props.onHide}>
            <img src={closeButton} />
          </button>
        </div>
        <div className={"flex flex-row justify-center"}>
          <h3
            className={"text-lg font-semibold"}
            id="contained-modal-title-vcenter"
          >
            Filters
          </h3>
        </div>
        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"} />
        <Form.Group controlId="gradeLevels">
          <Form.Label>Grade Levels</Form.Label>
          <span className="ml-3 text-xs text-bold text-gray-400">
            (Select multiple)
          </span>
          <div className={"flex flex-col"}>
            <div className={"flex flex-row"}>
              <button
                // kindergarten is -1 because 0 is url query default for undef
                onClick={() => handleGradeClick(-1)}
                className={
                  gradeLevels.includes(-1) ? buttonStyleActive : buttonStyle
                }
              >
                Kindergarten
              </button>
              <button
                onClick={() => handleGradeClick(1)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(1) ? buttonStyleActive : buttonStyle
                }`}
              >
                1st Grade
              </button>
              <button
                onClick={() => handleGradeClick(2)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(2) ? buttonStyleActive : buttonStyle
                }`}
              >
                2nd Grade
              </button>
              <button
                onClick={() => handleGradeClick(3)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(3) ? buttonStyleActive : buttonStyle
                }`}
              >
                3rd Grade
              </button>
              <button
                onClick={() => handleGradeClick(4)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(4) ? buttonStyleActive : buttonStyle
                }`}
              >
                4th Grade
              </button>
              <button
                onClick={() => handleGradeClick(5)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(5) ? buttonStyleActive : buttonStyle
                }`}
              >
                5th Grade
              </button>
              <button
                onClick={() => handleGradeClick(6)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(6) ? buttonStyleActive : buttonStyle
                }`}
              >
                6th Grade
              </button>
            </div>
            <div className={"flex flex-row"}>
              <button
                onClick={() => handleGradeClick(7)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(7) ? buttonStyleActive : buttonStyle
                }`}
              >
                7th Grade
              </button>
              <button
                onClick={() => handleGradeClick(8)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(8) ? buttonStyleActive : buttonStyle
                }`}
              >
                8th Grade
              </button>
              <button
                onClick={() => handleGradeClick(9)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(9) ? buttonStyleActive : buttonStyle
                }`}
              >
                9th Grade
              </button>
              <button
                onClick={() => handleGradeClick(10)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(10) ? buttonStyleActive : buttonStyle
                }`}
              >
                10th Grade
              </button>
              <button
                onClick={() => handleGradeClick(11)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(11) ? buttonStyleActive : buttonStyle
                }`}
              >
                11th Grade
              </button>
              <button
                onClick={() => handleGradeClick(12)}
                className={`!min-w-[90px] ${
                  gradeLevels.includes(12) ? buttonStyleActive : buttonStyle
                }`}
              >
                12th Grade
              </button>
            </div>
          </div>
        </Form.Group>

        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"} />
        <Form.Group controlId="subjects">
          <Form.Label>Subjects</Form.Label>
          <span className="ml-3 text-xs text-bold text-gray-400">
            (Select multiple)
          </span>
          <div className={"flex flex-col"}>
            <div className={"flex flex-row"}>
              <button
                onClick={() => handleSubjectClick("Early Reading (Grades 1-3)")}
                className={
                  selectedSubjects.includes("Early Reading (Grades 1-3)")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Early Reading (Grades 1-3)
              </button>
              <button
                onClick={() => handleSubjectClick("Reading (Grades 3 and up)")}
                className={
                  selectedSubjects.includes("Reading (Grades 3 and up)")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Reading (Grades 3 and up)
              </button>
              <button
                onClick={() => handleSubjectClick("English/Language Arts")}
                className={
                  selectedSubjects.includes("English/Language Arts")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                English/Language Arts
              </button>
              <button
                onClick={() => handleSubjectClick("Math (1-8)")}
                className={
                  selectedSubjects.includes("Math (1-8)")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Math (1-8)
              </button>
              <button
                onClick={() => handleSubjectClick("Geometry/Trig")}
                className={
                  selectedSubjects.includes("Geometry/Trig")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Geometry/Trig
              </button>
            </div>
            <div className={"flex flex-row"}>
              <button
                onClick={() => handleSubjectClick("Algebra")}
                className={
                  selectedSubjects.includes("Algebra")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Algebra
              </button>
              <button
                onClick={() => handleSubjectClick("Precalculus")}
                className={
                  selectedSubjects.includes("Precalculus")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Precalculus
              </button>
              <button
                onClick={() => handleSubjectClick("Calculus")}
                className={
                  selectedSubjects.includes("Calculus")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Calculus
              </button>
              <button
                onClick={() => handleSubjectClick("Statistics")}
                className={
                  selectedSubjects.includes("Statistics")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Statistics
              </button>
              <button
                onClick={() => handleSubjectClick("Computer Science")}
                className={
                  selectedSubjects.includes("Computer Science")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Computer Science
              </button>
              <button
                onClick={() => handleSubjectClick("Science (1-8)")}
                className={
                  selectedSubjects.includes("Science (1-8)")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Science (1-8)
              </button>
              <button
                onClick={() => handleSubjectClick("Physics")}
                className={
                  selectedSubjects.includes("Physics")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Physics
              </button>
              <button
                onClick={() => handleSubjectClick("Biology")}
                className={
                  selectedSubjects.includes("Biology")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Biology
              </button>
            </div>
            <div className={"flex flex-row"}>
              <button
                onClick={() => handleSubjectClick("Chemisty")}
                className={
                  selectedSubjects.includes("Chemisty")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Chemisty
              </button>
              <button
                onClick={() => handleSubjectClick("French")}
                className={
                  selectedSubjects.includes("French")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                French
              </button>
              <button
                onClick={() => handleSubjectClick("Spanish")}
                className={
                  selectedSubjects.includes("Spanish")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Spanish
              </button>
              <button
                onClick={() => handleSubjectClick("Psychology")}
                className={
                  selectedSubjects.includes("Psychology")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Psychology
              </button>
              <button
                onClick={() => handleSubjectClick("History/Social Studies")}
                className={
                  selectedSubjects.includes("History/Social Studies")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                History/Social Studies
              </button>
              <button
                onClick={() => handleSubjectClick("SAT/ACT Prep")}
                className={
                  selectedSubjects.includes("SAT/ACT Prep")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                SAT/ACT Prep
              </button>
              <button
                onClick={() => handleSubjectClick("Music")}
                className={
                  selectedSubjects.includes("Music")
                    ? buttonStyleActive
                    : buttonStyle
                }
              >
                Music
              </button>
            </div>
          </div>
        </Form.Group>

        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"} />
        <Form.Group controlId="tutoringMode" className="flex flex-col mt-3">
          <Form.Label>Tutoring Mode</Form.Label>
          <div className={"flex flex-row"}>
            <button
              onClick={() => handleToggleMode("Online")}
              className={
                selectedButtonMode === "Online"
                  ? buttonStyleActive
                  : buttonStyle
              }
            >
              Virtual Only
            </button>
            <button
              onClick={() => handleToggleMode("In-person")}
              className={
                selectedButtonMode === "In-person"
                  ? buttonStyleActive
                  : buttonStyle
              }
            >
              In-Person Only
            </button>
            <button
              onClick={() => handleToggleMode("Hybrid")}
              className={
                selectedButtonMode === "Hybrid"
                  ? buttonStyleActive
                  : buttonStyle
              }
            >
              Hybrid
            </button>
            <button
              onClick={() => handleToggleMode("Anything")}
              className={
                selectedButtonMode === "Anything"
                  ? buttonStyleActive
                  : buttonStyle
              }
            >
              Anything is fine
            </button>
          </div>
        </Form.Group>

        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"} />
        <Form.Group controlId="disability" className="flex flex-col mt-3">
          <Form.Label>Disability</Form.Label>
          <div className={"flex flex-row"}>
            <button
              onClick={() => handleToggleDisability(true)}
              className={
                selectedButtonDisability ? buttonStyleActive : buttonStyle
              }
            >
              Yes
            </button>
            <button
              onClick={() => handleToggleDisability(false)}
              className={
                !selectedButtonDisability &&
                selectedButtonDisability !== undefined
                  ? buttonStyleActive
                  : buttonStyle
              }
            >
              No
            </button>
          </div>
        </Form.Group>
        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"} />
        <div className={"justify-center"}>
          <div className={"flex flex-row justify-center"}>
            <button onClick={() => resetFilters()} className={resetButtonStyle}>
              Reset
            </button>
            <button
              onClick={() => {
                props.onApply({
                  gradeLevels,
                  selectedSubjects,
                  tutoringMode: selectedButtonMode,
                  disability: selectedButtonDisability,
                });
                props.onHide();
              }}
              className={applyButtonStyle}
            >
              Apply
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
