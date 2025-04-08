import React from "react";
import { useRsos } from "../hooks/useRsos";
import Card from "../components/Card";
import Modal from "../components/Modal";
import RsoForm from "../components/rso/RsoForm";

const Rsos: React.FC = () => {
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
          <p className="text-gray-500">No RSOs found. Create your first RSO!</p>
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
            {rsos.map((rso) => (
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
                      View Members
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      safeRender(rso.status) === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {safeRender(rso.status)}
                  </span>
                  {typeof rso.memberCount === "number" &&
                    rso.memberCount < 5 && (
                      <div className="mt-1 text-xs text-yellow-600">
                        Needs {5 - rso.memberCount} more members to activate
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
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={colleges.length === 0}
                >
                  Create New RSO
                </button>
              </div>
            }
          >
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
        title={`${modal.rso?.name} Members`}
        onClose={closeModal}
        onConfirm={closeModal}
        confirmText="Close"
      >
        <div className="p-4">
          {!modal.members ? (
            <div className="text-center py-2">
              <p className="text-gray-500">Loading members...</p>
            </div>
          ) : modal.members.length === 0 ? (
            <div className="text-center py-2">
              <p className="text-gray-500">No members found for this RSO.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modal.members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {member.email}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Rsos;
