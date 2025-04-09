import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { College } from "../types/college";
import { Rso } from "../types/rso";
import { collegeApi } from "../api/college";
import { rsoApi } from "../api/rso";

export const useColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const collegeData = await collegeApi.getAllColleges();
        setColleges(collegeData);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        toast.error("Failed to load colleges");
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  return { colleges, loading };
};

export const useRsos = (shouldFetch = false) => {
  const [rsos, setRsos] = useState<Rso[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRsos = async () => {
      if (!shouldFetch) return;

      setLoading(true);
      try {
        const rsoData = await rsoApi.getMyRsos();
        setRsos(rsoData);
      } catch (error) {
        console.error("Error fetching RSOs:", error);
        toast.error("Failed to load RSOs");
      } finally {
        setLoading(false);
      }
    };

    fetchRsos();
  }, [shouldFetch]);

  return { rsos, loading };
};
