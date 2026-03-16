/**
 * Calculates a player's age and age category from their date of birth.
 * Age is computed dynamically — never stored in the DB.
 */
export function calculateAgeInfo(dob: Date | string): {
  age: number;
  category: string;
} {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  let category: string;
  if (age <= 5) category = "U6";
  else if (age <= 7) category = "U8";
  else if (age <= 9) category = "U10";
  else if (age <= 11) category = "U12";
  else if (age <= 13) category = "U14";
  else if (age <= 15) category = "U16";
  else if (age <= 17) category = "U18";
  else category = "Senior";

  return { age, category };
}

/**
 * Calculates profile completeness percentage based on filled optional fields.
 */
export function calculateCompleteness(profile: {
  avatarUrl?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  height?: number | null;
  weight?: number | null;
  primaryPosition?: string | null;
  secondaryPosition?: string | null;
  dominantFoot?: string | null;
  currentClub?: string | null;
  yearsOfExperience?: number | null;
  hasPassport?: boolean | null;
}): number {
  const fields = [
    profile.avatarUrl,
    profile.city,
    profile.state,
    profile.country,
    profile.height,
    profile.weight,
    profile.primaryPosition,
    profile.secondaryPosition,
    profile.dominantFoot,
    profile.currentClub,
    profile.yearsOfExperience,
    profile.hasPassport,
  ];

  const filled = fields.filter(
    (f) => f !== null && f !== undefined && f !== ""
  ).length;
  return Math.round((filled / fields.length) * 100);
}

/**
 * Formats a float number to a fixed decimal string, or returns "—" if null.
 */
export function formatStat(value: number | null | undefined, unit = ""): string {
  if (value === null || value === undefined) return "—";
  return `${value}${unit}`;
}
