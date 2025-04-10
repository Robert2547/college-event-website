import { useState, useEffect } from "react";
import { Rso, RsoRequest } from "../types/rso";
import { College } from "../types/college";
import { rsoApi } from "../api/rso";
import { collegeApi } from "../api/college";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore"; // Import useAuthStore

// A single hook to handle all RSO-related state and operations
export const useRsos = () => {
  // Get current user from auth store
  const { user } = useAuthStore();

  // RSO state
  const [rsos, setRsos] = useState<Rso[]>([]);
  const [loading, setLoading] = useState(true);

  // Colleges state
  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    show: false,
    type: "add" as "add" | "edit" | "delete" | "members",
    rso: null as Rso | null,
    members: [] as any[],
  });

  // Form data state
  const [formData, setFormData] = useState<RsoRequest>({
    name: "",
    description: "",
    college: { id: 0 },
  });

  // Load data on component mount
  useEffect(() => {
    fetchRsos();
    fetchColleges();
  }, []);

  // Fetch RSOs from API
  const fetchRsos = async () => {
    setLoading(true);
    try {
      const data = await rsoApi.getMyRsos();
      setRsos(data);
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

      // Select first college by default if available
      if (!formData.college.id && collegeData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          college: { id: collegeData[0].id },
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
  const openModal = async (
    type: "add" | "edit" | "delete" | "members",
    rso?: Rso,
    membersList?: any[]
  ) => {
    if (type === "add") {
      setFormData({
        name: "",
        description: "",
        college: {
          id: colleges.length > 0 ? colleges[0].id : 0,
        },
      });
    } else if (type === "edit" && rso) {
      setFormData({
        name: rso.name,
        description: rso.description,
        college: {
          id: typeof rso.college === "object" ? rso.college?.id : rso.collegeId,
        },
      });
    }

    // For members view, if members are provided directly use them, otherwise fetch them
    if (type === "members" && rso) {
      if (membersList) {
        // Use the provided members list
        setModal({
          show: true,
          type,
          rso,
          members: membersList,
        });
      } else {
        // Fetch members
        try {
          const members = await rsoApi.getRsoMembers(rso.id);
          console.log(`Fetched ${members.length} members for RSO ID ${rso.id}`);
          console.log("Members: ", members);

          setModal({
            show: true,
            type,
            rso,
            members,
          });
        } catch (error) {
          console.error("Error fetching RSO members:", error);
          setModal({
            show: true,
            type,
            rso: rso ?? null,
            members: [],
          });
        }
      }
    } else {
      // For other types, just set the modal state
      setModal({
        show: true,
        type,
        rso: rso ?? null,
        members: [],
      });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  // Form input handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "collegeId") {
      setFormData({
        ...formData,
        college: { id: parseInt(value) },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // RSO operations
  const handleCreateRso = async () => {
    try {
      // Make sure we have the current user's college if not specified in form
      if (!formData.college.id && user?.college?.id) {
        formData.college.id = user.college.id;
      }

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

  const handleUpdateRso = async () => {
    if (!modal.rso) return false;

    try {
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

  const handleDeleteRso = async () => {
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
      setModal((prev) => ({ ...prev, members }));
      return true;
    } catch (error) {
      console.error("Error loading members:", error);
      toast.error("Failed to load members");
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validate college selection
    if (
      modal.type !== "delete" &&
      !colleges.some((c) => c.id === formData.college.id)
    ) {
      toast.error("Please select a valid college");
      return;
    }

    let success = false;

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

  // Helper function to safely render any value
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return {
    rsos,
    loading,
    colleges,
    loadingColleges,
    modal,
    formData,
    setModal,

    openModal,
    closeModal,
    handleInputChange,
    handleSubmit,
    safeRender,
    handleViewMembers,
  };
};
