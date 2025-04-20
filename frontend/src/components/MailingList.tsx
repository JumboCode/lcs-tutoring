import config from "../config.ts";
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

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

  // // Ensure only admins can access this page
  // if (!user || !user.publicMetadata?.role?.includes("admin")) {
  //   return <div>Access Denied</div>;
  // }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex flex-row justify-between">
        <h1 className="text-3xl font-bold text-left">E-List</h1>
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
                  <td className="py-2">{member.email}</td>
                  <td className="py-2 pl-4">{member.gradYear}</td>
                  <td className="py-2 pl-4">
                    <button
                      onClick={() => handleDelete(member.id)}
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
    </div>
  );
};

export default MailingList;
