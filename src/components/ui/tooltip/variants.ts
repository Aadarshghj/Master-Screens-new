import { cva } from "class-variance-authority";

export const tooltipContentVariants = cva([
  "bg-primary/80 text-card animate-in fade-in-0 zoom-in-95 rounded-full",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-full px-2 py-1 text-[10px] text-balance",
]);

export const tooltipArrowVariants = cva([
  "bg-primary fill-primary z-50 size-1.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[1px]",
]);
