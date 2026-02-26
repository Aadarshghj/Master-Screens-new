import type { ConfigOption } from "@/types";

export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatTime = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const getUserName = (
  userIdentity: string,
  userOptions: ConfigOption[]
): string => {
  const user = userOptions.find(u => u.value === userIdentity);
  return user?.label || userIdentity;
};
