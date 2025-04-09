import React, { useState } from "react";
import { userApi } from "../../api/user";
import { rsoApi } from "../../api/rso";
import { User } from "../../types/user";
import toast from "react-hot-toast";

interface AddRsoMemberProps {
  rsoId: number;
  onMemberAdded: () => void;
  currentMembers: any[];
}

const AddRsoMember: React.FC<AddRsoMemberProps> = ({
  rsoId,
  onMemberAdded,
  currentMembers,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<User[] | null>(null);
  const [error, setError] = useState("");

  // Check if user is already a member
  const isAlreadyMember = (userId: number): boolean => {
    return currentMembers.some(
      (member) =>
        member.id === userId || (member.user && member.user.id === userId)
    );
  };

  // Handle email search
  const handleSearch = async () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const searchResults = await userApi.searchByEmail(email);
      console.log("Search results:", searchResults); // Add log for search results
      setResults(searchResults);

      if (searchResults.length === 0) {
        setError("No users found with that email");
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setError("User not found or unable to search at this time");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding member to RSO
  const handleAddMember = async (userId: number) => {
    // Check if already a member
    if (isAlreadyMember(userId)) {
      toast.error("This user is already a member of this RSO");
      return;
    }

    setLoading(true);
    try {
      console.log(`Adding user ID ${userId} to RSO ID ${rsoId}`); // Add log for adding member
      await rsoApi.addMemberToRso(rsoId, userId);
      toast.success("Member added successfully");
      setEmail("");
      setResults(null);

      // Call onMemberAdded callback to refresh the members list
      onMemberAdded();
    } catch (err: any) {
      console.error("Error adding member:", err);
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Add New Members
      </h3>
      <div className="flex items-end space-x-2">
        <div className="flex-grow">
          <label
            htmlFor="email-search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search by Email
          </label>
          <input
            id="email-search"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email address"
            className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {loading ? "Searching..." : "Search User"}
        </button>
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-500 text-sm rounded-md">
          {error}
        </div>
      )}

      {/* Search Results */}
      {results !== null && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Search Results
          </h4>

          {results.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
              No users found matching that email.
            </div>
          ) : (
            <div className="bg-white border rounded-md overflow-hidden">
              {results.map((user) => {
                const alreadyMember = isAlreadyMember(user.id);

                return (
                  <div
                    key={user.id}
                    className="p-4 border-b last:border-b-0 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleAddMember(user.id)}
                      disabled={alreadyMember || loading}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        alreadyMember
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : loading
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {alreadyMember ? "Already Member" : "Add to RSO"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddRsoMember;
