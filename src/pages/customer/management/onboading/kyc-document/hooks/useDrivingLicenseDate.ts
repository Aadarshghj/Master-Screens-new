import type { AllClassOfVehicle } from "@/types";
import { format } from "date-fns";

type DateField = "issueDate" | "expiryDate";

export const getLatestDrivingLicenseDate = (
  allClassOfVehicle: AllClassOfVehicle[] | undefined,
  dateField: DateField
): Date | string | null => {
  if (!allClassOfVehicle || allClassOfVehicle.length === 0) return null;

  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const dates = allClassOfVehicle
    .map(item => item.nonTransport?.[dateField])
    .filter(date => date && date !== "")
    .map(parseDateString)
    .filter((date): date is Date => date !== null);

  if (dates.length === 0) return null;
  const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Return in yyyy-MM-dd format
  return format(latestDate, "yyyy-MM-dd");
};
