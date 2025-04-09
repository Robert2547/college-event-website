import React, { useEffect, useState } from "react";
import {
  validateRsoStatus,
  getRsoStatus,
  setRsoStatus,
} from "../../utils/validateRsoStatus";

interface RsoStatusBadgeProps {
  members: any[];
  rsoId: number;
}

const RsoStatusBadge: React.FC<RsoStatusBadgeProps> = ({ members, rsoId }) => {
  const [status, setStatus] = useState<string>(getRsoStatus(rsoId));
  const [validation, setValidation] = useState(
    validateRsoStatus(members, rsoId)
  );

  useEffect(() => {
    if (members && Array.isArray(members)) {
      const newValidation = validateRsoStatus(members, rsoId);
      setValidation(newValidation);
      setStatus(newValidation.isValid ? "ACTIVE" : "INACTIVE");

      setRsoStatus(rsoId, newValidation.isValid ? "ACTIVE" : "INACTIVE");
    }
  }, [members, rsoId]);

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
