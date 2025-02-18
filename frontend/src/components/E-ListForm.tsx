import { useState, ChangeEvent, FormEvent } from "react";
import Select, { ActionMeta, SingleValue, MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";

interface FormData {
  fullName: string;
  tuftsEmail: string;
  gradYear: string;
}

type FormErrors = {
  [key in keyof FormData]?: string;
};

export default function EListForm() {
  const navigate = useNavigate();

  //variable that holds form data
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    tuftsEmail: "",
    gradYear: ""
  });

  //errors
  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    tuftsEmail: "",
    gradYear: ""
  });

  //for past tutee Desc.
  const [showTextBox, setShowTextBox] = useState(false);

//   const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "comfortableSpecialNeeds" ? Boolean(value) : value,
//     }));

//     if (name === "pairedWithTutee") {
//       setShowTextBox(value === "yes");
//     }

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "", // clear error when user selects an option
//     }));
//   };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

//   const handleSelectChange = (
//     selectedOption: SingleValue<{ value: string; label: string }>,
//     actionMeta: ActionMeta<{ value: string; label: string }>
//   ) => {
//     const name = actionMeta?.name;

//     if (!name) {
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: selectedOption ? selectedOption.value : "",
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//   };

//   const handleMultiSelectChange = (
//     selectedOption: MultiValue<{ value: string; label: string }>,
//     actionMeta: ActionMeta<{ value: string; label: string }>
//   ) => {
//     const name = actionMeta?.name;

//     if (!name) {
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: selectedOption
//         ? selectedOption.map((option) =>
//             name === "gradeLevels" ? Number(option.value) : option.value
//           )
//         : [],
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//   };

  //submit function with data validation
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: FormErrors = {};

    // check for empty fields
    Object.keys(formData).forEach((key) => {
      if (
        // Check required fields, excluding optional ones or empty optional fields
        formData[key as keyof typeof formData] === "" &&
        key !== "languageProficiencies" &&
        key !== "notes" &&
        key !== "pairedTutee"
      ) {
        newErrors[key as keyof FormData] = "Field needs to be filled out.";
      }
    });

    //check that Yes has been selected for waiver agreement
    // if (formData.agreement !== "Yes") {
    //   newErrors.agreement = "You must agree to proceed.";
    // }

    setErrors(newErrors);

    console.log(JSON.stringify(formData));
    console.log(Object.keys(newErrors))

    // if no errors, process the form
    if (Object.keys(newErrors).length === 0) {
      // https://jumbocodegpt.onrender.com/tutorsubmission
      // http://localhost:3000/tutorsubmission

      console.log("before fetching"); //UPDATE THISSSS
    //   fetch("http://localhost:3000/tutorsubmission", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => console.log(data))
    //     .catch((error) => console.error(error));
    //   console.log("Form submitted successfully:", formData);


    
      //reset form
      // setFormData({
      //   childFirstName: "",
      //   childLastName: "",
      //   gender: "",
      //   grade: "",
      //   specialNeeds: "",
      //   specialNeedsInfo: "",
      //   parentFirstName: "",
      //   parentLastName: "",
      //   phone: "",
      //   email: "",
      //   subject: "",
      //   tutoringMode: "",
      //   additionalInfo: "",
      //   agreement: "",
      //   signature: "",
      // });

      setShowTextBox(false);
      alert("Form submitted successfully!");

    //   navigate("/success-page");
    }
  };

  return (
    <div className="p-16 bg-[#F5F5F5]">
      <h1 className="text-center text-5xl font-medium text-[#1E3B68] mb-4">Join our E-List!</h1>
      <h1 className="text-center text-xl font-light text-[#1E3B68]">Sign up to receive updates on our activities and events.</h1>

      <form onSubmit={handleSubmit} className="">
        {/* <div className="bg-white p-5 rounded-lg max-w-xl mx-auto my-8 shadow-md border border-gray-300"> */}
        {/* <div className="bg-white px-3"> */}
        <form className="grid grid-cols-1 gap-3 max-w-lg mx-auto my-7">
            {[
            { label: "Full Name", id: "fullName" },
            { label: "Tufts Email", id: "tuftsEmail" },
            { label: "Year of Graduation", id: "gradYear" },
            ].map((field) => (
            <div className="flex flex-col" key={field.id}>
                {/* <label htmlFor={field.id} className="pb-1">
                {field.label}
                </label> */}
                <input
                type="text"
                id={field.id}
                name={field.id}
                onChange={handleChange}
                value={formData[field.id as keyof FormData] as string}
                placeholder={field.label}
                className={`font-light rounded-lg border border-gray-300 p-2 text-center ${
                    errors[field.id as keyof FormData]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                />
                {errors[field.id as keyof FormData] && (
                <span className="text-red-500 text-sm">
                    {errors[field.id as keyof FormData]}
                </span>
                )}
            </div>
            ))}
        </form>
        {/* </div> */}
        {/* </div> */}

        {/* <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
          <div className="bg-white px-3 space-y-2">
            <h2 className="text-xl font-bold text-left pb-3">LCS Tutee</h2>
            <form className="flex flex-col gap-3">
              <div className="flex flex-col space-y-2">
                <label>Were you paired with a tutee last semester?</label>
                <div className="flex gap-3 pt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pairedWithTutee"
                      value="yes"
                      checked={formData.pairedWithTutee === "yes"}
                      onChange={handleRadioChange}
                      //required
                    />{" "}
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pairedWithTutee"
                      value="no"
                      checked={formData.pairedWithTutee === "no"}
                      onChange={handleRadioChange}
                    />{" "}
                    No
                  </label>
                  {errors.pairedWithTutee && (
                    <span className="text-red-500 text-sm">
                      {errors.pairedWithTutee}
                    </span>
                  )}
                </div>
                {showTextBox && (
                  <input
                    type="text"
                    placeholder="If you are continuing with a student(s) from last semester, please name them here"
                    name="pairedTutee"
                    value={formData.pairedTutee}
                    onChange={handleChange}
                    className="mt-2 p-2 border border-gray-300 rounded"
                    //required={formData.specialNeeds === "yes"}
                  />
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label>
                  How many students do you want to tutor? (Not including the
                  student if stated above)
                </label>
                <Select
                  id="small"
                  name="numTutees"
                  options={num_tutees_options}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select one"
                  value={
                    num_tutees_options.find(
                      (option) => option.value === formData.numTutees
                    ) || null
                  }
                  onChange={handleSelectChange}
                  //required
                />
                {errors.numTutees && (
                  <span className="text-red-500 text-sm">
                    {errors.numTutees}
                  </span>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label>
                  What grade levels are you comfortable working with?
                </label>
                <Select
                  isMulti
                  name="gradeLevels"
                  options={grade_options}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select as many as you like"
                  value={grade_options.filter((option) =>
                    formData.gradeLevels.includes(Number(option.value))
                  )}
                  onChange={handleMultiSelectChange}
                  //required
                />
                {errors.gradeLevels && (
                  <span className="text-red-500 text-sm">
                    {errors.gradeLevels}
                  </span>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label>
                  Do you feel comfortable working with students with special
                  needs (including but not limited to learning disabilities,
                  ADD/ADHD, Autism, etc)? We will provide resources to assist
                  while tutoring.
                </label>
                <div className="flex gap-3 pt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="comfortableSpecialNeeds"
                      value="yes"
                      checked={formData.comfortableSpecialNeeds === true}
                      onChange={handleRadioChange}
                      //required
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="comfortableSpecialNeeds"
                      value=""
                      checked={formData.comfortableSpecialNeeds === false}
                      onChange={handleRadioChange}
                    />
                    No
                  </label>
                  {errors.comfortableSpecialNeeds && (
                    <span className="text-red-500 text-sm">
                      {errors.comfortableSpecialNeeds}
                    </span>
                  )}
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
                  name="subjects"
                  options={subject_options}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select as many as you like"
                  value={subject_options.filter((option) =>
                    formData.subjects.includes(option.value)
                  )}
                  onChange={handleMultiSelectChange}
                  //required
                />
                {errors.subjects && (
                  <span className="text-red-500 text-sm">
                    {errors.subjects}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-base">
                  Language Proficiency other than English
                </h1>
                <input
                  type="text"
                  name="languageProficiencies"
                  value={formData.languageProficiencies}
                  onChange={handleChange}
                  placeholder="Enter a description..."
                  className="w-full p-2 bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <h1 className="text-base">Tutoring Mode</h1>
                <Select
                  id="small"
                  name="tutoringMode"
                  options={tutoring_mode_options}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select one"
                  value={
                    tutoring_mode_options.find(
                      (option) => option.value === formData.tutoringMode
                    ) || null
                  }
                  onChange={handleSelectChange}
                  //required
                />
                {errors.tutoringMode && (
                  <span className="text-red-500 text-sm">
                    {errors.tutoringMode}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-base">
                  Anything else you would like to let us know?
                </h1>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
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
              I understand and agree to the "Tufts Tutor Code of Conduct" (shown
              below)
            </p>
            <div className="flex space-x-3 py-2">
              <label className="inline-flex items-center space-x-2 text-black">
                <input
                  type="radio"
                  name="agreement"
                  value="Yes"
                  checked={formData.agreement === "Yes"}
                  onChange={handleRadioChange}
                  className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-400"
                  //required
                />
                <span className="text-black">Yes</span>
              </label>
              <label
                htmlFor="radio-2"
                className="inline-flex items-center space-x-2"
              >
                <input
                  type="radio"
                  name="agreement"
                  value="No"
                  checked={formData.agreement === "No"}
                  onChange={handleRadioChange}
                  //required
                  className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-400 focus:ring-gray-400"
                />
                <span className="text-black">No</span>
              </label>
              {errors.agreement && (
                <span className="text-red-500 text-sm">{errors.agreement}</span>
              )}
            </div>

            <div className="w-full border border-gray-200 rounded-lg overflow-hidden mt-2">
              <iframe
                src="/Tufts Tutor Waiver.pdf"
                className="w-full h-[500px]"
                title="Tutor Waiver"
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
                //required
              />
              {errors.signature && (
                <span className="text-red-500 text-sm">{errors.signature}</span>
              )}
            </div>
          </div>*/}
          <div className="flex justify-center"> 
            <button
                  className="rounded-full bg-[#1E3B68] py-2.5 px-4 text-white text-xl"
                  type="submit"
                >
                  Submit
            </button>
          </div>
      </form>
    </div>
  );
}