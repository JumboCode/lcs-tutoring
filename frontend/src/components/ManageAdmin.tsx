import React, { useState, useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
import { Trash2 } from "lucide-react";

interface WhitelistedUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: {
    emailAddress: string;
  }[];
}
const API_URL = "http://localhost:3000";

const ManageAdmin: React.FC = () => {
  const [whitelistedUsers, setWhitelistedUsers] = useState<WhitelistedUser[]>(
    []
  );
  // const { user } = useUser();

  useEffect(() => {
    const fetchWhitelistedUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/whitelisted-users`);
        const data = await response.json();
        setWhitelistedUsers(data);
      } catch (error) {
        console.error("Error fetching whitelisted users:", error);
      }
    };

    fetchWhitelistedUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      // Use Clerk's admin API to delete the user
      const response = await fetch(`${API_URL}/whitelisted-users/${userId}`, {
        method: "DELETE",
      });
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Admin</h1>
      <hr className="mb-6" />

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">E-Mail</th>
            <th className="py-2 px-4">Delete</th>
          </tr>
        </thead>
        <tbody>
          {whitelistedUsers.map((adminUser) => (
            <tr key={adminUser.id} className="border-b">
              <td className="py-2 px-4">
                {adminUser.firstName} {adminUser.lastName}
              </td>
              <td className="py-2 px-4">
                {adminUser.emailAddresses[0].emailAddress}
              </td>
              <td className="py-2 px-4">
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
  );
};

export default ManageAdmin;
