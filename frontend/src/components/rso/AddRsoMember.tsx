import React, { useState, useEffect } from "react";
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
      (membership) => membership.user && membership.user.id === userId
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
      await rsoApi.addMemberToRso(rsoId, userId);
      toast.success("Member added successfully");
      setEmail("");
      setResults(null);

      // Callback to refresh the members list
      onMemberAdded();
    } catch (err: any) {
      console.error("Error adding member:", err);
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h4 className="text-lg font-medium text-gray-800 mb-3">Add Members</h4>

      <div className="flex space-x-2">
        <div className="flex-grow">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={loading}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Search Results */}
      {results && results.length > 0 && (
        <div className="mt-3 border rounded-md overflow-hidden">
          <div>
            {results.map((user) => {
              const alreadyMember = isAlreadyMember(user.id);

              return (
                <div
                  key={user.id}
                  className="p-3 border-b last:border-b-0 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleAddMember(user.id)}
                    disabled={alreadyMember}
                    className={`px-3 py-1 rounded-md text-sm ${
                      alreadyMember
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
        </div>
      )}

      <div className="mt-3">
        <p className="text-xs text-gray-500">
          <strong>Note:</strong> RSOs require at least 5 members to be active,
          with at least 4 members sharing the same email domain (e.g.,
          @ucf.edu).
        </p>
      </div>
    </div>
  );
};

export default AddRsoMember;
