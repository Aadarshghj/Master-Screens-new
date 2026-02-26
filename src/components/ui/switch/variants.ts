import { cva } from "class-variance-authority";

export const switchVariants = cva(
  "shadow-lg cursor-pointer shadow-inner peer  data-[state=checked]:bg-blue-300 data-[state=unchecked]:bg-gray-lite-50 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed ",
  {
    variants: {
      size: {
        xs: "h-2 w-3",
        sm: "h-2.5 w-4",
        default: "h-[13px] w-5",
        md: "h-3.5 w-6",
        lg: "h-4 w-7",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export const switchThumbVariants = cva(
  "bg-white dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        xs: "size-1.5",
        sm: "size-2",
        default: "size-2.5",
        md: "size-3",
        lg: "size-3.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);
