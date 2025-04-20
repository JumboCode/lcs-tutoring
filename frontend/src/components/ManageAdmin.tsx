import config from "../config.ts";
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import AdminSignUp from "./adminSignUp.tsx";
import { useAuth } from "@clerk/clerk-react";

interface WhitelistedUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: {
    emailAddress: string;
  }[];
}

const ManageAdmin: React.FC = () => {
  const [whitelistedUsers, setWhitelistedUsers] = useState<WhitelistedUser[]>(
    []
  );
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchWhitelistedUsers = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${config.backendUrl}/whitelisted-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setWhitelistedUsers(data);
      } catch (error) {
        console.error("Error fetching whitelisted users:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWhitelistedUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      // Use Clerk's admin API to delete the user
      const token = await getToken();
      const response = await fetch(
        `${config.backendUrl}/whitelisted-users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the user from the local state
      setWhitelistedUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // // Ensure only admins can access this page
  // if (!user || !user.publicMetadata?.role?.includes("admin")) {
  //   return <div>Access Denied</div>;
  // }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex flex-row justify-between">
        <h1 className="text-3xl font-bold text-left">Manage Admin</h1>
        <button
          className={
            "flex flex-row items-center px-4 py-2 bg-[#FFFFFF] border-[#E7E7E7] rounded-lg border-1 text-[#888888]"
          }
          onClick={() => setModalShow(true)}
        >
          Add New Admin
        </button>
        <AdminSignUp show={modalShow} onHide={() => setModalShow(false)} />
      </div>
      <hr className="border-t-1 border-gray w-full my-2 mt-3" />

      {/* When awaiting the fetch */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <p className="text-lg text-gray-500">Loading tutors...</p>
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
                <td className="px-8 w-[40%]">
                  <h1 className="text-gray-500 text-lg">Name</h1>
                </td>
                <td className="w-[40%]">
                  <h1 className="text-gray-500 text-lg">E-Mail</h1>
                </td>
                <td className="w-[40%]">
                  <h1 className="text-gray-500 text-lg">Delete</h1>
                </td>
              </tr>
            </thead>
            <tbody>
              {whitelistedUsers.map((adminUser) => (
                <tr key={adminUser.id} className="border-b">
                  <td className="py-2 px-8">
                    {adminUser.firstName} {adminUser.lastName}
                  </td>
                  <td className="py-2">
                    {adminUser.emailAddresses[0].emailAddress}
                  </td>
                  <td className="py-2 pl-4">
                    <button
                      onClick={() => handleDeleteUser(adminUser.id)}
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

export default ManageAdmin;
