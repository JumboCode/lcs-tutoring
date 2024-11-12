import MatchedInfoBox from "./MatchedInfoBox";
import Header from "./header";
import Footer from "./Footer";
import { useState } from "react";
import { IBoxProps } from "../types";
import { BsPlusLg } from "react-icons/bs";
// import FilterButton from "./FilterButton";

// Add these constants at the top of the file, after imports
const TABS = {
  UNMATCHED: 0,
  MATCHED: 1,
  INACTIVE: 2,
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
  const [isActive, setIsActive] = useState<TabType>(TABS.UNMATCHED);

  // Add state to track which emails have been sent
  const handleEmailSend = (index: number) => {
    // Here you would typically implement the actual email sending logic
    console.log(`Sending email for index ${index}`);
  };

  const tutees = [
    {
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
      gender: "Female",
      tutoring_mode: "Hybrid",
      parent_first_name: "Alice",
      parent_last_name: "Bob",
      phone: "(123) 456-7890",
      matched: true,
    },
    {
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
      gender: "Female",
      tutoring_mode: "Hybrid",
      parent_first_name: "Alice",
      parent_last_name: "Bob",
      phone: "(123) 456-7890",
      matched: false,
    },
    {
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
      gender: "Female",
      tutoring_mode: "Hybrid",
      parent_first_name: "Alice",
      parent_last_name: "Bob",
      phone: "(123) 456-7890",
      matched: true,
    },
  ];

  return (
    <div>
      <Header />
      <div className="w-full items-center flex justify-center">
        <div className="w-full py-4 items-center justify-center flex flex-col max-w-4xl">
          <div className="flex flex-row w-full justify-between">
            <h1 className="text-3xl font-bold">Approved Matched</h1>
            <div className="gap-x-2 flex flex-row items-center">
              <button className="px-6 py-2 border-2 border-[#E7E7E7] rounded-lg text-[#888888]">
                <div className="flex flex-row gap-x-2 items-center justify-center ">
                  <BsPlusLg color="gray" size={20} />
                  <p>Filters</p>
                </div>
              </button>
              <button className="px-6 py-2 border-2 border-[#E7E7E7] rounded-lg text-[#888888]">
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
                    onClick={() => setIsActive(TABS.UNMATCHED)}
                  >
                    <h1
                      className={
                        isActive === TABS.UNMATCHED
                          ? COLORS.ACTIVE
                          : COLORS.INACTIVE
                      }
                    >
                      Unmatched
                    </h1>
                    <div
                      className={
                        "flex w-8 h-8 rounded-full items-center justify-center " +
                        (isActive === TABS.UNMATCHED
                          ? COLORS.ACTIVE_BG
                          : COLORS.INACTIVE_BG)
                      }
                    >
                      {tutees.filter((box_props) => box_props.matched).length}
                    </div>
                  </div>
                  <div
                    className={
                      "flex flex-row space-x-2 items-center cursor-pointer"
                    }
                    onClick={() => setIsActive(TABS.MATCHED)}
                  >
                    <h1
                      className={
                        isActive === TABS.MATCHED
                          ? COLORS.ACTIVE
                          : COLORS.INACTIVE
                      }
                    >
                      Matched
                    </h1>
                    <div
                      className={
                        "flex w-8 h-8 rounded-full items-center justify-center " +
                        (isActive === TABS.MATCHED
                          ? COLORS.ACTIVE_BG
                          : COLORS.INACTIVE_BG)
                      }
                    >
                      {
                        tutees.filter(
                          (box_props) => box_props.matched === false
                        ).length
                      }
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
                      6
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-row justify-start space-x-8 ${COLORS.TABLE_BG} w-full`}
              >
                <div className="w-1/5 my-3">
                  <h1 className="text-gray-500 text-lg ml-3">Date</h1>
                </div>
                <div className="w-1/5 my-3">
                  <h1 className="text-gray-500 text-lg">Tutor</h1>
                </div>
                <div className="w-1/5 my-3">
                  <h1 className="text-gray-500 text-lg">Tutee</h1>
                </div>
                <div className="w-1/5 my-3 items-center flex justify-center">
                  <h1 className="text-gray-500 text-lg">Status</h1>
                </div>
                <div className="w-1/5"></div>
              </div>
              {isActive === TABS.UNMATCHED && (
                <div>
                  {tutees
                    .filter((box_props) => box_props.matched)
                    .map((box_props, index) => (
                      <MatchedInfoBox
                        box_props={{
                          ...box_props,
                          handleEmailSend: handleEmailSend,
                          matched: true,
                        }}
                        index={index}
                        key={index}
                      />
                    ))}
                </div>
              )}
              {isActive === TABS.MATCHED && (
                <div>
                  {tutees
                    .filter((box_props) => box_props.matched === false)
                    .map((box_props, index) => (
                      <MatchedInfoBox
                        box_props={{
                          ...box_props,
                          handleEmailSend: handleEmailSend,
                          matched: false,
                        }}
                        index={index}
                        key={index}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
