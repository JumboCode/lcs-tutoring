// Footer.tsx
import GrayLogo from "../assets/images/gray_logo.svg";
import { Instagram } from "lucide-react";
import "./Footer.css";
export default function Footer() {
  return (
    <div className="flex px-20 py-8 flex-row bg-blue-100 h-80">
      <div className="w-1/2 flex flex-col justify-between justify-items-start space-y-4">
        <img src={GrayLogo} alt="Your SVG" className="w-14 h-14" />
        <p className="text-[#2F3335] text-sm mt-5">Tufts LCS Tutoring © 2024</p>
      </div>
      <div className="w-1/2 flex flex-col justify-between justify-items-start space-y-4 items-end">
        <div className="flex flex-col space-y-2">
          <p className="cursor-pointer text-black text-base font-bold font-inter border-b border-blue-100 hover:border-b hover:border-black">
            Pages
          </p>
          <p className="cursor-pointer text-[#2F3335] text-base border-b border-blue-100 hover:border-b hover:border-black">
            Home
          </p>
          <p className="cursor-pointer text-[#2F3335] text-base border-b border-blue-100 hover:border-b hover:border-black">
            Team
          </p>
        </div>
        <p className="cursor-pointer text-[#2F3335] text-sm inline border-b border-blue-100 hover:border-b hover:border-black">
          Find us on Instagram
          <Instagram color="black" size={16} className="inline ml-0.5" />
        </p>
      </div>
    </div>
  );
}
