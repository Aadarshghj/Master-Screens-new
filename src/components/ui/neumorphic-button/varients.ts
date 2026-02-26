import { cva } from "class-variance-authority";

export const neumorphicButtonVariants = cva(
  "whitespace-nowrap relative z-10 overflow-clip  transition-all duration-250 flex items-center justify-center gap-2",
  {
    variants: {
      variant: {
        default:
          "bg-theme-primary text-white shadow-[0px_4px_13px_-8px_rgba(0,_0,_0,_0.8)] group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)]",
        primary:
          "bg-cyan-500 text-white shadow-[0px_4px_13px_-8px_rgba(0,_0,_0,_0.8)] group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-cyan-500/60",
        secondary:
          "bg-gray-950 text-white shadow-[0px_4px_13px_-8px_rgba(0,_0,_0,_0.8)] group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)]",
        lite: "bg-cyan-1000 text-cyan-700 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-cyan-1000/60",
        success:
          "bg-green-300 text-green-900 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-green-300/60",
        error:
          "bg-red-300 text-red-900 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-red-300/60",
        outline:
          "bg-white border border-border text-blue-950  group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-white/60",
        grey: "bg-muted  border border-border text-blue-600  group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-white/60",
        none: "bg-transparent  text-blue-950  group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-white/60",
      },
      size: {
        default: "rounded-full text-[11px] font-medium min-h-[26px] pl-3 pr-4",
        primary: "rounded-full text-[11px] font-medium min-h-[26px] pl-3 pr-4",
        secondary:
          "rounded-full text-[11px] font-medium min-h-[26px] pl-3 pr-4",
        lite: "rounded-full text-[11px] font-medium pl-3 pr-4",
        success: "rounded-full text-[11px] font-medium pl-3 pr-4",
        error: "rounded-full text-[11px] font-medium pl-3 pr-4",
        outline: "rounded-full text-[11px] font-medium pl-3 pr-4",
        none: "rounded-full text-[11px] font-medium pl-3 pr-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
