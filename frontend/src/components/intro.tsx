import React, { useState } from "react";
import elephantLogo from "@/assets/images/gray_logo.svg"; // Assuming you have the logo
import "./LcsTutoringIntro.css"; // this implements the css 

const LcsTutoringIntro: React.FC = () => {
  // Use state to track if the button was clicked
  const [isTutorSignedUp, setIsTutorSignedUp] = useState(false);

  // Function to handle the button click
  const handleClick = () => {
    setIsTutorSignedUp(true);
  };

  return (
    <div className="intro-container">
      <h1 className="title">LCS Tutoring</h1>
      <div className="logo-container">
        <img
          src={elephantLogo}
          alt="LCS Tutoring Logo"
          className="logo"
        />
      </div>

      {!isTutorSignedUp ? (
        <>
          <p className="description">
            A community service organization at Tufts University, pairing Jumbos
            with K-12 students in the Medford/Somerville areas for tutoring.
          </p>
          <button className="become-tutor-button" onClick={handleClick}>
            Become a Tutor!
          </button>
        </>
      ) : (
        <p className="thank-you-message">Thank you for your interest in becoming a tutor! We will get back to you soon.</p>
      )}
    </div>
  );
};

export default LcsTutoringIntro;