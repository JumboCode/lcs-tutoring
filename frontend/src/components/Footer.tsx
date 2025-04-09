// Footer.tsx
import GrayLogo from "../assets/images/gray_logo.svg";
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-blue-100">
      <div className="flex flex-row w-[90vw] mx-auto py-8 h-60 md:h-80">
        <div className="w-1/2 flex flex-col justify-between justify-items-start space-y-4">
          <img src={GrayLogo} alt="Your SVG" className="w-14 h-14" />
          <p className="text-[#2F3335] text-sm mt-5">
            Tufts LCS Tutoring © 2025
          </p>
        </div>
        <div className="w-1/2 flex flex-col justify-between justify-items-start space-y-4 items-end">
          <div className="flex flex-col space-y-2">
            <span className="text-black text-base font-bold font-inter border-b border-blue-100">
              Pages
            </span>
            <Link className="cursor-pointer" to="/" onClick={scrollToTop}>
              <span className="text-[#2F3335] text-base border-b border-blue-100 hover:border-b hover:border-black">
                Home
              </span>
            </Link>
            <Link className="cursor-pointer" to="/team" onClick={scrollToTop}>
              <span className="text-[#2F3335] text-base border-b border-blue-100 hover:border-b hover:border-black">
                Team
              </span>
            </Link>
            <Link
              className="cursor-pointer"
              to="/tutor-form"
              onClick={scrollToTop}
            >
              <span className="text-[#2F3335] text-base border-b border-blue-100 hover:border-b hover:border-black">
                Tutor Form
              </span>
            </Link>
            <Link
              className="cursor-pointer text-[#2F3335] text-base border-b border-blue-100 hover:border-b hover:border-black"
              to="/tutee-form"
              onClick={scrollToTop}
            >
              Tutee Form
            </Link>
          </div>
          <a
            href="https://www.instagram.com/lcstutors/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-[#2F3335] text-sm inline border-b border-blue-100 hover:border-b hover:border-black"
          >
            Find us on Instagram
            <Instagram color="black" size={16} className="inline ml-1 mb-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
