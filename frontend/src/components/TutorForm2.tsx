export default function TutorForm2() {
  return (
    <div>
      <div className="w-full max-w-2xl mx-auto mt-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-xl text-left font-bold text-black">
              LCS Tutor Preference
            </h1>

            <div className="space-y-2">
              <h1 className="text-base font-bold text-black">
                What subjects would you like to tutor?
              </h1>
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-400 focus:outline-none">
                <option>Select as many as you like</option>
                <option>Early Reading (Grades 1-3)</option>
                <option>Reading (Grades 3 and up)</option>
                <option>English/Language Arts</option>
                <option>Math (1-8)</option>
                <option>Geometry/Trig</option>
                <option>Algebra</option>
                <option>Precalculus</option>
                <option>Calculus</option>
                <option>Statistics</option>
                <option>Computer Science</option>
                <option>Science (1-8)</option>
              </select>
            </div>

            <div className="space-y-2">
              <h1 className="text-base font-bold text-black">
                Language Proficiency other than English
              </h1>
              <input
                type="text"
                placeholder="Enter a description..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-400 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-base font-bold text-black">Tutoring Mode</h1>
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-400 focus:outline-none">
                <option>Select an option</option>
                <option>Virtual Only</option>
                <option>In-person Only</option>
                <option>Either is fine</option>
              </select>
            </div>

            <div className="space-y-2">
              <h1 className="text-base font-bold text-black">
                Which virtual platforms are you comfortable using to tutor, if
                applicable?
              </h1>
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-400 focus:outline-none">
                <option>Select an many as you like</option>
                <option>Zoom</option>
                <option>Skype</option>
                <option>Google Hangouts</option>
                <option>FaceTime</option>
              </select>
            </div>

            <div className="space-y-2">
              <h1 className="text-base font-bold text-black">
                Anything else you would like to let us know?
              </h1>
              <input
                type="text"
                placeholder="Enter a description..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-400 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto mt-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-xl text-left font-bold text-black pb-4">
              Agreement
            </h1>
            <p>
              I understand and agree to the "Tufts Tutor Code of Conduct" (shown
              below)
            </p>
            <div className="flex space-x-2">
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
                  id="radio-2"
                  name="radio-group"
                  value="No"
                  required
                  className="w-4 h-4 text-gray-400 bg-gray-100 border-gray-400 focus:ring-gray-400"
                />
                <span className="text-gray-400">No</span>
              </label>
            </div>

            <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf"
                className="w-full h-[500px]"
                title="Tutor Code of Conduct"
              />
            </div>

            <div className="space-y-2">
              <p className="text-black text-bold">
                Electronic Signature (Please note that your electronic signature
                has the same legality as one that is hand-signed)
              </p>
              <input
                type="text"
                placeholder="Enter Full Name"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-400 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      {/*-- end first card --*/}
      <div className="flex justify-center mt-4 mb-8">
        <button className="bg-blue-900 text-white font-medium py-2 px-6 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50">
          Submit
        </button>
      </div>
    </div>
  );
}
