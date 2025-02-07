import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
        
        <svg width="78" height="77" viewBox="0 0 78 77" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39 74.9692C59.2504 74.9692 75.6667 58.5529 75.6667 38.3025C75.6667 18.0521 59.2504 1.63583 39 1.63583C18.7496 1.63583 2.33333 18.0521 2.33333 38.3025C2.33333 58.5529 18.7496 74.9692 39 74.9692Z" fill="#DBEAFA"/>
            <path d="M22.5 38.3025L33.5 49.3025L55.5 27.3025M75.6667 38.3025C75.6667 58.5529 59.2504 74.9692 39 74.9692C18.7496 74.9692 2.33333 58.5529 2.33333 38.3025C2.33333 18.0521 18.7496 1.63583 39 1.63583C59.2504 1.63583 75.6667 18.0521 75.6667 38.3025Z" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

      <h2 className="text-3xl font-bold text-gray-900 mt-6">
        Thank you for submitting the Survey
      </h2>
      <p className="text-lg text-gray-700 mt-4 max-w-2xl">
        Keep an eye out for an email! We will send out the information once there is a match.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-[#DBEAFA] text-black text-lg py-3 px-8 rounded-full hover:bg-blue-500 transition font-bold"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SuccessPage;
