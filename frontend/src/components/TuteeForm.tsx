import config from "../config.ts";
import { useState, ChangeEvent, FormEvent } from "react";
import Select, { ActionMeta, SingleValue, MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useRaceConditionHandler } from "../hooks/useRaceConditionHandler";

//lets TypeScript know what kind of data
interface FormData {
  childFirstName: string;
  childLastName: string;
  gender: string;
  grade: number | undefined;
  specialNeeds: string;
  specialNeedsInfo: string;
  parentFirstName: string;
  parentLastName: string;
  phone: string;
  email: string;
  subjects: string[];
  tutoringMode: string;
  additionalInfo: string;
  agreement: string;
  signature: string;
}

type FormErrors = {
  [key in keyof FormData]?: string;
};

const subject_options = [
  { value: "Early Reading", label: "Early Reading (Below grade 3)" },
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

const gender_options = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Nonbinary", label: "Nonbinary" },
  { value: "Prefer", label: "Prefer to self-describe" },
  { value: "Decline", label: "Decline to state" },
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

const tutoring_mode_options = [
  { value: "Online", label: "Virtual only" },
  { value: "In-person", label: "In-person only" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Anything", label: "Anything is fine" },
];

export default function TuteeForm() {
  const navigate = useNavigate();
  const { handleAsyncOperation, isProcessing } = useRaceConditionHandler();

  //variable that holds form data
  const [formData, setFormData] = useState<FormData>({
    childFirstName: "",
    childLastName: "",
    gender: "",
    grade: undefined,
    specialNeeds: "",
    specialNeedsInfo: "",
    parentFirstName: "",
    parentLastName: "",
    phone: "",
    email: "",
    subjects: [],
    tutoringMode: "",
    additionalInfo: "",
    agreement: "",
    signature: "",
  });

  //errors
  const [errors, setErrors] = useState<FormErrors>({
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
    subjects: "",
    tutoringMode: "",
    additionalInfo: "",
    agreement: "",
    signature: "",
  });

  //for Special Needs Desc.
  const [showTextBox, setShowTextBox] = useState(false);

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "").substring(0, 10);

    const parts = [];
    if (digits.length > 0) parts.push("(" + digits.substring(0, 3));
    if (digits.length >= 4) parts.push(") " + digits.substring(3, 6));
    if (digits.length >= 7) parts.push("-" + digits.substring(6, 10));

    return parts.join("");
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "specialNeeds") {
      if (value === "no") {
        setFormData((prev) => ({
          ...prev,
          specialNeedsInfo: "",
        }));
        setErrors((prev) => ({
          ...prev,
          specialNeedsInfo: "",
        }));
      }
      setShowTextBox(value === "yes");
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "", // clear error when user selects an option
    }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    let newValue = value;

    if (name === "phone") {
      newValue = formatPhoneNumber(value); // apply formatting only to phone
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
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
        ? selectedOption.map((option) => option.value)
        : [],
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

  //submit function with data validation
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: FormErrors = {};

    // check for empty fields
    Object.keys(formData).forEach((key) => {
      if (
        // Check required fields, excluding optional ones or empty optional fields
        formData[key as keyof typeof formData] === "" &&
        (key !== "specialNeedsInfo" || formData.specialNeeds === "yes") &&
        key !== "additionalInfo"
      ) {
        newErrors[key as keyof FormData] = "Field needs to be filled out.";
      }
    });

    if (formData.specialNeeds === "") {
      newErrors.specialNeeds = "Please select";
    }

    if (formData.subjects.length === 0) {
      newErrors.subjects = "Please select at least one subject";
    }

    if (formData.grade === undefined) {
      newErrors.grade = "Please select a grade";
    }

    if (formData.specialNeeds === "yes" && !formData.specialNeedsInfo) {
      newErrors.specialNeedsInfo = "Please specify.";
    }

    if (!validator.isEmail(formData["email"])) {
      if (formData["email"].length != 0) {
        newErrors["email"] = "Invalid email";
      }
    }

    const digits = formData.phone.replace(/\D/g, "");

    if (digits.length != 10) {
      newErrors.phone = "Invalid Phone Number";
    }

    if (
      formData.signature !==
      formData.parentFirstName + " " + formData.parentLastName
    ) {
      newErrors[
        "signature"
      ] = `Signature is not of the form "${formData.parentFirstName} ${formData.parentLastName}".`;
    }

    //check that Yes has been selected for waiver agreement
    if (formData.agreement !== "Yes") {
      newErrors.agreement = "You must agree to proceed.";
    }

    setErrors(newErrors);

    // if no errors, process the form
    if (Object.keys(newErrors).length === 0) {
      formData.phone = digits;

      handleAsyncOperation(async () => {
        const response = await fetch(`${config.backendUrl}/tuteesubmission`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          alert("Error: " + errorText);
          throw new Error(errorText);
        }

        const data = await response.json();
        alert("Form submitted successfully!");
        navigate("/success-page");
        return data;
      }).catch((error) => {
        console.error("Submission error:", error);
      });
    } else {
      alert("Oops! Some fields have errors. Please check and try again.");
    }
  };

  return (
    <div className="pt-10 bg-[#FAFCFE] min-h-screen">
      <h1 className="text-center text-2xl font-bold">Tutee Survey</h1>

      <form onSubmit={handleSubmit} className="">
        <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
          {/* Child Information */}
          <div className="bg-white px-3">
            <h2 className="text-xl font-bold text-left pb-3">
              Child Information
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", id: "childFirstName" },
                { label: "Last Name", id: "childLastName" },
              ].map((field) => (
                <div className="flex flex-col" key={field.id}>
                  <label htmlFor={field.id} className="pb-1">
                    {field.label}
                    <sup className="text-red-500 font-bold"> *</sup>
                  </label>
                  <input
                    type="text"
                    id={field.id}
                    name={field.id}
                    onChange={handleChange}
                    value={formData[field.id as keyof FormData]}
                    placeholder="Enter a description..."
                    className={`rounded-lg border p-2 ${
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
            </div>
            <div className="flex space-x-4 pt-3">
              <div className="w-1/2 space-y-2">
                <h1 className="text-base space-y-2">
                  Gender<sup className="text-red-500 font-bold"> *</sup>
                </h1>
                <Select
                  id="small"
                  name="gender"
                  options={gender_options}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select one"
                  value={
                    gender_options.find(
                      (option) => option.value === formData.gender
                    ) || null
                  }
                  onChange={handleSelectChange}
                />
                {errors.gender && (
                  <span className="text-red-500 text-sm">{errors.gender}</span>
                )}
              </div>
              <div className="w-1/2 space-y-2">
                <h1 className="text-base space-y-2">
                  Grade<sup className="text-red-500 font-bold"> *</sup>
                </h1>
                <Select
                  id="small"
                  name="grade"
                  options={grade_options}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select one"
                  value={
                    grade_options.find(
                      (option) => option.value === formData.grade?.toString()
                    ) || null
                  }
                  onChange={handleSelectChange}
                />
                {errors.grade && (
                  <span className="text-red-500 text-sm">{errors.grade}</span>
                )}
              </div>
            </div>
            <div className="pt-3 flex flex-col">
              <label>
                Special Needs?<sup className="text-red-500 font-bold"> *</sup>
              </label>
              <div className="flex gap-3 pt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="specialNeeds"
                    value="yes"
                    checked={formData.specialNeeds === "yes"}
                    onChange={handleRadioChange}
                    //required
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
                {errors.specialNeeds && (
                  <span className="text-red-500 text-sm">
                    {errors.specialNeeds}
                  </span>
                )}
              </div>
              {showTextBox && (
                <input
                  type="text"
                  placeholder="Please specify"
                  name="specialNeedsInfo"
                  value={formData.specialNeedsInfo}
                  onChange={handleChange}
                  className="mt-2 p-2 border border-gray-300 rounded"
                  //required={formData.specialNeeds === "yes"}
                />
              )}
              {errors.specialNeedsInfo && (
                <span className="text-red-500 text-sm">
                  {errors.specialNeedsInfo}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
          {/* Parent Information */}
          <div className="bg-white px-3 space-y-2">
            <h2 className="text-xl font-bold text-left pb-3">
              Parent Information
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", id: "parentFirstName" },
                { label: "Last Name", id: "parentLastName" },
                { label: "Phone Number (US)", id: "phone" },
                { label: "Email", id: "email" },
              ].map((field) => (
                <div className="flex flex-col" key={field.id}>
                  <label htmlFor={field.id} className="pb-1">
                    {field.label}
                    <sup className="text-red-500 font-bold"> *</sup>
                  </label>
                  <input
                    type="text"
                    id={field.id}
                    name={field.id}
                    onChange={handleChange}
                    value={formData[field.id as keyof FormData]}
                    placeholder={
                      field.id === "phone"
                        ? "(123) 456-7890"
                        : "Enter a description..."
                    }
                    className={`rounded-lg border p-2 ${
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
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
          {/* Tutoring Preference */}
          <div className="bg-white px-3">
            <div className="space-y-4">
              <h1 className="text-xl text-left pb-3 font-bold">
                Tutoring Preference
              </h1>
              <div className="space-y-2">
                <h1 className="text-base space-y-2">
                  Subjects<sup className="text-red-500 font-bold"> *</sup>
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
                <h1 className="text-base space-y-2">
                  What are your preferences regarding in-person tutoring?
                  (Please note: students must come to Tufts campus to be tutored
                  in person)<sup className="text-red-500 font-bold"> *</sup>
                </h1>
                <Select
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
                  Anything else you would like to let us know? (Unlisted
                  subject, accommodation, etc.)
                </h1>
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
        </div>

        <div className="bg-white p-5 rounded-lg max-w-5xl mx-auto my-8 shadow-md border border-gray-300">
          {/* Agreement */}
          <div className="bg-white px-3">
            <h1 className="text-xl text-left pb-3 font-bold">Agreement</h1>
            <p>
              I understand and agree to the "Tufts Campus - Minor" waiver (shown
              below)<sup className="text-red-500 font-bold"> *</sup>
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
                src="/Release and Waiver Minors.pdf"
                className="w-full h-[500px]"
                title="Tutor Code of Conduct"
              />
            </div>
            <div className="pt-4 space-y-2">
              <p className="text-black text-bold">
                Electronic Signature (Please note that your electronic signature
                has the same legality as one that is hand-signed)
                <sup className="text-red-500 font-bold"> *</sup>
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
              disabled={isProcessing}
              className={`bg-blue-900 text-white font-medium py-2 px-6 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50 ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
