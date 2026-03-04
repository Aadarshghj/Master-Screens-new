import { cva } from "class-variance-authority";

export const paginationVariants = cva(["mx-auto flex w-full justify-center"]);

export const paginationContentVariants = cva([
  "flex flex-row items-center gap-1",
]);

export const paginationPreviousVariants = cva(["gap-1 px-2.5 sm:pl-2.5"]);

export const paginationNextVariants = cva(["gap-1 px-2.5 sm:pr-2.5"]);

export const paginationEllipsisVariants = cva([
  "flex size-9 items-center justify-center",
]);
