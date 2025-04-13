import config from "../config.ts";
("use client");
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { tuteeBoxProps, tutorBoxProps } from "../types";
import { IoIosArrowForward } from "react-icons/io";
import { BsEnvelope } from "react-icons/bs";
import { BsCheck2 } from "react-icons/bs";
import FLAG from "../assets/images/admin_view/flag.svg";
import RED_FLAG from "../assets/images/admin_view/red_flag.svg";
import deleteIcon from "../assets/images/delete.svg";
import unmatch_pair from "../assets/images/approved_matches/unmatch_pair.svg";

const STYLES = {
  colors: {
    textGray: "#888888",
    phoneGray: "#6B7280",
    evenBackground: "#FAFCFE",
    flaggedBackground: "black",
  },
  transitions: {
    arrow: "transform 0.3s",
    colors: "transition-colors duration-150",
  },
} as const;

type MatchedInfoBoxProps = {
  tutee_props: tuteeBoxProps;
  tutor_props: tutorBoxProps;
  matchId: string;
  flagged: boolean;
  bgColor: string;
  pair_date: string;
  inactive_date?: string;
  isActive: boolean;
  sent_email: boolean;
  onUnpair?: (matchId: string) => void;
};

export default function MatchedInfoBoxbox_props({
  tutee_props,
  tutor_props,
  matchId,
  flagged,
  pair_date,
  inactive_date,
  isActive,
  sent_email,
  onUnpair,
}: MatchedInfoBoxProps) {
  const { first_name, last_name, email } = tutor_props;

  const {
    tutee_first_name,
    tutee_last_name,
    parent_first_name,
    parent_last_name,
    parent_email,
    tutoring_mode,
    special_needs,
    subjects,
    grade,
  } = tutee_props;
  const [isCurrentlyFlagged, setIsCurrentlyFlagged] = useState(flagged);
  const [showDescription, setShowDescription] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [emailSent, setEmailSent] = useState(sent_email);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [showParentPopup, setShowParentPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tutee_email, _] =
    useState(`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
<div style="text-align: center; margin-bottom: 20px;">
<h2 style="color: #4a4a4a;">New Tutor Match Confirmation</h2></div>
<p>Dear TUTEE_PARENT_NAME,</p>
<p>We are pleased to inform you that <strong>TUTEE_NAME</strong> has been matched with a tutor. Your child's tutor will reach out to you directly within the next 48 hours to schedule your first session.</p>
<p>If you do not hear from the tutor within 48 hours, please let us know and we will follow up.</p>
<p>If you have any questions or concerns, please don't hesitate to contact us.</p>
<p>Sincerely,</p>
<p><strong>The LCSTutoring Team</strong></p>
</div>`);
  const [tutor_email, __] =
    useState(`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
<div style="text-align: center; margin-bottom: 20px;">
<h2 style="color: #4a4a4a;">New Student Match Confirmation</h2></div>
<p>Dear TUTOR_NAME,</p>
<p>We are pleased to inform you that you have been matched with a new student, <strong>TUTEE_NAME</strong>. Please reach out to the student's parent to schedule your first tutoring session.</p>
<div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
<h3 style="margin-top: 0; color: #2c87c5;">Student Details</h3>
<p><strong>Name:</strong> TUTEE_NAME</p>
<p><strong>Grade:</strong> TUTEE_GRADE</p> <p><strong>Subjects:</strong> TUTEE_SUBJECTS</p>
<h3 style="color: #2c87c5;">Parent Details</h3>
<p><strong>Name:</strong> TUTEE_PARENT_NAME</p>
<p><strong>Email:</strong> <a href="mailto:TUTEE_PARENT_EMAIL">TUTEE_PARENT_EMAIL</a></p>
<p><strong>Phone:</strong> TUTEE_PARENT_PHONE</p>
</div>
<div style="background-color: #e9f7fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
<h3 style="margin-top: 0; color: #2c87c5;">IMPORTANT NEXT STEPS</h3>
<ol>
<li>We notified the parent that you will be reaching out soon. Contact the parent within the next 48 hours to introduce yourself and arrange your first session.</li>
<li>If you don't hear back in a few days, send a follow-up email, and let us know.</li>
<li><strong>After scheduling your session, please email us with:</strong>
<ul><li>The scheduled date and time of your first session</li><li>The modality (virtual or in-person)</li></ul></li></ol></div>
<div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
<h3 style="margin-top: 0; color: #2c87c5;">TRACKING YOUR SERVICE HOURS</h3>
<p>Keep track of your service hours by joining LCS Tutoring on Tufts Civic Impact.</p>
<p><strong>To log hours:</strong></p>
<ol><li>Follow <a href="https://tufts.givepulse.com/group/293572-LCS-Tutoring">this link</a> and login to your Tufts account and request to join the group. We will approve your request.</li>
<li>Once approved, select <strong>add impact</strong> under the LCS Tutoring group, enter your tutoring hours each time you tutor and add impact!</li>
<li>You can create a timesheet within the impact to add multiple dates and the hours spent tutoring. This way we are able to keep track of the contributions LCS Tutoring makes on our surrounding community!</li></ol></div>
<p>If you have any questions or concerns, we've set up a folder with resources for specific subjects, tutoring guidelines and more! Just click <a href="https://drive.google.com/drive/folders/1-DxKNfydnWzsZcX_aLNTp1orkBEhjF9u?usp=sharing">here</a>.</p>
<p>If you still have questions, please feel free to contact us!</p>
<p>Sincerely,</p>
<p><strong>The LCSTutoring Team</strong></p></div>`);
  const [tutee_input, setTuteeInput] = useState(tutee_email);
  const [tutor_input, setTutorInput] = useState(tutor_email);

  const unmatchPair = () => {
    setIsDropdownOpen(false);

    console.log("about to fetch unmatch pair");

    fetch(`${config.backendUrl}/unmatch-pair/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (onUnpair) onUnpair(matchId);
      })
      .catch((error) => console.error(error));
  };

  const deletePair = () => {
    setIsDropdownOpen(false);
    fetch(`${config.backendUrl}/delete-pair/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (onUnpair) onUnpair(matchId);
      })
      .catch((error) => console.error(error));
  };

  const handlePermDelete = () => {
    console.log("permdelete in match");
    setIsDropdownOpen(false);
    fetch(`${config.backendUrl}/perm-delete-match/${matchId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (onUnpair) onUnpair(matchId);
      })
      .catch((error) => console.error(error));
  };

  const handleToggleDescription = () => {
    setShowDescription(!showDescription);
    setIsRotated(!isRotated);
  };

  const handleSendEmail = async () => {
    console.log("sending email: ", tutee_input);
    try {
      const response = await fetch(`${config.backendUrl}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId: matchId,
          tutorName: `${first_name} ${last_name}`,
          tutorEmail: tutor_props.email,
          tuteeName: `${tutee_first_name} ${tutee_last_name}`,
          tuteeParentName: `${parent_first_name} ${parent_last_name}`,
          tuteeParentEmail: tutee_props.parent_email,
          tuteeParentPhone: tutee_props.parent_phone,
          tuteeSubjects: tutee_props.subjects,
          tuteeGrade: tutee_props.grade,
          tuteeMessage: tutee_input,
          tutorMessage: tutor_input,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setEmailSent(true);
    } catch (error) {}
  };

  const handleToggleFlag = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/flag/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: matchId }),
      });
      if (response.ok) {
        setIsCurrentlyFlagged(!isCurrentlyFlagged);
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Opening modal when clicking "Send Email" button
  const openModal = () => {
    setIsDropdownOpen(false);
    setModalVisible(true);
  };

  // Closing when admin clicks outside the modal or clicks the close button
  const closeModal = () => {
    setModalVisible(false);
    setTuteeInput(tutee_email);
    setTutorInput(tutor_email);
  };

  // Closing modal and sending email when admin clicks "Submit" button
  const closeAndSubmitModal = () => {
    setModalVisible(false);
    handleSendEmail();
  };



  return (
    <div
      className={`${
        isCurrentlyFlagged ? "bg-red-50" : "odd:bg-white even:bg-gray-50"
      } w-full h-auto border-b text-left transition-colors`}
    >
      <table className="table-fixed w-full">
        <thead>
          <tr className={`h-[80px] border-b`}>
            <th className="w-1/5 px-3 font-normal">
              {isCurrentlyFlagged && (
                <img src={RED_FLAG} className="w-4 h-4 inline-block mr-2" />
              )}
              <div className="flex flex-col">
                {inactive_date && (
                  <span className="font-medium">Inactive {inactive_date}</span>
                )}
                <span className="text-gray-500">Active {pair_date}</span>
              </div>
            </th>
            <th className="w-1/5 font-normal">
              <p>
                {first_name} {last_name}
              </p>
              <div className="text-[#888888] relative flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <BsEnvelope />
                </div>
                <p
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  onMouseEnter={() => setShowStudentPopup(true)}
                  onMouseLeave={() => setShowStudentPopup(false)}
                >
                  {email}
                </p>
                {showStudentPopup && (
                  <div className="absolute top-full mt-2 w-auto p-2 bg-white border border-gray-300 shadow-lg">
                    {email}
                  </div>
                )}
              </div>
            </th>
            <th className="w-1/5 font-normal">
              <p>
                {tutee_first_name} {tutee_last_name}
              </p>
              <div className="text-[#888888] relative flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <BsEnvelope />
                </div>
                <p
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  onMouseEnter={() => setShowParentPopup(true)}
                  onMouseLeave={() => setShowParentPopup(false)}
                >
                  {parent_email}
                </p>
                {showParentPopup && (
                  <div className="absolute top-full mt-2 w-auto p-2 bg-white border border-gray-300 shadow-lg">
                    {parent_email}
                  </div>
                )}
              </div>
            </th>
            <th className="w-1/5">
              <div className="flex flex-grow justify-center items-center">
                {isActive && (
                  <button
                    onClick={openModal}
                    disabled={emailSent}
                    className={`w-[150px] flex justify-center items-center rounded-full border-2 text-sm py-2 transition-colors duration-150 ${
                      emailSent
                        ? "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed"
                        : "border-[#1F3A68] text-[#1F3A68] bg-[#f1f7fd] hover:bg-[#e5f1fc]"
                    }`}
                  >
                    {emailSent ? (
                      <BsCheck2 size={20} />
                    ) : (
                      <BsEnvelope size={20} />
                    )}

                    <p className="font-medium ml-2">
                      {emailSent ? "Sent Email" : "Send Email"}
                    </p>
                  </button>
                )}
                {!isActive && <span className="font-normal">N/A</span>}
              </div>
            </th>
            <Modal
              show={modalVisible}
              onHide={closeModal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Email</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <span className="font-bold block text-center text-xl">
                  Tutee
                </span>
                <textarea
                  value={tutee_input}
                  onChange={(e) => {
                    setTuteeInput(e.target.value);
                  }}
                  className="w-full h-96 font-mono border p-2 rounded mb-2"
                />
                <span className="font-bold block text-center text-xl">
                  Tutor
                </span>
                <textarea
                  value={tutor_input}
                  onChange={(e) => {
                    setTutorInput(e.target.value);
                  }}
                  className="w-full h-96 font-mono border p-2 rounded mb-2"
                />
              </Modal.Body>
              <Modal.Footer>
                <button
                  onClick={closeAndSubmitModal}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit
                </button>
              </Modal.Footer>
            </Modal>
            <th className="w-1/5">
              <div className="flex items-center justify-center flex-row">
                <button
                  className="flex items-center text-[#888888] hover:text-gray-600"
                  onClick={handleToggleDescription}
                >
                  <div
                    style={{
                      transition: STYLES.transitions.arrow,
                    }}
                    className={`transform ${isRotated ? "rotate-90" : ""}`}
                  >
                    <IoIosArrowForward size={20} />
                  </div>
                  <span className="ml-2 p-0 font-normal">Details</span>
                </button>

                {isActive && (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="mb-2 ml-5 p-0 text-lg text-gray-400"
                    >
                      ...
                      <div
                        className={`transition-transform duration-300 ${
                          isDropdownOpen ? "scale-y-[-1]" : "scale-y-[1]"
                        }`}
                      ></div>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-1 bg-white rounded shadow min-w-[170px] z-50">
                        {/* <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100">
                        <div className="className=" mr-2 w-4 h-4 inline-block>
                          <BsTrashFill size={20} />
                        </div>
                        Remove Pair
                      </button> */}
                        {emailSent && (
                          <button
                            onClick={handleToggleFlag}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            {isCurrentlyFlagged ? (
                              <>
                                <img
                                  src={RED_FLAG}
                                  className="w-4 h-4 inline-block mr-2"
                                />
                                Unflag
                              </>
                            ) : (
                              <>
                                <img
                                  src={FLAG}
                                  className="w-4 h-4 inline-block mr-2"
                                />
                                Flag
                              </>
                            )}
                          </button>
                        )}
                        <button
                          className="flex flex-row w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={unmatchPair}
                        >
                          <img
                            src={unmatch_pair}
                            className="w-4 h-4 inline-block mr-2"
                          />
                          Unmatch Pair
                        </button>
                        <button
                          className="flex flex-row w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={deletePair}
                        >
                          <img
                            src={deleteIcon}
                            className="w-4 h-4 inline-block mr-2"
                          />
                          Delete Pair
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {!isActive && (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="mb-2 ml-5 p-0 text-lg text-gray-400"
                    >
                      ...
                      <div
                        className={`transition-transform duration-300 ${
                          isDropdownOpen ? "scale-y-[-1]" : "scale-y-[1]"
                        }`}
                      ></div>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-1 bg-white rounded shadow min-w-[170px] z-50">
                        {/* <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100">
                        <div className="className=" mr-2 w-4 h-4 inline-block>
                          <BsTrashFill size={20} />
                        </div>
                        Remove Pair
                      </button> */}
                        {emailSent && (
                          <button
                            onClick={handleToggleFlag}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            {isCurrentlyFlagged ? (
                              <>
                                <img
                                  src={RED_FLAG}
                                  className="w-4 h-4 inline-block mr-2"
                                />
                                Unflag
                              </>
                            ) : (
                              <>
                                <img
                                  src={FLAG}
                                  className="w-4 h-4 inline-block mr-2"
                                />
                                Flag
                              </>
                            )}
                          </button>
                        )}
                        <button
                          className="flex flex-row w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={handlePermDelete}
                        >
                          <img
                            src={deleteIcon}
                            className="w-4 h-4 inline-block mr-2"
                          />
                          Permanently Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </th>
          </tr>
        </thead>
        {showDescription && (
          <tbody className="bg-inherit">
            <tr className={`h-[35px] bg-gray-100/50 border-b`}>
              <td className="text-gray-400 px-3 w-1/5">Subject</td>
              <td className="text-gray-400 w-1/5">Grade</td>
              <td className="text-gray-400 w-1/5">Special Needs</td>
              <td className="text-gray-400 w-1/5">Tutoring Mode</td>
              <td className="text-gray-400 w-1/5"></td>
            </tr>
            <tr className={`h-[55px] border-b`}>
              <td className="px-3 w-1/5">{subjects.join(", ")}</td>
              <td className="w-1/5">
                {grade == "0"
                  ? "Kindergarten"
                  : grade == "1"
                  ? "1st"
                  : grade == "2"
                  ? "2nd"
                  : grade == "3"
                  ? "3rd"
                  : grade + "th"}
              </td>
              <td className="w-1/5">{special_needs ? special_needs : "No"}</td>
              <td className="w-1/5">{tutoring_mode}</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
