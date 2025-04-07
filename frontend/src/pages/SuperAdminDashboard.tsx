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
    console.log("Form submitted with data:", data);

    // Directly pass the data to the respective handler
    if (modalType === ModalType.ADD) {
      handleAddCollege(data);
    } else if (modalType === ModalType.EDIT && selectedCollege) {
      handleUpdateCollege(data);
    }
  };

  const handleAddCollege = async (data: CollegeRequest) => {
    try {
      console.log("Adding college with data:", data);
      const newCollege = await collegeApi.createCollege(data);
      setColleges([...colleges, newCollege]);
      resetForm();
      toast.success("College added successfully");
    } catch (error) {
      console.error("Error adding college:", error);
      toast.error("Failed to add college");
    }
  };

  const handleUpdateCollege = async (data: CollegeRequest) => {
    if (!selectedCollege) return;

    try {
      const updatedCollege = await collegeApi.updateCollege(
        selectedCollege.id,
        data
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
