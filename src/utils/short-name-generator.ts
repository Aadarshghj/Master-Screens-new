export const getShortName = (fullName: string): string => {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
};
