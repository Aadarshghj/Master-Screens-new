import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { Button } from "../ui";
import { RefreshCw } from "lucide-react";

const FallbackComponent = ({
  error,
}: {
  error: { message: string; stack: string; name: string };
}) => {
  const { resetBoundary } = useErrorBoundary();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <p className="text-charcoal-black mt-2 text-[1.1rem]">
          Oops! Something went wrong.
        </p>
        <p className="text-steel-gray mt-1">
          {error?.message || "Unknown error"}
        </p>
        <div>
          <Button
            className="bg-reset-button hover:bg-reset-button/80 text-white"
            onClick={resetBoundary}
          >
            <RefreshCw className="h-4 w-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundaryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};
