import { useState, ChangeEvent, FormEvent } from "react";
import Select, {ActionMeta, SingleValue} from "react-select";


//lets TypeScript know what kind of data
type FormData = {
    childFirstName: string;
    childLastName: string;
    gender: string;
    grade: string;
    specialNeeds: string;
    specialNeedsInfo: string;
    parentFirstName: string;
    parentLastName: string;
    phone: string;
    email: string;
    subject: string;
    tutoringMode: string;
    additionalInfo: string;
    agreement: string;
    signature: string;
};

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

export default function TuteeForm() {
    const [showTextBox, setShowTextBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    //variable that holds form data
    const [formData, setFormData] = useState<FormData>({
        childFirstName: "",
        childLastName: "",
        gender: "",
        grade: "",
        specialNeeds: "",
        specialNeedsInfo: "",
        parentFirstName: "",
        parentLastName: "",
        phone: "",
        email: "",
        subject: "",
        tutoringMode: "",
        additionalInfo: "",
        agreement: "",
        signature: "",
    });  


    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
        if (name === "specialNeeds") {
        setShowTextBox(value === "yes");
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };


    const handleSelectChange = (
        selectedOption: SingleValue<{ value: string; label: string }>, 
        actionMeta: ActionMeta<{ value: string; label: string }> ) => {
        const name = actionMeta?.name;

        if (!name) {
        return;
        }

        setFormData((prev) => ({
        ...prev,
        [name]: selectedOption,
        }));
    };

    //ensure all required fields are filled out, ensure that user agrees to waiver
    const validateForm = (): boolean => {
      /////
      const requiredFields = [
        "childFirstName",
        "childLastName",
        "gender",
        "grade",
        "parentFirstName",
        "parentLastName",
        "phone",
        "email",
        "subject",
        "tutoringMode",
        "agreement",
        "signature",
      ];
  
      const invalidFields: string[] = [];
      for (const field of requiredFields) {
        if (!formData[field as keyof FormData]) {
          invalidFields.push(field);
        }
      }
  
      if (invalidFields.length > 0) {
        setErrorMessage(
          `Please fill out the following fields: ${invalidFields.join(", ")}`
        );
        return false;
      }
  /////
        //let isValid = true;

        if (formData.agreement !== "Yes") {
        setErrorMessage("You must agree to the waiver to submit the form.");
        //isValid = false;
        return false; 
        }
////
        setErrorMessage(""); 
////
        return true;
    };
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
    
        console.log("Form Data Submitted:", formData);
    
        //reset form
        setFormData({
        childFirstName: "",
        childLastName: "",
        gender: "",
        grade: "",
        specialNeeds: "",
        specialNeedsInfo: "",
        parentFirstName: "",
        parentLastName: "",
        phone: "",
        email: "",
        subject: "",
        tutoringMode: "",
        additionalInfo: "",
        agreement: "",
        signature: "",
        });
        setShowTextBox(false);
        setErrorMessage("");
    };


  return (

    <div className="pt-10 bg-[#FAFCFE] min-h-screen">
      <h1 className="text-center text-2xl font-bold">Tutee Survey</h1>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
        {/* Display Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        {/* Child Information */}
        <div className="bg-white px-3">
          <h2 className="text-xl font-bold text-left pb-3">Child Information</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "First Name", id: "childFirstName" },
              { label: "Last Name", id: "childLastName" },
              { label: "Gender", id: "gender" },
              { label: "Grade", id: "grade" },
            ].map((field) => {
                const currentFieldId = field.id as keyof FormData;
                return (
                  <div className="flex flex-col" key={currentFieldId}>
                    <label htmlFor={currentFieldId} className="pb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={currentFieldId}
                      name={currentFieldId}
                      onChange={handleChange}
                      value={formData[currentFieldId]} 
                      placeholder="Enter a description..."
                      required
                      className="rounded-lg border border-gray-300 p-2"
                    />
                  </div>
                );
              })}
          </div>
          <div className="pt-3 flex flex-col">
            <label>Special Needs?</label>
            <div className="flex gap-3 pt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="specialNeeds"
                  value="yes"
                  checked={formData.specialNeeds === "yes"}
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
                  checked={formData.specialNeeds === "no"}
                  onChange={handleRadioChange}
                />{" "}
                No
              </label>
            </div>
            {showTextBox && (
              <input
                type="text"
                placeholder="Please specify"
                name="specialNeedsInfo"
                value={formData.specialNeedsInfo}
                onChange={handleChange}
                className="mt-2 p-2 border border-gray-300 rounded"
                required={formData.specialNeeds === "yes"}
              />
            )}
          </div>
        </div>

        {/* Parent Information */}
        <div className="bg-white px-3 space-y-2 mt-8">
          <h2 className="text-xl font-bold text-left pb-3">Parent Information</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "First Name", id: "parentFirstName" },
              { label: "Last Name", id: "parentLastName" },
              { label: "Phone Number", id: "phone" },
              { label: "Email", id: "email" },
            ].map((field) => {
                const currentFieldId = field.id as keyof FormData;
                return (
                  <div className="flex flex-col" key={currentFieldId}>
                    <label htmlFor={currentFieldId} className="pb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={currentFieldId}
                      name={currentFieldId}
                      onChange={handleChange}
                      value={formData[currentFieldId]} 
                      placeholder="Enter a description..."
                      required
                      className="rounded-lg border border-gray-300 p-2"
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Tutoring Preference */}
        <div className="bg-white px-3 mt-8">
          <div className="space-y-4">
            <h1 className="text-xl text-left pb-3 font-bold">Tutoring Preference</h1>
            <div className="space-y-2">

              <h1 className="text-base space-y-2">Subject</h1>
              <Select
                id="small"
                name="subject"
                options={subject_options}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select one"
                value={subject_options.find((option) => option.value === formData.subject)}
                onChange={handleSelectChange}
                required
              />
            </div>


            <div className="space-y-2">
              <h1 className="text-base space-y-2">
                What are your preferences regarding in-person tutoring? (Please
                note: students must come to Tufts campus to be tutored in person)
              </h1>
              <Select
                name="tutoringMode"
                options={tutoring_mode_options}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select one"
                value={tutoring_mode_options.find((option) => option.value === formData.tutoringMode)}
                onChange={handleSelectChange}
                required
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-base">Anything else you would like to let us know?</h1>
              <input
                type="text"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Enter a description..."
                className="w-full p-2 bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-white px-3 mt-8">
          <h1 className="text-xl text-left pb-3 font-bold">Agreement</h1>
          <p>I understand and agree to the "Tufts Campus - Minor" waiver (shown below)</p>
          <div className="flex space-x-2 py-2">
            <label className="inline-flex items-center space-x-3 text-black">
              <input
                type="radio"
                name="agreement"
                value="Yes"
                checked={formData.agreement === "Yes"}
                onChange={handleRadioChange}
                className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-400"
                required
              />
              <span className="text-black">Yes</span>
            </label>
            <label
              htmlFor="radio-2"
              className="inline-flex items-center space-x-3"
            >
              <input
                type="radio"
                name="agreement"
                value="No"
                checked={formData.agreement === "No"}
                onChange={handleRadioChange}
                required
                className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-400 focus:ring-gray-400"
              />
              <span className="text-black">No</span>
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
              name="signature"
              value={formData.signature}
              onChange={handleChange}
              placeholder="Enter Full Name"
              className="w-full p-2 bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
              required
            />

          </div>
        </div>

        <div className="flex justify-center mt-4 mb-8">
          <button
            type="submit"
            className="bg-blue-900 text-white font-medium py-2 px-6 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

// import { useState, ChangeEvent, FormEvent } from "react";
// import Select, { ActionMeta, SingleValue } from "react-select";

// // TypeScript type for form data
// type FormData = {
//   childFirstName: string;
//   childLastName: string;
//   gender: string;
//   grade: string;
//   specialNeeds: string;
//   specialNeedsInfo: string;
//   parentFirstName: string;
//   parentLastName: string;
//   phone: string;
//   email: string;
//   subject: string | null;
//   tutoringMode: string | null;
//   additionalInfo: string;
//   agreement: string;
//   signature: string;
// };

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

// const tutoring_mode_options = [
//   { value: "Virtual only", label: "Virtual only" },
//   { value: "In-person only", label: "In-person only" },
//   { value: "Either is fine", label: "Either is fine" },
// ];

// export default function TuteeForm() {
//   const [showTextBox, setShowTextBox] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   // Variable that holds form data
//   const [formData, setFormData] = useState<FormData>({
//     childFirstName: "",
//     childLastName: "",
//     gender: "",
//     grade: "",
//     specialNeeds: "",
//     specialNeedsInfo: "",
//     parentFirstName: "",
//     parentLastName: "",
//     phone: "",
//     email: "",
//     subject: null,
//     tutoringMode: null,
//     additionalInfo: "",
//     agreement: "",
//     signature: "",
//   });

//   const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (name === "specialNeeds") {
//       setShowTextBox(value === "yes");
//     }
//   };

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSelectChange = (
//     selectedOption: SingleValue<{ value: string; label: string }>,
//     actionMeta: ActionMeta<{ value: string; label: string }>
//   ) => {
//     const name = actionMeta?.name;

//     if (!name) return;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: selectedOption?.value || null,
//     }));
//   };

//   // Validate the form
//   const validateForm = (): boolean => {
//     const requiredFields = [
//       "childFirstName",
//       "childLastName",
//       "gender",
//       "grade",
//       "parentFirstName",
//       "parentLastName",
//       "phone",
//       "email",
//       "subject",
//       "tutoringMode",
//       "agreement",
//       "signature",
//     ];

//     const invalidFields: string[] = [];
//     for (const field of requiredFields) {
//       if (!formData[field as keyof FormData]) {
//         invalidFields.push(field);
//       }
//     }

//     if (invalidFields.length > 0) {
//       setErrorMessage(
//         `Please fill out the following fields: ${invalidFields.join(", ")}`
//       );
//       return false;
//     }

//     if (formData.agreement !== "Yes") {
//       setErrorMessage("You must agree to the waiver to submit the form.");
//       return false;
//     }

//     setErrorMessage(""); // Clear error message if validation passes
//     return true;
//   };

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     console.log("Form Data Submitted:", formData);

//     // Reset form
//     setFormData({
//       childFirstName: "",
//       childLastName: "",
//       gender: "",
//       grade: "",
//       specialNeeds: "",
//       specialNeedsInfo: "",
//       parentFirstName: "",
//       parentLastName: "",
//       phone: "",
//       email: "",
//       subject: null,
//       tutoringMode: null,
//       additionalInfo: "",
//       agreement: "",
//       signature: "",
//     });
//     setShowTextBox(false);
//     setErrorMessage("");
//   };

//   return (
//     <div className="pt-10 bg-[#FAFCFE] min-h-screen">
//       <h1 className="text-center text-4xl font-bold mb-8">Tutee Survey</h1>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-10 rounded-lg max-w-4xl mx-auto shadow-md border border-gray-300"
//       >
//         {/* Error Message */}
//         {errorMessage && (
//           <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center font-semibold">
//             {errorMessage}
//           </div>
//         )}

//         {/* Child Information */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold mb-4">Child Information</h2>
//           <div className="grid grid-cols-2 gap-6">
//             {[
//               { label: "First Name", id: "childFirstName" },
//               { label: "Last Name", id: "childLastName" },
//               { label: "Gender", id: "gender" },
//               { label: "Grade", id: "grade" },
//             ].map((field) => (
//               <div key={field.id}>
//                 <label htmlFor={field.id} className="block font-medium mb-2">
//                   {field.label}
//                 </label>
//                 <input
//                   type="text"
//                   id={field.id}
//                   name={field.id}
//                   value={formData[field.id as keyof FormData] || ""}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tutoring Preference */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold mb-4">Tutoring Preference</h2>
//           <div className="mb-4">
//             <label className="block font-medium mb-2">Subject</label>
//             <Select
//               name="subject"
//               options={subject_options}
//               placeholder="Select a subject"
//               value={subject_options.find(
//                 (option) => option.value === formData.subject
//               )}
//               onChange={handleSelectChange}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block font-medium mb-2">
//               What are your preferences regarding in-person tutoring?
//             </label>
//             <Select
//               name="tutoringMode"
//               options={tutoring_mode_options}
//               placeholder="Select an option"
//               value={tutoring_mode_options.find(
//                 (option) => option.value === formData.tutoringMode
//               )}
//               onChange={handleSelectChange}
//             />
//           </div>
//         </div>

//         {/* Agreement */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold mb-4">Agreement</h2>
//           <p className="mb-4">
//             I understand and agree to the "Tufts Campus - Minor" waiver.
//           </p>
//           <div className="flex gap-4 items-center">
//             <label>
//               <input
//                 type="radio"
//                 name="agreement"
//                 value="Yes"
//                 checked={formData.agreement === "Yes"}
//                 onChange={handleRadioChange}
//                 className="mr-2"
//               />
//               Yes
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="agreement"
//                 value="No"
//                 checked={formData.agreement === "No"}
//                 onChange={handleRadioChange}
//                 className="mr-2"
//               />
//               No
//             </label>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
