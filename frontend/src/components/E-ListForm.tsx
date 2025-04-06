import { useState, ChangeEvent, FormEvent } from "react";
import config from "../config.ts";

interface FormData {
  fullName: string;
  tuftsEmail: string;
  gradYear: string;
}

type FormErrors = {
  [key in keyof FormData]?: string;
};

export default function EListForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  //variable that holds form data
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    tuftsEmail: "",
    gradYear: "",
  });

  //errors
  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    tuftsEmail: "",
    gradYear: "",
  });

  //for past tutee Desc.
  const [errorMessage, setErrorMessage] = useState("");

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

  //submit function with data validation
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: FormErrors = {};

    // check for empty fields
    Object.keys(formData).forEach((key) => {
      if (
        // Check required fields
        formData[key as keyof typeof formData] === ""
      ) {
        newErrors[key as keyof FormData] = "Field needs to be filled out.";
      }
    });

    setErrors(newErrors);

    console.log(JSON.stringify(formData));
    console.log(Object.keys(newErrors));

    // if no errors, process the form
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${config.backendUrl}/e-list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setFormData({
            fullName: "",
            tuftsEmail: "",
            gradYear: "",
          });
          setIsSubmitted(true);
        }
        if (response.status === 400) {
          setErrorMessage(
            "Unable to submit form. You are already on the E-List."
          );
        }
      } catch (error) {
        setIsSubmitted(false);
        console.log("Error submitting form:", error);
        alert("Unable to submit form. Please try again later.");
      }

      alert("Form submitted successfully!");

      // navigate("/success-page");
    }
  };

  return (
    <div className="p-16 bg-[#F5F5F5]">
      <h1 className="text-center text-5xl font-medium text-[#1E3B68] mb-4">
        Join our E-List!
      </h1>
      <h1 className="text-center text-xl font-light text-[#1E3B68]">
        Sign up to receive updates on our activities and events.
      </h1>
      {isSubmitted ? (
        <div className="bg-white rounded-lg max-w-lg mx-auto my-7 p-8 text-center shadow-md">
          <h2 className="text-2xl font-medium text-[#1E3B68] mb-4">
            Thank you for submitting your email!
          </h2>
          <p className="text-gray-700">Keep an eye out for an email!</p>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-3 max-w-lg mx-auto my-7"
          >
            {[
              { label: "Full Name", id: "fullName" },
              { label: "Tufts Email", id: "tuftsEmail" },
              { label: "Year of Graduation", id: "gradYear" },
            ].map((field) => (
              <div className="flex flex-col" key={field.id}>
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

            <div className="flex justify-center mt-4">
              <button
                className="rounded-full bg-[#1E3B68] py-2.5 px-4 text-white text-xl"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
          <div className="w-full flex items-center align-middle justify-center">
            {" "}
            <p className="text-red-600">{errorMessage}</p>
          </div>
        </>
      )}
    </div>
  );
}
