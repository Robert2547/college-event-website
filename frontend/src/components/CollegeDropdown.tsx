import React from "react";
import { College } from "../types/college";

interface CollegeDropdownProps {
  colleges: College[] | undefined;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  loading?: boolean;
  error?: string;
}

const CollegeDropdown: React.FC<CollegeDropdownProps> = ({
  colleges,
  value,
  onChange,
  loading,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor="collegeId"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        College
      </label>
      {loading ? (
        <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm">
          Loading colleges...
        </div>
      ) : error ? (
        <div className="mt-1 block w-full py-2 px-3 border border-red-300 bg-red-50 rounded-md shadow-sm text-red-500">
          {error}
        </div>
      ) : !colleges || colleges.length === 0 ? (
        <div className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-gray-500">
          No colleges available.
        </div>
      ) : (
        <select
          id="collegeId"
          name="collegeId"
          value={value || ""}
          onChange={(e) => onChange(parseInt(e.target.value))}
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
  );
};

export default CollegeDropdown;
