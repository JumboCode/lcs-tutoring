"use client"
interface boxProps {
    date: string;
    name: string;
    email: string;
    subject: string;
    grade: string;
  }
  import { IoIosArrowForward } from "react-icons/io";
  import { BsEnvelope } from "react-icons/bs";


  export default function TuteeInfoBox({ date, name, email, subject, grade}: boxProps) {
    return (
      <div className="w-[753px] h-[98px] font-inter border-4 bg-[#FFFFFF] flex flex-col justify-between text-left ">
        <div className="font-interBlack  cursor-pointer flex flex-row text-[black] gap-12 justify-center h-screen items-center">
          <div className="mt-1 "> 
            <p>{date}</p>
          </div>
          <div className="mt-1">
            <p>{name}</p>
            <div style={{ color: "#888888", display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span><BsEnvelope /></span>
              <p>{email}</p>
            </div>
          </div>
          <div className="mt-1">
            <p>{subject}</p>
          </div>
          <div style={{color: "#888888"}} className="mt-1">
            {grade}
          </div>
          <div style={{color: "#888888", marginRight:"-30px"}} className="mt-1">
            <IoIosArrowForward/> 
          </div>
          <p style={{color: "#888888", marginLeft: "-10px", marginTop: "4.5px"}}>Details</p>
        </div>
      </div>
    );
  }
  