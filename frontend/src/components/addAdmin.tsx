import config from "../config.ts";
import { useState } from "react";
export default function AddAdmin() {
  const [showInput, setShowInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorOutline, setErrorOutline] = useState<string>("");

  const handleSubmit = async () => {
    setShowInput(false);
    const email = (document.getElementById("input1") as HTMLInputElement | null)
      ?.value;
    if (!email) {
      setShowInput(true);
      return;
    }
    const password = (
      document.getElementById("input2") as HTMLInputElement | null
    )?.value;
    if (!password) {
      setShowInput(true);
      return;
    }
    if (!email.endsWith("@tufts.edu")) {
      setErrorMessage("Must enter a valid Tufts email");
      setErrorOutline("outline outline-offset-1 outline-red-500");
      setShowInput(true);
      return;
    }
    setErrorMessage("");
    setErrorOutline("");
    await fetch(`${config.backendUrl}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="font-inter bg-[#BFDBF7] hover:bg-blue-300 w-[180px] rounded-full font-semibold py-3 text-center m-4"
        onClick={() => setShowInput(true)}
      >
        New Admin
      </button>
      {showInput && (
        <div className="flex flex-col items-start mx-4 mb-2">
          <div className="flex flex-row items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Tufts Email"
              className={`p-2 border border-gray-300 rounded h-[40px] ${errorOutline}`}
              id="input1"
            />
            <input
              type="text"
              placeholder="Enter Password"
              className={`p-2 border border-gray-300 rounded h-[40px] ${errorOutline}`}
              id="input2"
            />
            <button
              className="font-inter bg-[#BFDBF7] hover:bg-blue-300 w-[30px] h-[30px] rounded-full flex items-center justify-center"
              onClick={() => handleSubmit()}
            >
              +
            </button>
          </div>
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
