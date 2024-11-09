import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import closeButton from '../assets/images/filter/close_button.svg';
// import { ButtonGroup } from 'react-bootstrap';
// import { ToggleButton } from 'react-bootstrap';
// import { ToggleButtonGroup } from 'react-bootstrap';

const buttonStyle: string = "items-center px-2 py-3 m-2 text-xs bg-[#FFFFFF] border-[#E7E7E7] border-1 !rounded-xl text-[#888888]";
const buttonStyleActive: string = "items-center px-2 py-3 m-2 text-xs bg-[#FFFFFF] border-[#1F3A68] border-1 !rounded-xl text-[#1F3A68]";
const applyButtonStyle: string = "items-center px-2 py-3 m-2 text-xs bg-[#DBEAFA] border-[#E7E7E7] border-1 !rounded-xl text-[#000000]";

interface FilterModalProps {
  onHide: () => void;
  onApply: (filters: FilterValues) => void;
  show: boolean;
}

interface FilterValues {
  gradeLevel: string;
  selectedSubjects: string[];
  tutoringMode: string;
  disability: string;
}

export default function FilterModal(props) {
  const[gradeLevel, setGradeLevel] = useState<string>('');
  const [selectedButtonDisability, setSelectedButtonDisability] = useState<string>('');
  const [selectedButtonMode, setSelectedButtonMode] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleToggleDisability = (button:string) => {
    setSelectedButtonDisability(button);
  }
  const handleToggleMode = (button:string) => {
    setSelectedButtonMode(button);
  }

  const handleSubjectClick = (subjectName:string) => {
    console.log(selectedSubjects);
    setSelectedSubjects((prevSelected) => prevSelected.includes(subjectName) ? 
      prevSelected.filter((name) => name !== subjectName) : 
      [...prevSelected, subjectName]);
  }

  const resetFilters = () => {
    setGradeLevel('');
    setSelectedSubjects([]);
    setSelectedButtonMode('');
    setSelectedButtonDisability('');
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
            <img src={closeButton}/>
          </button>
        </div>
        <div className={"flex flex-row justify-center"}>
          <h3 className={"text-lg font-semibold"} id="contained-modal-title-vcenter">
            Filters
          </h3>
        </div>
        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"}/>
      <Form.Group controlId="gradeLevel">
          <Form.Label>Grade Level</Form.Label>
          <Form.Control 
            as="select"
            value={gradeLevel} 
            onChange={(e) => setGradeLevel(e.target.value)}
            className={"border-[#E7E7E7]"}
          >
            <option disabled={true} value = "">Select any option</option>
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 4</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7</option>
            <option>Grade 8</option>
            <option>Grade 9</option>
            <option>Grade 10</option>
            <option>Grade 11</option>
            <option>Grade 12</option>
          </Form.Control>
        </Form.Group>
        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"}/>
        <Form.Group controlId="subjects">
          <Form.Label>Subjects</Form.Label>
          <div className={"flex flex-col"}>
             <div className={"flex flex-row"}>
              <button 
                onClick={() => handleSubjectClick('Early Reading (Grades 1-3)')}
                className={selectedSubjects.includes('Early Reading (Grades 1-3)') ? buttonStyleActive : buttonStyle}
                >Early Reading (Grades 1-3)
              </button>
              <button
               onClick={() => handleSubjectClick('Reading (Grades 3 and up)')}
               className={selectedSubjects.includes('Reading (Grades 3 and up)') ? buttonStyleActive : buttonStyle}
               >Reading (Grades 3 and up)
              </button>
              <button onClick={() => handleSubjectClick('English/Language Arts')}
               className={selectedSubjects.includes('English/Language Arts') ? buttonStyleActive : buttonStyle}
               >English/Language Arts
               </button>
              <button onClick={() => handleSubjectClick('Math (1-8)')}
               className={selectedSubjects.includes('Math (1-8)') ? buttonStyleActive : buttonStyle}
               >Math (1-8)
              </button>
              <button onClick={() => handleSubjectClick('Geometry/Trig')}
               className={selectedSubjects.includes('Geometry/Trig') ? buttonStyleActive : buttonStyle}
              >Geometry/Trig</button>
            </div>
            <div className={"flex flex-row"}>
              <button onClick={() => handleSubjectClick('Algebra')}
               className={selectedSubjects.includes('Algebra') ? buttonStyleActive : buttonStyle}
              >Algebra
              </button>
              <button onClick={() => handleSubjectClick('Precalculus')}
               className={selectedSubjects.includes('Precalculus') ? buttonStyleActive : buttonStyle}
              >Precalculus
              </button>
              <button onClick={() => handleSubjectClick('Calculus')}
               className={selectedSubjects.includes('Calculus') ? buttonStyleActive : buttonStyle}
              >Calculus
              </button>
              <button onClick={() => handleSubjectClick('Statistics')}
               className={selectedSubjects.includes('Statistics') ? buttonStyleActive : buttonStyle}
              >Statistics
              </button>
              <button onClick={() => handleSubjectClick('Computer Science')}
               className={selectedSubjects.includes('Computer Science') ? buttonStyleActive : buttonStyle}
              >Computer Science
              </button>
              <button onClick={() => handleSubjectClick('Science (1-8)')}
               className={selectedSubjects.includes('Science (1-8)') ? buttonStyleActive : buttonStyle}
              >Science (1-8)
              </button>
              <button onClick={() => handleSubjectClick('Physics')}
               className={selectedSubjects.includes('Physics') ? buttonStyleActive : buttonStyle}
              >Physics
              </button>
              <button onClick={() => handleSubjectClick('Biology')}
               className={selectedSubjects.includes('Biology') ? buttonStyleActive : buttonStyle}
              >Biology
              </button>
            </div>
            <div className={"flex flex-row"}>
              <button 
                onClick={() => handleSubjectClick('Chemisty')}
                className={selectedSubjects.includes('Chemisty') ? buttonStyleActive : buttonStyle}
                >Chemisty
              </button>
              <button 
                onClick={() => handleSubjectClick('French')}
                className={selectedSubjects.includes('French') ? buttonStyleActive : buttonStyle}
                >French
              </button>
              <button 
                onClick={() => handleSubjectClick('Spanish')}
                className={selectedSubjects.includes('Spanish') ? buttonStyleActive : buttonStyle}
                >Spanish
              </button>
              <button 
                onClick={() => handleSubjectClick('Psychology')}
                className={selectedSubjects.includes('Psychology') ? buttonStyleActive : buttonStyle}
                >Psychology
              </button>
              <button 
                onClick={() => handleSubjectClick('History/Social Studies')}
                className={selectedSubjects.includes('History/Social Studies') ? buttonStyleActive : buttonStyle}
                >History/Social Studies
              </button>
              <button 
                onClick={() => handleSubjectClick('SAT/ACT Prep')}
                className={selectedSubjects.includes('SAT/ACT Prep') ? buttonStyleActive : buttonStyle}
                >SAT/ACT Prep
              </button>
              <button 
                onClick={() => handleSubjectClick('Music')}
                className={selectedSubjects.includes('Music') ? buttonStyleActive : buttonStyle}
                >Music
              </button>
            </div>
          </div>
        </Form.Group>

        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"}/>
        <Form.Group controlId="tutoringMode" className="flex flex-col mt-3">
          <Form.Label>Tutoring Mode</Form.Label>
          <div className={"flex flex-row"}>
            <button
              onClick={() => handleToggleMode('virtualOnly')}
              className={selectedButtonMode === 'virtualOnly' ? buttonStyleActive : buttonStyle}
            >
                Virtual Only
            </button>
            <button
              onClick={() => handleToggleMode('In-PersonOnly')}
              className={selectedButtonMode === 'In-PersonOnly' ? buttonStyleActive : buttonStyle}>
                In-Person Only
            </button>
          </div>
        </Form.Group>
        
        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"}/>
        <Form.Group controlId='disability' className="flex flex-col mt-3">
          <Form.Label>Disability</Form.Label>
          <div className={"flex flex-row"}>
            <button
              onClick={() => handleToggleDisability('yes')}
              className={selectedButtonDisability === 'yes' ? buttonStyleActive : buttonStyle}
            >
                Yes
            </button>
            <button
              onClick={() => handleToggleDisability('no')}
              className={selectedButtonDisability === 'no' ? buttonStyleActive : buttonStyle}>
                No
            </button>
          </div>
        </Form.Group>
        <hr className={"h-0.5 my-3 bg-[#E7E7E7] border-0"}/>
        <div className={"justify-center"}>
          <div className={"flex flex-row justify-center"}>
            <button 
            onClick={() => resetFilters()}
            className={buttonStyleActive}
            >Reset
            </button>
            <button 
              onClick={props.onHide}
              className={applyButtonStyle}
              >Apply
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}