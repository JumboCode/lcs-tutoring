import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import config from "../config";
import CloseButton from "../assets/images/filter/close_button.svg";
import BlueCloseButton from "../assets/images/filter/blue_close.svg";

interface AdminModalProps {
  onHide: () => void;
  show: boolean;
}

export default function AdminSignUp(props: AdminModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // New state for first name
  const [lastName, setLastName] = useState(""); // New state for last name
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [closeButton, setCloseButton] = useState(CloseButton);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${config.backendUrl}/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: [email], // Email should be an array
          password,
          firstName,
          lastName,
        }),
      });

      const result = await response.json();
      console.log(result)
      if (response.ok) {
        setSuccess(true);
        console.log("User created successfully:", result);
      } else {
        setError(result.error || "Failed to create account.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Error occurred:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="border-0 bg-transparent"
    >
      <Modal.Body>
        <div className="flex flex-col justify-center items-center gap-4">
          {/* Success message */}
          {success && (
            <div className="w-[514px] h-[60px] p-4 bg-green-100 text-green-700 border border-green-400 rounded flex items-center">
              <span className="mr-2">✅</span>
              <span>Admin created successfully!</span>
            </div>
          )}

          {/* Error message */}
          {error !== "" && (
            <div className="w-[514px] h-[60px] p-4 bg-red-100 text-red-700 border border-red-400 rounded flex items-center">
              <span className="mr-2">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="relative bg-white shadow-lg rounded-lg p-6 w-[514px] h-[600px] flex flex-col justify-center gap-4">
              <img 
                className="w-[30px] h-[30px] absolute right-5 top-5"
                src={closeButton}
                onMouseOver={() => setCloseButton(BlueCloseButton)}
                onMouseLeave={() => setCloseButton(CloseButton)}
                onClick={() => {
                  props.onHide();
                  setCloseButton(CloseButton);
                }}
              />
              <h2 className="text-2xl font-semibold text-center pt-5">
                Add a new LCS Admin
              </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="pb-3">
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg mt-1"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="pb-3">
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg mt-1"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="pb-3">
                <label className="block text-sm font-medium">Tufts Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="pb-4">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-lg mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-100 text-black font-semibold py-2 rounded hover:bg-blue-200 mb-4"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
