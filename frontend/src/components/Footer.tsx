// Footer.tsx
import GrayLogo from "../assets/images/gray_logo.svg";
import { Instagram } from "lucide-react";
import "./Footer.css"
const Footer = () => {
  return (
    <div className="h-screen font-inter">
      <div className="flex px-20 py-8 w-screen flex-row bg-blue-100 h-80">
        <div className="w-1/2 flex flex-col justify-between justify-items-start space-y-4">
          <img src={GrayLogo} alt="Your SVG" className="w-14 h-14" />
          <p className="text-[#2F3335] text-sm mt-5">Tufts LCS Tutoring © 2024</p>
        </div>
        <div className="w-1/2 flex flex-col justify-between justify-items-start space-y-4 items-end">
          <div className="flex flex-col space-y-2">
            <p className="text-black text-base font-bold font-inter">Pages</p>
            <p className="text-[#2F3335] text-base">Home</p>
            <p className="text-[#2F3335] text-base">About</p>
            <p className="text-[#2F3335] text-base">Team</p>
            <p className="text-[#2F3335] text-base">Forms</p>
          </div>
        <p className="text-[#2F3335] text-sm inline">Find us on Instagram <Instagram color="black" size={16} className="inline ml-0.5"/></p>
        </div>
       
      </div>
    </div>
  );
};

export default Footer;




// rgb(218,233,249)
