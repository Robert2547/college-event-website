import React from "react";
import { RsoRequest } from "../../types/rso";
import { College } from "../../types/college";

interface RsoFormProps {
  formData: RsoRequest;
  colleges: College[];
  loadingColleges: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const RsoForm: React.FC<RsoFormProps> = ({
  formData,
  colleges,
  loadingColleges,
  onChange,
}) => {
  return (
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
              onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default RsoForm;
