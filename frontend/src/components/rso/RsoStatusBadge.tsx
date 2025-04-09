import React, { useEffect, useState } from "react";
import { validateRsoStatus, getRsoStatus } from "../../utils/validateRsoStatus";

interface RsoStatusBadgeProps {
  members: any[];
  rsoId: number;
}

const RsoStatusBadge: React.FC<RsoStatusBadgeProps> = ({ members, rsoId }) => {
  const [status, setStatus] = useState<string>(getRsoStatus(rsoId));

  // Run validation and update status when members change
  useEffect(() => {
    if (members && members.length > 0) {
      const validation = validateRsoStatus(members, rsoId);
      setStatus(validation.isValid ? "ACTIVE" : "INACTIVE");
    }
  }, [members, rsoId]);

  // Get validation details for display
  const validation = validateRsoStatus(members, rsoId);
  const isActive = validation.isValid;

  return (
    <div>
      {/* Status Badge */}
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          isActive
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {status}
      </span>

      {/* Requirements Message */}
      {!isActive && (
        <div className="mt-1 text-xs text-yellow-600">
          {validation.neededMembers > 0 && (
            <div>
              Needs {validation.neededMembers} more member(s) to activate
            </div>
          )}
          {validation.neededSameDomain > 0 && (
            <div>
              Needs {validation.neededSameDomain} more member(s) with same email
              domain
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RsoStatusBadge;
