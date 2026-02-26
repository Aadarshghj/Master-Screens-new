import React from "react";
import { cn } from "@/utils";
import type { FieldError } from "react-hook-form";
import { Label } from "../label";

interface FormErrorProps {
  error?: FieldError;
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ error }) => {
  return (
    <span
      className="text-status-error text-xxs mt-1 block min-h-[16px]"
      role={error?.message ? "alert" : undefined}
    >
      {error?.message || "\u00A0"}
    </span>
  );
};
interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  children,
  className,
  label,
  error,
  required,
  disabled = false,
}) => {
  return (
    <div className={cn(" flex flex-col", className)}>
      {label && (
        <Label
          htmlFor={undefined}
          className={cn(
            "mb-1 text-[10px] leading-none",
            disabled ? "text-foreground/50" : "text-foreground"
          )}
        >
          {label}
          {required && <span className="text-status-error ml-1 p-0">*</span>}
        </Label>
      )}
      <div className="mt-[2.5px] flex flex-col">{children}</div>
      <FormError error={error} />
    </div>
  );
};

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
}

const FormRow: React.FC<FormRowProps> = ({ children, className, gap = 4 }) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-12 items-start",
        `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
};

interface FormColProps {
  children: React.ReactNode;
  span?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  className?: string;
}

const FormCol: React.FC<FormColProps> = ({
  children,
  span = 12,
  sm,
  md,
  lg,
  xl,
  className,
}) => {
  // Use explicit class mapping to ensure Tailwind generates the classes
  const getColSpanClass = (size: number) => {
    const colSpanMap: Record<number, string> = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      7: "col-span-7",
      8: "col-span-8",
      9: "col-span-9",
      10: "col-span-10",
      11: "col-span-11",
      12: "col-span-12",
    };
    return colSpanMap[size] || "col-span-12";
  };

  const getResponsiveColSpanClass = (size: number, breakpoint: string) => {
    const colSpanMap: Record<string, Record<number, string>> = {
      sm: {
        1: "sm:col-span-1",
        2: "sm:col-span-2",
        3: "sm:col-span-3",
        4: "sm:col-span-4",
        5: "sm:col-span-5",
        6: "sm:col-span-6",
        7: "sm:col-span-7",
        8: "sm:col-span-8",
        9: "sm:col-span-9",
        10: "sm:col-span-10",
        11: "sm:col-span-11",
        12: "sm:col-span-12",
      },
      md: {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
        4: "md:col-span-4",
        5: "md:col-span-5",
        6: "md:col-span-6",
        7: "md:col-span-7",
        8: "md:col-span-8",
        9: "md:col-span-9",
        10: "md:col-span-10",
        11: "md:col-span-11",
        12: "md:col-span-12",
      },
      lg: {
        1: "lg:col-span-1",
        2: "lg:col-span-2",
        3: "lg:col-span-3",
        4: "lg:col-span-4",
        5: "lg:col-span-5",
        6: "lg:col-span-6",
        7: "lg:col-span-7",
        8: "lg:col-span-8",
        9: "lg:col-span-9",
        10: "lg:col-span-10",
        11: "lg:col-span-11",
        12: "lg:col-span-12",
      },
      xl: {
        1: "xl:col-span-1",
        2: "xl:col-span-2",
        3: "xl:col-span-3",
        4: "xl:col-span-4",
        5: "xl:col-span-5",
        6: "xl:col-span-6",
        7: "xl:col-span-7",
        8: "xl:col-span-8",
        9: "xl:col-span-9",
        10: "xl:col-span-10",
        11: "xl:col-span-11",
        12: "xl:col-span-12",
      },
    };
    return colSpanMap[breakpoint]?.[size] || "";
  };

  const colClasses = cn(
    getColSpanClass(span),
    sm && getResponsiveColSpanClass(sm, "sm"),
    md && getResponsiveColSpanClass(md, "md"),
    lg && getResponsiveColSpanClass(lg, "lg"),
    xl && getResponsiveColSpanClass(xl, "xl"),
    className
  );

  return (
    <div className={cn(colClasses, "flex flex-col items-stretch")}>
      {children}
    </div>
  );
};

interface FormFieldsProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: number;
  className?: string;
}

const FormFields: React.FC<FormFieldsProps> = ({
  children,
  columns = 1,
  gap = 4,
  className,
}) => {
  const gridClass = cn(
    "grid w-full",
    "grid-cols-1",
    columns >= 2 && "sm:grid-cols-2",
    columns >= 3 && "md:grid-cols-3",
    columns >= 4 && "lg:grid-cols-4",
    columns >= 5 && "xl:grid-cols-5",
    columns >= 6 && "2xl:grid-cols-6",
    `gap-${gap}`
  );

  return <div className={cn(gridClass, className)}>{children}</div>;
};

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const FormRoot: React.FC<FormProps> = ({ children, className, ...props }) => {
  return (
    <form
      autoComplete="off"
      className={cn("w-full space-y-2", className)}
      {...props}
    >
      {children}
    </form>
  );
};

export const Form = Object.assign(FormRoot, {
  Error: FormError,
  Field: FormField,
  Row: FormRow,
  Col: FormCol,
  Fields: FormFields,
});
