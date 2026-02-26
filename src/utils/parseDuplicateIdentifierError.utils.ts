interface DuplicateIdentifierError {
  status: number;
  data: {
    errorCode: string;
    message: string;
    existingIdentity: string;
    existingDetails: {
      customerCode: string;
      status: string;
    };
    suggestedActions: string[];
  };
}

function hasDataField(
  error: unknown
): error is { data: Record<string, unknown> } {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as Record<string, unknown>).data === "object"
  );
}

function hasStatusField(error: unknown): error is { status: unknown } {
  return typeof error === "object" && error !== null && "status" in error;
}

export function parseDuplicateIdentifierError(error: unknown) {
  if (!hasStatusField(error) || !hasDataField(error)) {
    return { isDuplicateError: false as const };
  }

  const statusValue = error.status;
  const dataValue = error.data as Record<string, unknown>;

  if (
    statusValue === 409 &&
    typeof dataValue.errorCode === "string" &&
    dataValue.errorCode === "DUPLICATE_IDENTIFIER"
  ) {
    const typed = error as DuplicateIdentifierError;

    return {
      isDuplicateError: true as const,
      errorData: typed.data,
      existingDetails: typed.data.existingDetails,
      existingIdentity: typed.data.existingIdentity,
      suggestedActions: typed.data.suggestedActions,
    };
  }

  return { isDuplicateError: false as const };
}
