import config from "../config.ts";
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import copyGray from "../assets/images/admin_view/copy_email_gray.svg";
import copyBlue from "../assets/images/admin_view/copy_email_blue.svg";

interface Member {
  id: string;
  name: string | null;
  email: string | null;
  gradYear: string | null;
}

const MailingList: React.FC = () => {
  const [mailingList, setMailingList] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showElistDeleteDialog, setShowElistDeleteDialog] = useState(false);
  const [selectedElistId, setSelectedElistId] = useState<string | null>(null);

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(identifier);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchMailingList = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${config.backendUrl}/mailing-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setMailingList(data.mailingList);
      } catch (error) {
        console.error("Error fetching mailing list users:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMailingList();
  }, []);

  const handleDelete = async (elist_id: string) => {
    try {
      // Use Clerk's admin API to delete the user
      const token = await getToken();
      const response = await fetch(
        `${config.backendUrl}/delete-elist/${elist_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user from the elist");
      }

      // Remove the user from the local state
      setMailingList((prevUsers) =>
        prevUsers.filter((user) => user.id !== elist_id)
      );
    } catch (error) {
      console.error("Error deleting user from elist:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex flex-row justify-between">
        <h1 className="text-3xl font-bold text-left">E-List</h1>
        <button
          className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-[#F0F8FF]"
          onClick={() =>
            copyToClipboard(
              mailingList
                .map((member) => member.email)
                .filter(Boolean)
                .join(", "),
              "all"
            )
          }
          onMouseEnter={(e) =>
            e.currentTarget.children[0].setAttribute("src", copyBlue)
          }
          onMouseLeave={(e) =>
            e.currentTarget.children[0].setAttribute("src", copyGray)
          }
        >
          {copiedEmail === "all" ? (
            <span className="text-[#1f3a68] text-sm font-semibold">
              ✓ Copied
            </span>
          ) : (
            <>
              <img src={copyGray} alt="Copy icon" className="w-4 h-4" />
              Copy all email addresses
            </>
          )}
        </button>
      </div>
      <hr className="border-t-1 border-gray w-full my-2 mt-3" />

      {/* When awaiting the fetch */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <p className="text-lg text-gray-500">Loading E-List...</p>
        </div>
      )}

      {/* Error if fetch fails */}
      {error && (
        <div className="flex items-center justify-center py-10 text-red-500">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      )}

      {/* Successful load and no errors */}
      {!loading && !error && (
        <div
          className={`w-full flex-grow border border-[#F5F5F3] rounded-lg bg-white p-4 mt-3`}
        >
          <table className="w-full">
            <thead>
              <tr className="h-[35px] bg-[#F1F7FD]">
                <td className="px-8 w-[30%]">
                  <h1 className="text-gray-500 text-lg">Name</h1>
                </td>
                <td className="w-[30%]">
                  <h1 className="text-gray-500 text-lg">E-Mail</h1>
                </td>
                <td className="w-[30%]">
                  <h1 className="text-gray-500 text-lg">Grad Year</h1>
                </td>
                <td className="w-[30%]">
                  <h1 className="text-gray-500 text-lg">Delete</h1>
                </td>
              </tr>
            </thead>
            <tbody>
              {mailingList.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="py-2 px-8">{member.name}</td>
                  <td className="py-2 flex items-center gap-2">
                    {member.email}
                    {member.email && (
                      <button
                        onClick={() =>
                          copyToClipboard(member.email!, member.email!)
                        }
                        onMouseEnter={(e) =>
                          e.currentTarget.children[0].setAttribute(
                            "src",
                            copyBlue
                          )
                        }
                        onMouseLeave={(e) =>
                          e.currentTarget.children[0].setAttribute(
                            "src",
                            copyGray
                          )
                        }
                        className="ml-2"
                      >
                        {copiedEmail === member.email ? (
                          <span className="text-[#1f3a68] text-sm font-semibold">
                            ✓
                          </span>
                        ) : (
                          <img
                            src={copyGray}
                            alt="Copy email"
                            className="w-4 h-4"
                          />
                        )}
                      </button>
                    )}
                  </td>
                  <td className="py-2 pl-4">{member.gradYear}</td>
                  <td className="py-2 pl-4">
                    <button
                      onClick={() => {
                        setSelectedElistId(member.id);
                        setShowElistDeleteDialog(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete user"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showElistDeleteDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this E-List Member?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => {
                  setShowElistDeleteDialog(false);
                  setSelectedElistId(null);
                }}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-[#6a7eae] text-white hover:bg-[#313F60]"
                onClick={() => {
                  if (selectedElistId) {
                    handleDelete(selectedElistId);
                  }
                  setShowElistDeleteDialog(false);
                  setSelectedElistId(null);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailingList;
