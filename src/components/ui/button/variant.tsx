import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none  shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer rounded-full py-1",
  {
    variants: {
      variant: {
        default:
          "bg-theme-primary text-white shadow-xs hover:bg-theme-primary/90 rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[11px]",
        stretch:
          "bg-theme-primary w-3/4 text-white shadow-xs hover:bg-theme-primary/90 rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[11px]",
        reset:
          "bg-reset-button text-white shadow-xs hover:bg-reset-button/80 rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[11px]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 rounded-full focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-white shadow-xs hover:bg-accent hover:text-black dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        secondary:
          "bg-secondary text-white shadow-xs hover:bg-secondary/80 rounded-full",
        ghost:
          "text-white hover:bg-accent hover:text-white dark:hover:bg-accent/50 rounded-full",
        link: "text-white underline-offset-4 hover:underline rounded-full",
        primary:
          "bg-theme-primary text-white hover:bg-theme-primary/90 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-1 rounded-full",
        filled:
          "bg-background border border-border text-white hover:bg-muted font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-1 rounded-full",
        bordered:
          "bg-background border border-theme-primary text-white hover:bg-theme-primary/10 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-1 rounded-full",
        solid:
          "bg-theme-primary text-white hover:bg-theme-primary/90 font-medium transition-colors focus:outline-none rounded-full",
        action:
          "bg-theme-primary text-white hover:bg-theme-primary/90 font-medium transition-colors focus:outline-none flex items-center gap-2 rounded-full",
        text: "text-white hover:text-white underline p-0 h-auto font-normal bg-transparent rounded-full",
        flat: "bg-background border border-theme-primary text-white hover:bg-theme-primary/10 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-1 rounded-full",
        footer:
          "bg-muted text-primary hover:bg-muted/80 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full",
        circularPrimary:
          "h-7 w-7 rounded-full p-0 text-white bg-theme-primary hover:opacity-80 disabled:opacity-50",
        circularGray:
          "h-7 w-7 rounded-full p-0 text-white bg-gray-200 hover:opacity-80 disabled:opacity-50",
        resetCompact:
          "bg-[#627D97] text-white shadow-xs hover:bg-[#627D97]/90 rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[10px] h-[10px] px-1.5 min-w-[50px] h-[20px]",
        resetPrimary:
          "bg-theme-primary text-white shadow-xs hover:bg-theme-primary/90  rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[10px] px-1.5 min-w-[50px] h-[10px]",
        resetGray:
          "bg-[#7D5260] text-white shadow-xs hover:bg-theme-[#7D5260]/90  rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[10px] px-1.5 min-w-[50px] h-[10px]",
        darkBlue:
          "bg-blue-950 hover:bg-blue-200 text-white shadow-xs  rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[11px]",
        defaultViolet:
          "bg-[#6750A4] text-white shadow-xs hover:bg-[#6750A4]/90 rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-[11px]",
        transparent:
          "bg-transparent border-0 cursor-pointer disabled:opacity-30",
        outlineYellow:
          "border-[#FFBB38] bg-[#FFF5D9] text-[#FFBB38] shadow-xs hover:bg-accent hover:text-black dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        outlineBlue:
          "border-[#FFBB38] bg-cyan-100 text-[#FFBB38] shadow-xs hover:bg-accent hover:text-black dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      },
      size: {
        xs: "h-[26px] px-2 text-xxs gap-1 has-[>svg]:px-1.5",
        sm: "h-[26px] gap-1 px-2 has-[>svg]:px-2",
        default: "h-[26px] px-3 has-[>svg]:px-2.5",
        md: "h-[26px] px-3 has-[>svg]:px-3",
        lg: "h-[26px] px-4 has-[>svg]:px-3",
        xl: "h-[26px] px-5 has-[>svg]:px-4",
        icon: "size-[26px]",
        "icon-xs": "size-[26px]",
        "icon-sm": "size-[26px]",
        "icon-md": "size-[30px]",
        "icon-lg": "size-[32px]",
        "icon-xl": "size-[36px]",
        compact: "h-[24px] px-3 text-[10px]",
        compactWhite: "h-[24px] px-3 text-xxs text-white",
        compactPrimary: "h-[24px] px-3 text-xxs text-primary",
        normal: "h-[28px] px-4 text-xs",
        comfortable: "h-[32px] px-5 text-xs",
        minimal: "h-[24px] px-2 text-xxs min-w-[60px]",
        extended: "h-[24px] px-3 text-xxs min-w-[80px]",
        full: "h-[28px] px-3 text-xs w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
