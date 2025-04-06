import React, { useState, useEffect, FormEvent } from "react";
import { collegeApi } from "../api/college";
import { College, CollegeRequest } from "../types/college";
import toast from "react-hot-toast";
import Card from "../components/Card";
import Modal from "../components/Modal";
import CollegeForm from "../components/CollegeForm";

enum ModalType {
  NONE,
  ADD,
  EDIT,
  DELETE,
}

const SuperAdminDashboard = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [formData, setFormData] = useState<CollegeRequest>({
    name: "",
    location: "",
    description: "",
  });

  // Fetch colleges on component mount
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const data = await collegeApi.getAllColleges();
      setColleges(data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      description: "",
    });
    setSelectedCollege(null);
    setModalType(ModalType.NONE);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalType(ModalType.ADD);
  };

  const handleOpenEditModal = (college: College) => {
    setSelectedCollege(college);
    setFormData({
      name: college.name,
      location: college.location,
      description: college.description,
    });
    setModalType(ModalType.EDIT);
  };

  const handleOpenDeleteModal = (college: College) => {
    setSelectedCollege(college);
    setModalType(ModalType.DELETE);
  };

  const handleCloseModal = () => {
    resetForm();
  };

  const handleFormSubmit = (data: CollegeRequest) => {
    setFormData(data);

    if (modalType === ModalType.ADD) {
      handleAddCollege();
    } else if (modalType === ModalType.EDIT && selectedCollege) {
      handleUpdateCollege();
    }
  };

  const handleAddCollege = async () => {
    try {
      const newCollege = await collegeApi.createCollege(formData);
      setColleges([...colleges, newCollege]);
      resetForm();
      toast.success("College added successfully");
    } catch (error) {
      console.error("Error adding college:", error);
      toast.error("Failed to add college");
    }
  };

  const handleUpdateCollege = async () => {
    if (!selectedCollege) return;

    try {
      const updatedCollege = await collegeApi.updateCollege(
        selectedCollege.id,
        formData
      );
      setColleges(
        colleges.map((college) =>
          college.id === updatedCollege.id ? updatedCollege : college
        )
      );
      resetForm();
      toast.success("College updated successfully");
    } catch (error) {
      console.error("Error updating college:", error);
      toast.error("Failed to update college");
    }
  };

  const handleDeleteCollege = async () => {
    if (!selectedCollege) return;

    try {
      await collegeApi.deleteCollege(selectedCollege.id);
      setColleges(
        colleges.filter((college) => college.id !== selectedCollege.id)
      );
      resetForm();
      toast.success("College deleted successfully");
    } catch (error) {
      console.error("Error deleting college:", error);
      toast.error("Failed to delete college");
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Super Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your colleges and system settings from here.
        </p>

        {/* Super Admin Actions */}
        <div className="mt-6">
          <Card title="Super Admin Actions">
            <div className="divide-y divide-gray-200">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      System Configuration
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage system-wide settings
                    </p>
                  </div>
                </div>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Configure
                </button>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Admin Management
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage administrator accounts
                    </p>
                  </div>
                </div>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Manage Admins
                </button>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Academic Year Setup
                    </h3>
                    <p className="text-sm text-gray-500">
                      Configure academic years and terms
                    </p>
                  </div>
                </div>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Setup
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* College List */}
        <div className="mt-6">
          <Card
            title="Colleges"
            footer={
              <div className="flex justify-end">
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add College
                </button>
              </div>
            }
          >
            <div className="overflow-hidden rounded-md border border-gray-200">
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : colleges.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No colleges found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Created By
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {colleges.map((college) => (
                        <tr key={college.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {college.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {college.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {college.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {college.createdBy}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleOpenEditModal(college)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(college)}
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
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add College Modal */}
      <Modal
        isOpen={modalType === ModalType.ADD}
        title="Add New College"
        onClose={handleCloseModal}
        onConfirm={() => handleFormSubmit(formData)}
        confirmText="Add College"
      >
        <CollegeForm initialData={formData} onSubmit={handleFormSubmit} />
      </Modal>

      {/* Edit College Modal */}
      <Modal
        isOpen={modalType === ModalType.EDIT}
        title="Edit College"
        onClose={handleCloseModal}
        onConfirm={() => handleFormSubmit(formData)}
        confirmText="Update College"
      >
        <CollegeForm initialData={formData} onSubmit={handleFormSubmit} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalType === ModalType.DELETE}
        title="Confirm Delete"
        onClose={handleCloseModal}
        onConfirm={handleDeleteCollege}
        confirmText="Delete College"
      >
        <div className="p-4 bg-red-50 rounded-md">
          <p className="text-sm text-red-600">
            Are you sure you want to delete college "{selectedCollege?.name}"?
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default SuperAdminDashboard;
