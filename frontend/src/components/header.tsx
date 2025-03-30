import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

import elephantLogo from "../assets/images/elephant.svg";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


  const handleNavClick = () => {
        window.scrollTo(0, 0);
        setIsDropdownOpen(false);
      };

  return (
    <header className="border-gray-200 border-b py-3 bg-white sticky top-0 z-50">
      <div className="flex justify-between items-center w-[90vw] mx-auto">
        <Link to="/" onClick={handleNavClick}>
          <img className="h-12 w-12" src={elephantLogo} alt="Elephant Logo" />
        </Link>
        <ul className="flex flex-row space-x-8">
          <Link
            className="cursor-pointer border-b-2 border-transparent hover:border-black"
            to="/"
            onClick={handleNavClick}
          >
            Home
          </Link>

          <Link
            className="cursor-pointer border-b-2 border-transparent hover:border-black"
            to="/team"
            onClick={handleNavClick}
          >
            Team
          </Link>
          <li className="relative">
            {/* Forms dropdown button */}
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 cursor-pointer hover:text-gray-600 border-b-2 border-transparent hover:border-black focus:outline-none"
            >
              <span>Forms</span>
              <div
                className={`transition-transform duration-300 ${
                  isDropdownOpen ? "scale-y-[-1]" : "scale-y-[1]"
                }`}
              >
                <FaChevronDown />
              </div>
            </button>

            {isDropdownOpen && (
              <ul className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                <li className="hover:bg-gray-100">
                  <Link
                    to="/tutor-form"
                    className="block px-4 py-2 text-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Tutor Form
                  </Link>
                </li>
                <li className="hover:bg-gray-100">
                  <Link
                    to="/tutee-form"
                    className="block px-4 py-2 text-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Tutee Form
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
