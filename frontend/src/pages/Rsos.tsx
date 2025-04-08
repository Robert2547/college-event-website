import React, { useState, useEffect } from "react";
import { Rso, RsoRequest } from "../types/rso";
import { College } from "../types/college";
import { rsoApi } from "../api/rso";
import { collegeApi } from "../api/college";
import Card from "../components/Card";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

const Rsos: React.FC = () => {
  // State for RSOs and loading status
  const [rsos, setRsos] = useState<Rso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State for colleges
  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState<boolean>(false);

  // Modal state
  const [modal, setModal] = useState<{
    show: boolean;
    type: "add" | "edit" | "delete" | "members";
    rso: Rso | null;
    members?: any[];
  }>({
    show: false,
    type: "add",
    rso: null,
  });

  // Form data state
  const [formData, setFormData] = useState<RsoRequest>({
    name: "",
    description: "",
    college: {
      id: 0,
    },
  });

  // Fetch RSOs and colleges on component mount
  useEffect(() => {
    fetchRsos();
    fetchColleges();
  }, []);

  // Fetch RSOs from API
  const fetchRsos = async () => {
    setLoading(true);
    try {
      const data = await rsoApi.getMyRsos();
      // Process the data to ensure all fields are properly formatted
      const processedData = data.map((rso) => ({
        ...rso,
        // Convert any potential object fields to strings to prevent rendering errors
        collegeName: typeof rso.college === "object",
      }));
      setRsos(processedData);
      console.log("Processed RSO data:", processedData);
    } catch (error) {
      console.error("Error fetching RSOs:", error);
      toast.error("Failed to load RSOs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch colleges from API
  const fetchColleges = async () => {
    setLoadingColleges(true);
    try {
      const collegeData = await collegeApi.getAllColleges();
      setColleges(collegeData);

      // If no college is selected and we have colleges, select the first one
      if (!formData.college.id && collegeData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          college: {
            id: collegeData[0].id,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error("Failed to load colleges");
    } finally {
      setLoadingColleges(false);
    }
  };

  // Modal handlers
  const openModal = (
    type: "add" | "edit" | "delete" | "members",
    rso?: Rso
  ) => {
    if (type === "add") {
      // Use the first college ID if available, or keep the current one
      const collegeId =
        colleges.length > 0 ? colleges[0].id : formData.college.id;

      setFormData({
        name: "",
        description: "",
        college: {
          id: collegeId,
        },
      });
    } else if (type === "edit" && rso) {
      setFormData({
        name: rso.name,
        description: rso.description,
        college: {
          id: rso.collegeId,
        },
      });
    } else if (type === "members" && rso) {
      handleViewMembers(rso.id);
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

  // Form input handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle college.id specifically to ensure it's a number
    if (name === "collegeId") {
      setFormData({
        ...formData,
        college: {
          id: parseInt(value),
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // API handlers
  const handleCreateRso = async (): Promise<boolean> => {
    try {
      console.log("Creating RSO with data:", formData);
      const newRso = await rsoApi.createRso(formData);
      setRsos([...rsos, newRso]);
      toast.success("RSO created successfully");
      return true;
    } catch (error) {
      console.error("Error creating RSO:", error);
      toast.error("Failed to create RSO");
      return false;
    }
  };

  const handleUpdateRso = async (): Promise<boolean> => {
    if (!modal.rso) return false;

    try {
      console.log("Updating RSO with data:", formData);
      const updatedRso = await rsoApi.updateRso(modal.rso.id, formData);
      setRsos(rsos.map((rso) => (rso.id === modal.rso?.id ? updatedRso : rso)));
      toast.success("RSO updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating RSO:", error);
      toast.error("Failed to update RSO");
      return false;
    }
  };

  const handleDeleteRso = async (): Promise<boolean> => {
    if (!modal.rso) return false;

    try {
      await rsoApi.deleteRso(modal.rso.id);
      setRsos(rsos.filter((rso) => rso.id !== modal.rso?.id));
      toast.success("RSO deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting RSO:", error);
      toast.error("Failed to delete RSO");
      return false;
    }
  };

  const handleViewMembers = async (rsoId: number) => {
    try {
      const members = await rsoApi.getRsoMembers(rsoId);
      setModal((prev) => ({
        ...prev,
        members: members,
      }));
      return true;
    } catch (error) {
      console.error("Error loading members:", error);
      toast.error("Failed to load members");
      return false;
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    let success = false;

    // Add a validation check to ensure college ID is valid
    if (
      modal.type !== "delete" &&
      !colleges.some((c) => c.id === formData.college.id)
    ) {
      toast.error("Please select a valid college");
      return;
    }

    if (modal.type === "add") {
      success = await handleCreateRso();
    } else if (modal.type === "edit") {
      success = await handleUpdateRso();
    } else if (modal.type === "delete") {
      success = await handleDeleteRso();
    }

    if (success) {
      closeModal();
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
                  {safeRender(rso.college)}
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

  // Helper function to safely render any value (prevents rendering objects directly)
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
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
        <div className="p-4">
          <form className="space-y-4">
            {/* College Selection */}
            <div>
              <label
                htmlFor="collegeId"
                className="block text-sm font-medium text-gray-700"
              >
                College
              </label>
              {loadingColleges ? (
                <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm">
                  Loading colleges...
                </div>
              ) : colleges.length === 0 ? (
                <div className="mt-1 block w-full py-2 px-3 border border-red-300 bg-red-50 rounded-md shadow-sm text-red-500">
                  No colleges available. Please create a college first.
                </div>
              ) : (
                <select
                  name="collegeId"
                  id="collegeId"
                  value={formData.college.id || ""}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a college</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* RSO Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                RSO Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </form>
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
