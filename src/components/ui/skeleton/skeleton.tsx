import React from "react";
import { cn } from "@/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
};

interface SkeletonFormFieldProps {
  label?: string;
  className?: string;
  showLabel?: boolean;
}

const SkeletonFormField: React.FC<SkeletonFormFieldProps> = ({
  label,
  className,
  showLabel = true,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && label && <Skeleton className="h-4 w-20" />}
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

interface SkeletonFormRowProps {
  children: React.ReactNode;
  className?: string;
}

const SkeletonFormRow: React.FC<SkeletonFormRowProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
};

interface SkeletonSelectProps {
  label?: string;
  className?: string;
  showLabel?: boolean;
}

const SkeletonSelect: React.FC<SkeletonSelectProps> = ({
  label,
  className,
  showLabel = true,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && label && <Skeleton className="h-4 w-20" />}
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
};

interface SkeletonButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-8 w-16",
    md: "h-10 w-20",
    lg: "h-12 w-24",
  };

  return (
    <Skeleton className={cn("rounded-md", sizeClasses[size], className)} />
  );
};

interface SkeletonFormProps {
  fields?: number;
  showTitle?: boolean;
  title?: string;
  className?: string;
}

const SkeletonForm: React.FC<SkeletonFormProps> = ({
  fields = 4,
  showTitle = true,
  title = "Loading...",
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {showTitle && <Skeleton className="h-6 w-40" title={title} />}
      <SkeletonFormRow>
        {Array.from({ length: fields }).map((_, index) => (
          <SkeletonFormField key={index} />
        ))}
      </SkeletonFormRow>
    </div>
  );
};

interface SkeletonLoadingStateProps {
  message?: string;
  className?: string;
}

const SkeletonLoadingState: React.FC<SkeletonLoadingStateProps> = ({
  message = "Loading...",
  className,
}) => {
  return (
    <div
      className={cn(
        "mb-4 rounded-md border border-blue-200 bg-blue-50 p-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        <span className="text-sm text-blue-700">{message}</span>
      </div>
    </div>
  );
};

export {
  Skeleton,
  SkeletonFormField,
  SkeletonFormRow,
  SkeletonSelect,
  SkeletonButton,
  SkeletonForm,
  SkeletonLoadingState,
};
