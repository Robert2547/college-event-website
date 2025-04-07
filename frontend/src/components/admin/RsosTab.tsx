import React, { useState } from "react";
import Card from "../Card";
import Modal from "../Modal";
import RsoForm from "./RsoForm";
import { Rso, RsoRequest } from "../../types/rso";
import { rsoApi } from "../../api/rso";
import toast from "react-hot-toast";

interface RsosTabProps {
  rsos: Rso[];
  loading: boolean;
  userId: number;
  onCreateRso: (formData: RsoRequest) => Promise<boolean>;
  onUpdateRso: (id: number, formData: RsoRequest) => Promise<boolean>;
  onDeleteRso: (id: number) => Promise<boolean>;
}

const RsosTab: React.FC<RsosTabProps> = ({
  rsos,
  loading,
  userId,
  onCreateRso,
  onUpdateRso,
  onDeleteRso,
}) => {
  // Modal state
  const [modal, setModal] = useState<{
    show: boolean;
    type: "add" | "edit" | "delete";
    rso: Rso | null;
  }>({
    show: false,
    type: "add",
    rso: null,
  });

  const [formData, setFormData] = useState<RsoRequest>({
    name: "",
    description: "",
    collegeId: userId,
  });

  // Modal handlers
  const openModal = (type: "add" | "edit" | "delete", rso?: Rso) => {
    if (type === "add") {
      setFormData({
        name: "",
        description: "",
        collegeId: userId,
      });
    } else if (type === "edit" && rso) {
      setFormData({
        name: rso.name,
        description: rso.description,
        collegeId: rso.collegeId,
      });
    }

    setModal({
      show: true,
      type,
      rso: rso || null,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  // Form handlers
  const handleSubmit = async () => {
    let success = false;

    if (modal.type === "add") {
      success = await onCreateRso(formData);
    } else if (modal.type === "edit" && modal.rso) {
      success = await onUpdateRso(modal.rso.id, formData);
    } else if (modal.type === "delete" && modal.rso) {
      success = await onDeleteRso(modal.rso.id);
    }

    if (success) {
      closeModal();
    }
  };

  const handleViewMembers = async (rsoId: number) => {
    try {
      const members = await rsoApi.getRsoMembers(rsoId);
      toast.success(`Loaded ${members.length} members`);
      // Here you could display members in a modal
      console.log("RSO members:", members);
    } catch (error) {
      toast.error("Failed to load members");
    }
  };

  // Content Rendering
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
                    {rso.name}
                  </div>
                  <div className="text-sm text-gray-500">{rso.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {rso.memberCount} members
                  <div>
                    <button
                      onClick={() => handleViewMembers(rso.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      View Members
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      rso.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {rso.status}
                  </span>
                  {rso.memberCount < 5 && (
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
    <div className="mt-6">
      <Card
        title="Your Registered Student Organizations"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => openModal("add")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New RSO
            </button>
          </div>
        }
      >
        {renderContent()}
      </Card>

      {/* Add/Edit RSO Modal */}
      <Modal
        isOpen={modal.show && (modal.type === "add" || modal.type === "edit")}
        title={modal.type === "add" ? "Create New RSO" : "Edit RSO"}
        onClose={closeModal}
        onConfirm={handleSubmit}
        confirmText={modal.type === "add" ? "Create RSO" : "Update RSO"}
      >
        <div className="p-4">
          <RsoForm initialData={formData} onSubmit={setFormData} />
        </div>
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
            Are you sure you want to delete {modal.rso?.name}? This action
            cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default RsosTab;
