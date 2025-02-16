import { useState, ChangeEvent, FormEvent } from "react";
import Select, { ActionMeta, SingleValue, MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";

interface FormData {
  firstName: string;
  lastName: string;
  pronouns: string;
  id: string;
  major: string;
  yearGrad: string;
  phone: string;
  email: string;
  pairedWithTutee: string;
  pairedTutee: string;
  numTutees: string;
  gradeLevels: number[];
  comfortableSpecialNeeds: boolean | null;
  subjects: string[];
  languageProficiencies: string;
  tutoringMode: string;
  notes: string;
  agreement: string;
  signature: string;
}

type FormErrors = {
  [key in keyof FormData]?: string;
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
  { value: "Biology", label: "Biology" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "Italian", label: "Italian" },
  { value: "SAT/ACT", label: "SAT/ACT" },
  { value: "US History", label: "US History" },
  { value: "Global History", label: "Global History" },
  { value: "Other", label: "Other" },
];

const grade_options = [
  { value: "0", label: "Kindergarten" },
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

const num_tutees_options = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
];

const tutoring_mode_options = [
  { value: "Virtual", label: "Virtual only" },
  { value: "In-person", label: "In-person only" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Anything", label: "Anything is fine" },
];

export default function TutorForm() {
  const navigate = useNavigate();

  //variable that holds form data
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    pronouns: "",
    id: "",
    major: "",
    yearGrad: "",
    phone: "",
    email: "",
    pairedWithTutee: "",
    pairedTutee: "",
    numTutees: "",
    gradeLevels: [],
    comfortableSpecialNeeds: null,
    subjects: [],
    languageProficiencies: "",
    tutoringMode: "",
    notes: "",
    agreement: "",
    signature: "",
  });

  //errors
  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    pronouns: "",
    id: "",
    major: "",
    yearGrad: "",
    phone: "",
    email: "",
    pairedWithTutee: "",
    numTutees: "",
    gradeLevels: "",
    comfortableSpecialNeeds: "",
    subjects: "",
    languageProficiencies: "",
    tutoringMode: "",
    notes: "",
    agreement: "",
    signature: "",
  });

  //for past tutee Desc.
  const [showTextBox, setShowTextBox] = useState(false);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "comfortableSpecialNeeds" ? Boolean(value) : value,
    }));

    if (name === "pairedWithTutee") {
      setShowTextBox(value === "yes");
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "", // clear error when user selects an option
    }));
  };

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

  const handleSelectChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    const name = actionMeta?.name;

    if (!name) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleMultiSelectChange = (
    selectedOption: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    const name = actionMeta?.name;

    if (!name) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption
        ? selectedOption.map((option) =>
            name === "gradeLevels" ? Number(option.value) : option.value
          )
        : [],
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

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

      if (formData["id"].length != 7 || isNaN(Number(formData["id"]))) {
        // && !isNaN(Number(formData["id"]))
        if (formData["id"].length != 0) { 
          newErrors["id"] = "Invalid Tufts ID"; 
        }
      } 
      
      if (formData["phone"].length != 10 || isNaN(Number(formData["phone"]))) {
        if (formData["phone"].length != 0) { 
          newErrors["phone"] = "Invalid Phone Number"; 
        }
      }

      if (formData["yearGrad"].length != 4 || isNaN(Number(formData["yearGrad"])) || 
          !(Number(formData["yearGrad"]) >= 2025 && Number(formData["yearGrad"]) <= 2028)) {
          if (formData["yearGrad"].length != 0) { 
            newErrors["yearGrad"] = "Invalid Year of Graduation";
          }
      }

      if (!formData["email"].endsWith("@tufts.edu")) {
        if (formData["email"].length != 0) { 
          newErrors["email"] = "Invalid Tufts email";
        }
      }
    });

    //check that Yes has been selected for waiver agreement
    if (formData.agreement !== "Yes") {
      newErrors.agreement = "You must agree to proceed.";
    }

    setErrors(newErrors);

    console.log(JSON.stringify(formData));
    console.log(Object.keys(newErrors))

    // if no errors, process the form
    if (Object.keys(newErrors).length === 0) {
      // https://jumbocodegpt.onrender.com/tutorsubmission
      // http://localhost:3000/tutorsubmission

      console.log("before fetching");
      fetch("http://localhost:3000/tutorsubmission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      console.log("Form submitted successfully:", formData);

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

      navigate("/success-page");
    }
  };

  return (
    <div className="pt-10 bg-[#FAFCFE] min-h-screen">
      <h1 className="text-center text-2xl font-bold">Tutor Survey</h1>

      <form onSubmit={handleSubmit} className="">
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
                { label: "Student ID Number", id: "id" },
                { label: "Major", id: "major" },
                { label: "Year of Graduation", id: "yearGrad" },
                { label: "Phone Number", id: "phone" },
                { label: "Tufts Email", id: "email" },
              ].map((field) => (
                <div className="flex flex-col" key={field.id}>
                  <label htmlFor={field.id} className="pb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    id={field.id}
                    name={field.id}
                    onChange={handleChange}
                    value={formData[field.id as keyof FormData] as string}
                    placeholder="Enter a description..."
                    className={`rounded-lg border border-gray-300 p-2 ${
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
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
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
          </div>
          <div className="flex justify-center mt-4 mb-8">
            <button
              type="submit"
              className="bg-blue-900 text-white font-medium py-2 px-6 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
