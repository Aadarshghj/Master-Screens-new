import { cva } from "class-variance-authority";

export const tableContainerVariants = cva("relative w-full overflow-x-auto", {
  variants: {
    variant: {
      default: "",
      kyc: "border-border bg-card rounded-lg border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    variant: {
      default: "",
      kyc: "border-collapse",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const tableHeaderVariants = cva("", {
  variants: {
    variant: {
      default: "[&_tr]:border-b",
      kyc: "bg-muted [&_tr]:border-b-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const tableBodyVariants = cva(["[&_tr:last-child]:border-b-0"]);

export const tableFooterVariants = cva([
  "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
]);

export const tableRowVariants = cva("transition-colors", {
  variants: {
    variant: {
      default: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b",
      kyc: "hover:bg-muted border-b border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const tableHeadVariants = cva(
  "text-foreground text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  {
    variants: {
      variant: {
        default: "h-10 px-2",
        kyc: "h-12 px-4 text-sm first:pl-6 last:pr-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const tableCellVariants = cva(
  "align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  {
    variants: {
      variant: {
        default: "p-2",
        kyc: "px-4 py-3 text-sm text-foreground first:pl-6 last:pr-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const tableCaptionVariants = cva(["text-muted-foreground mt-4 text-sm"]);
