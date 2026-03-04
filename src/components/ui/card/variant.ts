import { cva } from "class-variance-authority";

export const cardVariants = cva([
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
]);

export const cardHeaderVariants = cva([
  "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
  "has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
]);

export const cardTitleVariants = cva(["leading-none font-semibold"]);

export const cardDescriptionVariants = cva(["text-muted-foreground text-sm"]);

export const cardActionVariants = cva([
  "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
]);

export const cardContentVariants = cva(["px-6"]);

export const cardFooterVariants = cva([
  "flex items-center px-6 [.border-t]:pt-6",
]);
