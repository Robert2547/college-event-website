import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { RsoRequest } from "../../types/rso";
import { College } from "../../types/college";
import { collegeApi } from "../../api/college";
import toast from "react-hot-toast";

interface RsoFormProps {
  initialData: RsoRequest;
  onSubmit: (data: RsoRequest) => void;
  colleges?: College[];
  loadingColleges?: boolean;
}

const RsoForm: React.FC<RsoFormProps> = ({
  initialData,
  onSubmit,
  colleges: propColleges,
  loadingColleges: propLoadingColleges,
}) => {
  const [formData, setFormData] = useState<RsoRequest>(initialData);
  const [colleges, setColleges] = useState<College[]>(propColleges || []);
  const [loading, setLoading] = useState(propLoadingColleges || false);

  // Update formData when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Fetch colleges when component mounts if not provided via props
  useEffect(() => {
    if (!propColleges) {
      fetchColleges();
    }
  }, [propColleges]);

  // Update local state when props change
  useEffect(() => {
    if (propColleges) {
      setColleges(propColleges);
    }
  }, [propColleges]);

  useEffect(() => {
    if (typeof propLoadingColleges !== "undefined") {
      setLoading(propLoadingColleges);
    }
  }, [propLoadingColleges]);

  const fetchColleges = async () => {
    setLoading(true);
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

        // Important: Notify parent component of the update
        onSubmit({
          ...formData,
          college: {
            id: collegeData[0].id,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Create updated form data based on the input field
    let updatedFormData: RsoRequest;

    // Handle college.id specifically to ensure it's a number
    if (name === "collegeId") {
      updatedFormData = {
        ...formData,
        college: {
          id: parseInt(value),
        },
      };
    } else {
      updatedFormData = {
        ...formData,
        [name]: value,
      };
    }

    // Update local state
    setFormData(updatedFormData);

    // Important: Immediately notify parent component of changes
    onSubmit(updatedFormData);

  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* College Selection */}
        <div>
          <label
            htmlFor="collegeId"
            className="block text-sm font-medium text-gray-700"
          >
            College
          </label>
          {loading ? (
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

        {/* Submit button is hidden - handled by the Modal component */}
        <div className="hidden">
          <button type="submit" />
        </div>
      </div>
    </form>
  );
};

export default RsoForm;
