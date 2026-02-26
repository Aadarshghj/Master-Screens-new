// API Debug Utility
export const logApiPayload = (payload: unknown) => {
  // Check for common issues
  const issues: string[] = [];

  if (typeof payload === "object" && payload !== null) {
    const data = payload as Record<string, unknown>;

    // Check for empty required fields
    Object.entries(data).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        issues.push(`Empty field: ${key}`);
      }
    });

    // Check date formats
    if (data.registrationDate && typeof data.registrationDate === "string") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.registrationDate)) {
        issues.push(`Invalid date format: ${data.registrationDate}`);
      }
    }

    // Check UUID formats
    const uuidFields = [
      "firmTypeIdentity",
      "branchIdentity",
      "canvassedTypeIdentity",
      "industryCategoryIdentity",
      "tenatIdentity",
    ];
    uuidFields.forEach(field => {
      if (data[field] && typeof data[field] === "string") {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(data[field] as string)) {
          issues.push(`Invalid UUID format: ${field} = ${data[field]}`);
        }
      }
    });
  }
};
