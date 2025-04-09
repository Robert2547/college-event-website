/**
 * Validates if an RSO meets the minimum requirements to be active:
 * - At least 5 total members
 * - At least 4 members with the same email domain
 */
export function validateRsoStatus(
  members: any[],
  rsoId: number
): {
  isValid: boolean;
  totalMembers: number;
  sameDomainCount: number;
  neededMembers: number;
  neededSameDomain: number;
} {
  // Check total members
  const totalMembers = members.length;
  const REQUIRED_MEMBERS = 5;
  const REQUIRED_SAME_DOMAIN = 4;

  // Count members by domain
  const domainCounts: Record<string, number> = {};

  members.forEach((member) => {
    if (!member.email) return;

    const emailParts = member.email.split("@");
    if (emailParts.length !== 2) return;

    const domain = emailParts[1].toLowerCase();
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
  });

  // Find the domain with the most members
  let maxDomainCount = 0;
  Object.values(domainCounts).forEach((count) => {
    if (count > maxDomainCount) {
      maxDomainCount = count;
    }
  });

  const neededMembers = Math.max(0, REQUIRED_MEMBERS - totalMembers);
  const neededSameDomain = Math.max(0, REQUIRED_SAME_DOMAIN - maxDomainCount);

  // Check if requirements are met
  const isValid =
    totalMembers >= REQUIRED_MEMBERS && maxDomainCount >= REQUIRED_SAME_DOMAIN;

  // Store the result in localStorage if rsoId is provided
  if (rsoId) {
    const rsoStatuses = getRsoStatuses();
    rsoStatuses[rsoId] = isValid ? "ACTIVE" : "INACTIVE";
    localStorage.setItem("rsoStatuses", JSON.stringify(rsoStatuses));
  }

  return {
    isValid,
    totalMembers,
    sameDomainCount: maxDomainCount,
    neededMembers,
    neededSameDomain,
  };
}

/// Get the status of an RSO from localStorage
export function getRsoStatus(rsoId: number): string {
  const rsoStatuses = getRsoStatuses();
  return rsoStatuses[rsoId] || "INACTIVE"; // Default to INACTIVE if not found
}

/// Get all RSO statuses from localStorage
export function getRsoStatuses(): Record<number, string> {
  try {
    const stored = localStorage.getItem("rsoStatuses");
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("Error parsing RSO statuses from localStorage", e);
    return {};
  }
}

/// Set the RSO status in localStorage
export function setRsoStatus(rsoId: number, status: string): void {
  const rsoStatuses = getRsoStatuses();
  rsoStatuses[rsoId] = status;
  localStorage.setItem("rsoStatuses", JSON.stringify(rsoStatuses));
}
