import { cva } from "class-variance-authority";

export const alertDialogOverlayVariants = cva([
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "fixed inset-0 z-50 bg-black/50",
]);

export const alertDialogContentVariants = cva([
  "bg-background",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)]",
  "translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6",
  "shadow-lg duration-200 sm:max-w-lg",
]);

export const alertDialogHeaderVariants = cva([
  "flex flex-col gap-2 text-center sm:text-left",
]);

export const alertDialogFooterVariants = cva([
  "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
]);

export const alertDialogTitleVariants = cva(["text-lg font-semibold"]);

export const alertDialogDescriptionVariants = cva([
  "text-muted-foreground text-sm",
]);
