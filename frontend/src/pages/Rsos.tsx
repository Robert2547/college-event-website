import React, { useState, useEffect } from "react";
import { useRsos } from "../hooks/useRsos";
import { useAuthStore } from "../hooks/useAuthStore";
import { rsoApi } from "../api/rso";
import Card from "../components/Card";
import Modal from "../components/Modal";
import RsoForm from "../components/rso/RsoForm";
import RsoStatusBadge from "../components/rso/RsoStatusBadge";
import AddRsoMember from "../components/rso/AddRsoMember";
import { validateRsoStatus, getRsoStatus } from "../utils/validateRsoStatus";
import toast from "react-hot-toast";

const Rsos: React.FC = () => {
  // Get current user
  const { user } = useAuthStore();

  const {
    rsos,
    loading,
    colleges,
    loadingColleges,
    modal,
    formData,
    openModal,
    closeModal,
    handleInputChange,
    handleSubmit,
    safeRender,
  } = useRsos();

  // State for refreshing members
  const [refreshing, setRefreshing] = useState(false);

  const handleMemberAdded = async () => {
    if (!modal.rso) return;

    setRefreshing(true);
    try {
      console.log(`Refreshing members for RSO ID ${modal.rso.id}`); // Add log for refresh
      const members = await rsoApi.getRsoMembers(modal.rso.id);
      console.log("Members fetched:", members); // Add log for fetched members
      console.log(`Fetched ${members.length} members for RSO`); // Add log for fetched members count

      // Store the current RSO to use after fetching
      const currentRso = { ...modal.rso };

      // Update modal state directly with the new members
      openModal("members", currentRso); // Pass the fetched members

      toast.success("Member list refreshed");
    } catch (error) {
      console.error("Error refreshing members:", error);
      toast.error("Failed to refresh member list");
    } finally {
      setRefreshing(false);
    }
  };
  // Render the RSO table or loading/empty states
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">Loading RSOs...</p>
        </div>
      );
    }

    if (rsos.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">
            No RSOs found. Create your first RSO using the button below!
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                College
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rsos.map((rso) => {
              // Get the stored status from localStorage
              const storedStatus = getRsoStatus(rso.id);

              return (
                <tr key={rso.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {safeRender(rso.name)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {safeRender(rso.description)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {typeof rso.college === "object" && rso.college?.name
                      ? rso.college.name
                      : safeRender(rso.college)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {safeRender(rso.memberCount)} members
                    <div>
                      <button
                        onClick={() => openModal("members", rso)}
                        className="text-xs text-indigo-600 hover:text-indigo-900"
                      >
                        View & Add Members
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {/* Show status based on localStorage */}
                    {modal.members && modal.rso?.id === rso.id ? (
                      <RsoStatusBadge members={modal.members} rsoId={rso.id} />
                    ) : (
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          storedStatus === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {storedStatus}
                      </span>
                    )}
                    {storedStatus !== "ACTIVE" && (
                      <div className="mt-1 text-xs text-yellow-600">
                        View members to see activation requirements
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => openModal("edit", rso)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openModal("delete", rso)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // If no colleges are available, show a warning
  const collegesAvailable = colleges && colleges.length > 0;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Registered Student Organizations
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your organization settings and view member information.
        </p>

        {/* RSO Management Card */}
        <div className="mt-6">
          <Card
            title="Your Registered Student Organizations"
            footer={
              <div className="flex justify-end">
                <button
                  onClick={() => openModal("add")}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    collegesAvailable
                      ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!collegesAvailable}
                >
                  Create New RSO
                </button>
              </div>
            }
          >
            {!collegesAvailable && !loading && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      No colleges are available. You need at least one college
                      to create an RSO.
                      {user?.role === "SUPER_ADMIN" && (
                        <span>
                          {" "}
                          Please go to the College Management section to create
                          a college first.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {renderContent()}
          </Card>
        </div>
      </div>

      {/* Add/Edit RSO Modal */}
      <Modal
        isOpen={modal.show && (modal.type === "add" || modal.type === "edit")}
        title={modal.type === "add" ? "Create New RSO" : "Edit RSO"}
        onClose={closeModal}
        onConfirm={handleSubmit}
        confirmText={modal.type === "add" ? "Create RSO" : "Update RSO"}
      >
        <RsoForm
          formData={formData}
          colleges={colleges}
          loadingColleges={loadingColleges}
          onChange={handleInputChange}
        />
      </Modal>

      {/* Delete RSO Confirmation Modal */}
      <Modal
        isOpen={modal.show && modal.type === "delete"}
        title="Delete RSO"
        onClose={closeModal}
        onConfirm={handleSubmit}
        confirmText="Delete RSO"
      >
        <div className="p-4 bg-red-50">
          <p className="text-sm text-red-600">
            Are you sure you want to delete {safeRender(modal.rso?.name)}? This
            action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Members Modal */}
      <Modal
        isOpen={modal.show && modal.type === "members"}
        title={`${modal.rso?.name || ""} Members`}
        onClose={closeModal}
        onConfirm={closeModal}
        confirmText="Close"
      >
        <div className="p-4">
          {refreshing ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Refreshing members...</p>
            </div>
          ) : !modal.members ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading members...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Information */}
              <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    RSO Status
                  </h3>

                  {/* Status Badge */}
                  {modal.rso && (
                    <RsoStatusBadge
                      members={modal.members}
                      rsoId={modal.rso.id}
                    />
                  )}
                </div>

                {/* Requirements Info */}
                <div className="mt-2 text-xs text-gray-500">
                  <p>To activate an RSO, you need:</p>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    <li>At least 5 total members</li>
                    <li>
                      At least 4 members with the same email domain (e.g.,
                      @ucf.edu)
                    </li>
                  </ul>
                </div>

                {/* Domain Statistics */}
                {modal.members.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600">
                    <p className="font-medium">Current Email Domains:</p>
                    <ul className="list-disc list-inside pl-2 mt-1">
                      {(() => {
                        // Get domain counts
                        const domainCounts: Record<string, number> = {};
                        modal.members.forEach((member) => {
                          if (!member.email) return;
                          const parts = member.email.split("@");
                          if (parts.length !== 2) return;
                          const domain = parts[1].toLowerCase();
                          domainCounts[domain] =
                            (domainCounts[domain] || 0) + 1;
                        });

                        // Return list items
                        return Object.entries(domainCounts).map(
                          ([domain, count]) => (
                            <li key={domain}>
                              @{domain}: {count} member{count !== 1 ? "s" : ""}
                            </li>
                          )
                        );
                      })()}
                    </ul>
                  </div>
                )}
              </div>

              {/* Current Members List */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Current Members ({modal.members.length})
                </h3>

                {modal.members.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No members in this RSO yet.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {modal.members.map((member) => (
                          <tr key={member.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {member.user?.firstName} {member.user?.lastName}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {member.user?.email}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {member.id === user?.id ||
                              member.user?.id === user?.id ? (
                                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                  Admin
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                  Member
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Add Member Component */}
              {modal.rso && (
                <AddRsoMember
                  rsoId={modal.rso.id}
                  currentMembers={modal.members}
                  onMemberAdded={handleMemberAdded}
                />
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Rsos;
