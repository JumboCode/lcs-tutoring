import MatchedInfoBox from "./MatchedInfoBox";
import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
// import FilterButton from "./FilterButton";

// Add these constants at the top of the file, after imports
const TABS = {
  ACTIVE: 0,
  INACTIVE: 1,
} as const;

const COLORS = {
  ACTIVE: "text-[#8DAADD]",
  INACTIVE: "text-gray-500",
  ACTIVE_BG: "bg-[#8DAADD] text-white",
  INACTIVE_BG: "bg-[#F1F7FD] text-gray-500",
  TABLE_BG: "bg-[#FAFCFE]",
  BORDER: "border-[#F5F5F3]",
} as const;

type TabType = (typeof TABS)[keyof typeof TABS];

export default function TuteeTable() {
  const [isActive, setIsActive] = useState<TabType>(TABS.ACTIVE);
  const date = "11/27/2024";

  // Add state to track which emails have been sent
  // const handleEmailSend = (index: number) => {
  //   // Here you would typically implement the actual email sending logic
  //   console.log(`Sending email for index ${index}`);
  // };

  const tutors = [
    {
      id: "1234567",
      date: "2024-11-26",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      subject_pref: ["Math", "Science", "English"],
      pronouns: "he/him",
      major: "Computer Science",
      year_grad: "2025",
      phone: "123-456-7890",
      previous_tutee: false,
      grade_level_pref: ["8", "9", "10"],
      num_tutees: 2,
      disability_pref: false,
      tutoring_mode: "In-person",
    },
    {
      id: "1234567",
      date: "2024-11-26",
      first_name: "Bill",
      last_name: "Doe",
      email: "john.doe@example.commmmm",
      subject_pref: ["Math", "Science", "English"],
      pronouns: "he/him",
      major: "Computer Science",
      year_grad: "2025",
      phone: "123-456-7890",
      previous_tutee: false,
      grade_level_pref: ["8", "9", "10"],
      num_tutees: 2,
      disability_pref: false,
      tutoring_mode: "In-person",
    },
    {
      id: "1234567",
      date: "2024-11-26",
      first_name: "George",
      last_name: "Doe",
      email: "john.doe@example.com",
      subject_pref: ["Math", "Science", "English"],
      pronouns: "he/him",
      major: "Computer Science",
      year_grad: "2025",
      phone: "123-456-7890",
      previous_tutee: false,
      grade_level_pref: ["8", "9", "10"],
      num_tutees: 2,
      disability_pref: true,
      tutoring_mode: "In-person",
    },
  ];

  const tutees = [
    {
      id: "1",
      date: "10/31/2024",
      tutee_first_name: "Bob",
      tutee_last_name: "Techakalayatum",
      tutee_email: "hello@gmail.com",
      tutor_first_name: "Alice",
      tutor_last_name: "Bob",
      tutor_email: "hello@gmail.com",
      subject: "Math, English",
      grade: "8",
      special_needs: "Yes",
      parent_email: "lalala@gmail.com",
      gender: "Female",
      tutoring_mode: "Hybrid",
      parent_first_name: "Alice",
      parent_last_name: "Bob",
      parent_phone: "(123) 456-7890",
      matched: true,
      notes: "This is a note",
    },
    {
      id: "3",
      date: "10/31/2024",
      tutee_first_name: "Joe",
      tutee_last_name: "Techakalayatum",
      tutee_email: "hello@gmail.com",
      tutor_first_name: "Alice",
      tutor_last_name: "Bob",
      tutor_email: "hello@gmail.com",
      subject: "Math, English",
      grade: "8",
      special_needs: "Yes",
      parent_email: "lalala@gmail.com",
      gender: "Female",
      tutoring_mode: "Hybrid",
      parent_first_name: "Alice",
      parent_last_name: "Bob",
      parent_phone: "(123) 456-7890",
      matched: true,
      notes: "This is a note",
    },
    {
      id: "4",
      date: "10/31/2024",
      tutee_first_name: "Alice",
      tutee_last_name: "Techakalayatum",
      tutee_email: "hello@gmail.com",
      tutor_first_name: "Alice",
      tutor_last_name: "Bob",
      tutor_email: "hello@gmail.com",
      subject: "Math, English",
      grade: "8",
      special_needs: "Yes",
      parent_email: "lalala@gmail.com",
      gender: "Female",
      tutoring_mode: "Hybrid",
      parent_first_name: "Alice",
      parent_last_name: "Bob",
      parent_phone: "(123) 456-7890",
      matched: true,
      notes: "This is a note",
    },
  ];

  return (
    <div>
      <div className="w-[70vw] items-center flex justify-center">
        <div className="w-full items-center justify-center flex flex-col">
          <div className="flex flex-row w-full justify-between">
            <h1 className="text-3xl font-bold">Approved Matches</h1>
            <div className="gap-x-2 flex flex-row items-center">
              <button className="px-6 py-2 bg-white border-2 border-[#E7E7E7] rounded-lg text-[#888888]">
                <div className="flex flex-row gap-x-2 items-center justify-center ">
                  <BsPlusLg color="gray" size={20} />
                  <p>Filters</p>
                </div>
              </button>
              <button className="px-6 py-2 bg-white border-2 border-[#E7E7E7] rounded-lg text-[#888888]">
                <div className="flex flex-row gap-x-2 items-center justify-center ">
                  <BsPlusLg color="gray" size={20} />
                  <p>Add</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center w-full">
            <div
              className={`flex-grow border-2 ${COLORS.BORDER} rounded-lg bg-white p-4 mt-4`}
            >
              <div className="flex flex-col">
                <div className="flex flex-row justify-start space-x-8 py-4 px-4">
                  <div
                    className={
                      "flex flex-row space-x-2 items-center cursor-pointer"
                    }
                    onClick={() => setIsActive(TABS.ACTIVE)}
                  >
                    <h1
                      className={
                        isActive === TABS.ACTIVE
                          ? COLORS.ACTIVE
                          : COLORS.INACTIVE
                      }
                    >
                      Active
                    </h1>
                    <div
                      className={
                        "flex w-8 h-8 rounded-full items-center justify-center " +
                        (isActive === TABS.ACTIVE
                          ? COLORS.ACTIVE_BG
                          : COLORS.INACTIVE_BG)
                      }
                    >
                      {tutees.length}
                    </div>
                  </div>
                  <div
                    className={
                      "flex flex-row space-x-2 items-center cursor-pointer"
                    }
                    onClick={() => setIsActive(TABS.INACTIVE)}
                  >
                    <h1
                      className={
                        isActive === TABS.INACTIVE
                          ? COLORS.ACTIVE
                          : COLORS.INACTIVE
                      }
                    >
                      Inactive
                    </h1>
                    <div
                      className={
                        "flex w-8 h-8 rounded-full items-center justify-center " +
                        (isActive === TABS.INACTIVE
                          ? COLORS.ACTIVE_BG
                          : COLORS.INACTIVE_BG)
                      }
                    >
                      0
                    </div>
                  </div>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="h-[35px] bg-gray-100">
                    <td className="px-3 w-1/5">
                      <h1 className="text-gray-500 text-lg">Date</h1>
                    </td>
                    <td className="w-1/5">
                      <h1 className="text-gray-500 text-lg">Tutor</h1>
                    </td>
                    <td className="w-1/5">
                      <h1 className="text-gray-500 text-lg">Tutee</h1>
                    </td>
                    <td className="w-1/5">
                      <h1 className="text-gray-500 text-lg text-center">
                        Status
                      </h1>
                    </td>
                    <td className="w-1/5"></td>
                  </tr>
                </thead>
              </table>
              {isActive === TABS.INACTIVE && (
                <div>No inactive functionality yet</div>
              )}
              {isActive === TABS.ACTIVE && (
                <div>
                  {tutees.map((tutee, index) => {
                    const tutor = tutors[index];
                    if (!tutor) return null;

                    return (
                      <MatchedInfoBox
                        tutee_props={{
                          ...tutee,
                        }}
                        tutor_props={{
                          ...tutor,
                        }}
                        bgColor="bg-white"
                        date={date}
                        key={index}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
