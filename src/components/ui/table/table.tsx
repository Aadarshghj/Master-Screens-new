import * as React from "react";
import { cn } from "@/utils/index";
import {
  tableContainerVariants,
  tableVariants,
  tableHeaderVariants,
  tableBodyVariants,
  tableFooterVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
  tableCaptionVariants,
} from "./variants";

export interface TableProps extends React.ComponentProps<"table"> {
  variant?: "default" | "kyc";
}

function Table({ className, variant = "default", ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn(tableContainerVariants({ variant }))}
    >
      <table
        data-slot="table"
        className={cn(tableVariants({ variant }), className)}
        {...props}
      />
    </div>
  );
}

export interface TableHeaderProps extends React.ComponentProps<"thead"> {
  variant?: "default" | "kyc";
}

function TableHeader({
  className,
  variant = "default",
  ...props
}: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(tableHeaderVariants({ variant }), className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(tableBodyVariants(), className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(tableFooterVariants(), className)}
      {...props}
    />
  );
}

export interface TableRowProps extends React.ComponentProps<"tr"> {
  variant?: "default" | "kyc";
}

function TableRow({ className, variant = "default", ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(tableRowVariants({ variant }), className)}
      {...props}
    />
  );
}

export interface TableHeadProps extends React.ComponentProps<"th"> {
  variant?: "default" | "kyc";
}

function TableHead({
  className,
  variant = "default",
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(tableHeadVariants({ variant }), className)}
      {...props}
    />
  );
}

export interface TableCellProps extends React.ComponentProps<"td"> {
  variant?: "default" | "kyc";
}

function TableCell({
  className,
  variant = "default",
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(tableCellVariants({ variant }), className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(tableCaptionVariants(), className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
