import config from "../config.ts";
import React, { useState } from "react";
// import NavigationBar from "./navigationBar.tsx";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.backendUrl}/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify that the body format is JSON
          Accept: "application/json", // Optionally specify that your client expects JSON responses
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("hello");
      console.log(response);
      const data = await response.json();
      console.log("bye");
      if (data.success) {
        console.log("Logged in successfully");
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Login failed", err);
      setError(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h2 className="text-2xl font-semibold text-center">
        Log In for LCS Admin
      </h2>
      {error && (
        <div className="w-[514px] h-[60px] p-4 bg-red-100 text-red-700 border border-red-400 rounded flex items-center">
          <span className="mr-2">✖️</span>
          <span>Incorrect email or password</span>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6 w-[514px] h-[392px] flex flex-col justify-center gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            className="w-full bg-blue-100 text-black font-semibold py-2 rounded hover:bg-blue-200"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
