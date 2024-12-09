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
  // Languages
  // SAT/ACT
  // OTHER
  // History (global/US)
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

export default function TutorForm() {
  return (
    <div className="pt-10 bg-[#FAFCFE] min-h-screen">
      <h1 className="text-center text-2xl font-bold">Tutor Survey</h1>

      <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        <div className="bg-white px-3">
          <h2 className="text-xl font-bold text-left pb-3">
            General Information
          </h2>
          <form className="grid grid-cols-2 gap-3">
            {[
              { label: "First Name", id: "firstName" },
              { label: "Last Name", id: "lastName" },
              { label: "Pronouns", id: "pronouns" },
              { label: "Student ID Number", id: "studentId" },
              { label: "Major", id: "major" },
              { label: "Year of Graduation", id: "gradYear" },
              { label: "Phone Number", id: "phone" },
              { label: "Tufts Email", id: "email" },
            ].map((field) => (
              <div className="flex flex-col" key={field.id}>
                <label htmlFor={field.id} className="pb-1">
                  {field.label}
                </label>
                <input
                  type={field.id === "phone" ? "number" : "text"}
                  id={field.id}
                  name={field.id}
                  placeholder="Enter a description..."
                  required
                  className="rounded-lg border border-gray-300 p-2"
                />
              </div>
            ))}
          </form>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        <div className="bg-white px-3 space-y-2">
          <h2 className="text-xl font-bold text-left pb-3">LCS Tutee</h2>
          <form className="flex flex-col gap-3">
            <div className="flex flex-col space-y-2">
              <label>Were you paired with a tutee last semester?</label>
              <select
                required
                className="p-2 rounded-lg border border-gray-300 text-gray-500"
              >
                <option value="" disabled selected>
                  Select an option
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label>
                If you are continuing with a student(s) from last semester,
                please name them here
              </label>
              <input
                type="text"
                placeholder="Enter a description..."
                className="p-2 rounded-lg border border-gray-300"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label>
                How many students do you want to tutor? (Not including the
                student if stated above)
              </label>
              <input
                type="number"
                placeholder="Insert a number"
                className="p-2 rounded-lg border border-gray-300"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label>What grade levels are you comfortable working with?</label>
              <Select
                isMulti
                name="Grade Levels"
                options={grade_options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select as many as you like"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label>
                Do you feel comfortable working with students with special needs
                (including but not limited to learning disabilities, ADD/ADHD,
                Autism, etc)? We will provide resources to assist while
                tutoring.
              </label>
              <div className="flex gap-3 pt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="specialNeeds"
                    value="yes"
                    required
                  />{" "}
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="specialNeeds" value="no" /> No
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        <div className="bg-white px-3">
          <div className="space-y-4">
            <h1 className="text-xl text-left pb-3 font-bold">
              LCS Tutor Preference
            </h1>

            <div className="space-y-2">
              <h1 className="text-base space-y-2">
                What subjects would you like to tutor?
              </h1>
              <Select
                isMulti
                name="Subjects"
                options={subject_options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select as many as you like"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-base">
                Language Proficiency other than English
              </h1>
              <input
                type="text"
                placeholder="Enter a description..."
                className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-400 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-base">Tutoring Mode</h1>
              <select className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-400 focus:outline-none">
                <option>Select an option</option>
                <option>Virtual Only</option>
                <option>In-person Only</option>
                <option>Either is fine</option>
              </select>
            </div>

            <div className="space-y-2">
              <h1 className="text-base">
                Which virtual platforms are you comfortable using to tutor, if
                applicable?
              </h1>
              <select className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-400 focus:outline-none">
                <option>Select an many as you like</option>
                <option>Zoom</option>
                <option>Skype</option>
                <option>Google Hangouts</option>
                <option>FaceTime</option>
              </select>
            </div>

            <div className="space-y-2">
              <h1 className="text-base">
                Anything else you would like to let us know?
              </h1>
              <input
                type="text"
                placeholder="Enter a description..."
                className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-400 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        <div className="bg-white px-3">
          <h1 className="text-xl text-left pb-3 font-bold">Agreement</h1>
          <p>
            I understand and agree to the "Tufts Tutor Code of Conduct" (shown
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

// import { useState } from "react";
// import Select from "react-select";

// const subject_options = [
//   { value: "Early Reading", label: "Early Reading (Grades 3 and up)" },
//   { value: "Reading", label: "Reading (Grades 3 and up)" },
//   { value: "English", label: "English/Language Arts" },
//   { value: "Math", label: "Math (1-8)" },
//   { value: "Geometry", label: "Geometry/Trig" },
//   { value: "Algebra", label: "Algebra" },
//   { value: "Precalculus", label: "Precalculus" },
//   { value: "Calculus", label: "Calculus" },
//   { value: "Statistics", label: "Statistics" },
//   { value: "Computer Science", label: "Computer Science" },
//   { value: "Science", label: "Science (1-8)" },
// ];

// const grade_options = [
//   { value: "K", label: "Kindergarten" },
//   { value: "1", label: "1st" },
//   { value: "2", label: "2nd" },
//   { value: "3", label: "3rd" },
//   { value: "4", label: "4th" },
//   { value: "5", label: "5th" },
//   { value: "6", label: "6th" },
//   { value: "7", label: "7th" },
//   { value: "8", label: "8th" },
//   { value: "9", label: "9th" },
//   { value: "10", label: "10th" },
//   { value: "11", label: "11th" },
//   { value: "12", label: "12th" },
// ];

// export default function TutorForm() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     pronouns: "",
//     studentId: "",
//     major: "",
//     gradYear: "",
//     phone: "",
//     email: "",
//     tuteeStatus: "",
//     tuteeNames: "",
//     numStudents: "",
//     gradeLevels: [],
//     specialNeeds: "",
//     subjects: [],
//     languageProficiency: "",
//     tutoringMode: "",
//     platforms: [],
//     otherInfo: "",
//     agreement: "",
//     electronicSignature: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSelectChange = (name, selectedOptions) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: selectedOptions.map((option) => option.value),
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     // General fields validation
//     Object.keys(formData).forEach((key) => {
//       if (
//         key !== "gradeLevels" &&
//         key !== "subjects" &&
//         key !== "platforms" &&
//         key !== "agreement"
//       ) {
//         if (!formData[key]) {
//           newErrors[key] = "Field needs to be filled out";
//         }
//       }
//     });

//     // Tufts email validation
//     if (formData.email && !formData.email.endsWith("@tufts.edu")) {
//       newErrors.email = "Please enter a valid Tufts email address.";
//     }

//     // Agreement validation
//     if (!formData.agreement) {
//       newErrors.agreement = "You must agree to the terms to submit.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Returns true if no errors
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       // If validation passes, collect data and reset form
//       console.log(formData);
//       setFormData({
//         firstName: "",
//         lastName: "",
//         pronouns: "",
//         studentId: "",
//         major: "",
//         gradYear: "",
//         phone: "",
//         email: "",
//         tuteeStatus: "",
//         tuteeNames: "",
//         numStudents: "",
//         gradeLevels: [],
//         specialNeeds: "",
//         subjects: [],
//         languageProficiency: "",
//         tutoringMode: "",
//         platforms: [],
//         otherInfo: "",
//         agreement: "",
//         electronicSignature: "",
//       });
//       setErrors({});
//     }
//   };

//   return (
//     <div className="pt-10 bg-[#FAFCFE] min-h-screen">
//       <h1 className="text-center text-2xl font-bold">Tutor Survey</h1>

//       <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
//         <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
//           {[
//             { label: "First Name", id: "firstName" },
//             { label: "Last Name", id: "lastName" },
//             { label: "Pronouns", id: "pronouns" },
//             { label: "Student ID Number", id: "studentId" },
//             { label: "Major", id: "major" },
//             { label: "Year of Graduation", id: "gradYear" },
//             { label: "Phone Number", id: "phone" },
//             { label: "Tufts Email", id: "email" },
//           ].map((field) => (
//             <div className="flex flex-col" key={field.id}>
//               <label htmlFor={field.id} className="pb-1">
//                 {field.label}
//               </label>
//               <input
//                 type={field.id === "phone" ? "number" : "text"}
//                 id={field.id}
//                 name={field.id}
//                 placeholder="Enter a description..."
//                 value={formData[field.id]}
//                 onChange={handleChange}
//                 className="rounded-lg border border-gray-300 p-2"
//               />
//               {errors[field.id] && (
//                 <span className="text-red-500 text-sm">{errors[field.id]}</span>
//               )}
//             </div>
//           ))}

//           {/* Add the rest of your form fields here following the same pattern */}

//           <div className="flex justify-center mt-4 mb-8">
//             <button
//               type="submit"
//               className="bg-blue-900 text-white font-medium py-2 px-6 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import Select, { MultiValue } from "react-select";

// interface Option {
//   value: string;
//   label: string;
// }

// const subject_options: Option[] = [
//   { value: "Early Reading", label: "Early Reading (Grades 3 and up)" },
//   { value: "Reading", label: "Reading (Grades 3 and up)" },
//   { value: "English", label: "English/Language Arts" },
//   { value: "Math", label: "Math (1-8)" },
//   { value: "Geometry", label: "Geometry/Trig" },
//   { value: "Algebra", label: "Algebra" },
//   { value: "Precalculus", label: "Precalculus" },
//   { value: "Calculus", label: "Calculus" },
//   { value: "Statistics", label: "Statistics" },
//   { value: "Computer Science", label: "Computer Science" },
//   { value: "Science", label: "Science (1-8)" },
// ];

// const grade_options: Option[] = [
//   { value: "K", label: "Kindergarten" },
//   { value: "1", label: "1st" },
//   { value: "2", label: "2nd" },
//   { value: "3", label: "3rd" },
//   { value: "4", label: "4th" },
//   { value: "5", label: "5th" },
//   { value: "6", label: "6th" },
//   { value: "7", label: "7th" },
//   { value: "8", label: "8th" },
//   { value: "9", label: "9th" },
//   { value: "10", label: "10th" },
//   { value: "11", label: "11th" },
//   { value: "12", label: "12th" },
// ];

// interface FormData {
//   firstName: string;
//   lastName: string;
//   pronouns: string;
//   studentId: string;
//   major: string;
//   gradYear: string;
//   phone: string;
//   email: string;
//   pairedLastSemester: string;
//   studentNames: string;
//   studentCount: string;
//   gradeLevels: string[];
//   subjects: string[];
//   specialNeeds: string;
//   language: string;
//   tutoringMode: string;
//   platforms: string;
//   agreement: string;
//   signature: string;
// }

// export default function TutorForm() {
//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     pronouns: "",
//     studentId: "",
//     major: "",
//     gradYear: "",
//     phone: "",
//     email: "",
//     pairedLastSemester: "",
//     studentNames: "",
//     studentCount: "",
//     gradeLevels: [],
//     subjects: [],
//     specialNeeds: "",
//     language: "",
//     tutoringMode: "",
//     platforms: "",
//     agreement: "",
//     signature: "",
//   });

//   const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
//     {}
//   );

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (
//     name: keyof FormData,
//     selectedOptions: MultiValue<Option>
//   ) => {
//     const values = selectedOptions.map((option) => option.value);
//     setFormData((prev) => ({ ...prev, [name]: values }));
//   };

//   const validateFields = () => {
//     let validationErrors: Partial<Record<keyof FormData, string>> = {};

//     Object.keys(formData).forEach((key) => {
//       const fieldKey = key as keyof FormData;
//       if (!formData[fieldKey] && fieldKey !== "platforms") {
//         validationErrors[fieldKey] = "Field needs to be filled out";
//       }
//     });

//     if (!formData.email.endsWith("@tufts.edu")) {
//       validationErrors.email = "Email must end with @tufts.edu";
//     }

//     if (formData.agreement !== "Yes") {
//       validationErrors.agreement = "You must agree to proceed.";
//     }

//     setErrors(validationErrors);
//     return Object.keys(validationErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (validateFields()) {
//       console.log("Collected Data:", formData);
//       setFormData({
//         firstName: "",
//         lastName: "",
//         pronouns: "",
//         studentId: "",
//         major: "",
//         gradYear: "",
//         phone: "",
//         email: "",
//         pairedLastSemester: "",
//         studentNames: "",
//         studentCount: "",
//         gradeLevels: [],
//         subjects: [],
//         specialNeeds: "",
//         language: "",
//         tutoringMode: "",
//         platforms: "",
//         agreement: "",
//         signature: "",
//       });
//       setErrors({});
//       alert("Form submitted successfully!");
//     }
//   };

//   return (
//     <div className="pt-10 bg-[#FAFCFE] min-h-screen">
//       <h1 className="text-center text-2xl font-bold">Tutor Survey</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300"
//       >
//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { label: "First Name", id: "firstName" },
//             { label: "Last Name", id: "lastName" },
//             { label: "Pronouns", id: "pronouns" },
//             { label: "Student ID Number", id: "studentId" },
//             { label: "Major", id: "major" },
//             { label: "Year of Graduation", id: "gradYear" },
//             { label: "Phone Number", id: "phone" },
//             { label: "Tufts Email", id: "email" },
//           ].map((field) => (
//             <div key={field.id}>
//               <label htmlFor={field.id} className="pb-1">
//                 {field.label}
//               </label>
//               <input
//                 type={field.id === "phone" ? "number" : "text"}
//                 id={field.id}
//                 name={field.id}
//                 value={formData[field.id as keyof FormData]}
//                 onChange={handleInputChange}
//                 placeholder="Enter a description..."
//                 className="rounded-lg border border-gray-300 p-2"
//               />
//               {errors[field.id as keyof FormData] && (
//                 <p className="text-red-500 text-sm">
//                   {errors[field.id as keyof FormData]}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Grade Levels */}
//         <div className="space-y-2 mt-5">
//           <label>What grade levels are you comfortable working with?</label>
//           <Select
//             isMulti
//             name="gradeLevels"
//             options={grade_options}
//             onChange={(selected) => handleSelectChange("gradeLevels", selected)}
//             className="basic-multi-select"
//             classNamePrefix="select"
//             placeholder="Select as many as you like"
//           />
//           {errors.gradeLevels && (
//             <p className="text-red-500 text-sm">{errors.gradeLevels}</p>
//           )}
//         </div>

//         {/* Agreement */}
//         <div className="mt-5">
//           <label>Do you agree to the Tufts Tutor Code of Conduct?</label>
//           <div className="flex gap-3 pt-1">
//             <label>
//               <input
//                 type="radio"
//                 name="agreement"
//                 value="Yes"
//                 onChange={handleInputChange}
//               />
//               Yes
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="agreement"
//                 value="No"
//                 onChange={handleInputChange}
//               />
//               No
//             </label>
//           </div>
//           {errors.agreement && (
//             <p className="text-red-500 text-sm">{errors.agreement}</p>
//           )}
//         </div>

//         <div className="flex justify-center mt-4">
//           <button
//             type="submit"
//             className="bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-blue-800"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
