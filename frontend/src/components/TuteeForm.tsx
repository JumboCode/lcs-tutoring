import React, { useState } from "react";
import Select from "react-select";

const subject_options = [
  { value: "Early Reading", label: "Early Reading (Grades 3 and up)" },
  { value: "Reading", label: "Reading (Grades 3 and up)" },
  { value: "English", label: "English/Language Arts" },
  { value: "Math", label: "Math (1-8)" },
  { value: "Geometry", label: "Geometry/Trig" },
  { value: "Algebra", label: "Algebra" },
  { value: "Precalculus", label: "Precalculus" },
  { value: "Calculus", label: "Calculus" },
  { value: "Statistics", label: "Statistics" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Science", label: "Science (1-8)" },
];

const tutoring_mode_options = [
  { value: "Virtual only", label: "Virtual only" },
  { value: "In-person only", label: "In-person only" },
  { value: "Either is fine", label: "Either is fine" },
];

const grade_options = [
  { value: "K", label: "Kindergarten" },
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  { value: "4", label: "4th" },
  { value: "5", label: "5th" },
  { value: "6", label: "6th" },
  { value: "7", label: "7th" },
  { value: "8", label: "8th" },
  { value: "9", label: "9th" },
  { value: "10", label: "10th" },
  { value: "11", label: "11th" },
  { value: "12", label: "12th" },
];

export default function TuteeForm() {
  const [showTextBox, setShowTextBox] = useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTextBox(event.target.value === "yes");
  };

  return (
    <div className="pt-10 bg-[#FAFCFE] min-h-screen">
      <h1 className="text-center text-2xl font-bold">Tutee Survey</h1>

      <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        <div className="bg-white px-3">
          <h2 className="text-xl font-bold text-left pb-3">
            Child Information
          </h2>
          <form className="grid grid-cols-2 gap-3">
            {[
              { label: "First Name", id: "firstName" },
              { label: "Last Name", id: "lastName" },
              { label: "Gender", id: "gender" },
              { label: "Grade", id: "grade" },
            ].map((field) => (
              <div className="flex flex-col" key={field.id}>
                <label htmlFor={field.id} className="pb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  name={field.id}
                  placeholder="Enter a description..."
                  required
                  className="rounded-lg border border-gray-300 p-2"
                />
              </div>
            ))}
          </form>
          <div className="pt-3 flex flex-col">
            <label>Special Needs?</label>
            <div className="flex gap-3 pt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="specialNeeds"
                  value="yes"
                  onChange={handleRadioChange}
                  required
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="specialNeeds"
                  value="no"
                  onChange={handleRadioChange}
                />{" "}
                No
              </label>
            </div>
            {showTextBox && (
              <input
                type="text"
                placeholder="Please specify"
                className="mt-2 p-2 border border-gray-300 rounded"
              />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        <div className="bg-white px-3 space-y-2">
          <h2 className="text-xl font-bold text-left pb-3">
            Parent Information
          </h2>
          <form className="grid grid-cols-2 gap-3">
            {[
              { label: "First Name", id: "firstName" },
              { label: "Last Name", id: "lastName" },
              { label: "Phone Number", id: "phone" },
              { label: "Email", id: "email" },
            ].map((field) => (
              <div className="flex flex-col" key={field.id}>
                <label htmlFor={field.id} className="pb-1">
                  {field.label}
                </label>
                <input
                  type={field.id === "phone" ? "number" : "text"}
                  id={field.id}
                  name={field.id}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                  required
                  className="rounded-lg border border-gray-300 p-2"
                />
              </div>
            ))}
          </form>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        <div className="bg-white px-3">
          <div className="space-y-4">
            <h1 className="text-xl text-left pb-3 font-bold">
              Tutoring Preference
            </h1>

            <div className="space-y-2">
              <h1 className="text-base space-y-2">Subject</h1>
              <Select
                name="Subjects"
                options={subject_options}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select one"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-base space-y-2">
                What are your preferences regarding in-person tutoring? (Please
                note: students must come to Tufts campus to be tutored in
                person)
              </h1>
              <Select
                name="Subjects"
                options={tutoring_mode_options}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select one"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-base">
                Anything else you would like to let us know?
              </h1>
              <input
                type="text"
                placeholder="Enter a description..."
                className="w-full p-2 bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        <div className="bg-white px-3">
          <h1 className="text-xl text-left pb-3 font-bold">Agreement</h1>
          <p>
            I understand and agree to the "Tufts Campus - Minor" waiver (shown
            below)
          </p>
          <div className="flex space-x-2 py-2">
            <label className="inline-flex items-center space-x-3 text-black">
              <input
                type="radio"
                name="agreement"
                value="Yes"
                className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-400"
              />
              <span className="text-gray-400">Yes</span>
            </label>
            <label
              htmlFor="radio-2"
              className="text-gray-400 inline-flex items-center space-x-3 "
            >
              <input
                type="radio"
                name="agreement"
                value="No"
                required
                className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-400 focus:ring-gray-400"
              />
              <span className="text-gray-400">No</span>
            </label>
          </div>

          <div className="w-full border border-gray-200 rounded-lg overflow-hidden mt-2">
            <iframe
              src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf"
              className="w-full h-[500px]"
              title="Tutor Code of Conduct"
            />
          </div>

          <div className="pt-4 space-y-2">
            <p className="text-black text-bold">
              Electronic Signature (Please note that your electronic signature
              has the same legality as one that is hand-signed)
            </p>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4 mb-8">
        <button className="bg-blue-900 text-white font-medium py-2 px-6 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50">
          Submit
        </button>
      </div>
    </div>
  );
}
