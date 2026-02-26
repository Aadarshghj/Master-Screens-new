import { commonVariantClasses } from "../common-variants/variant";

export const datePickerSizeClasses = {
  xs: "h-[28px] px-3 py-2 text-sm",
  sm: "h-8 px-3 py-2 text-sm",
  md: "h-10 px-4 py-3 text-base",
  lg: "h-12 px-5 py-4 text-lg",
  xl: "h-14 px-6 py-5 text-xl",
  compact: "h-[36px] px-4 py-3 text-sm",
  form: commonVariantClasses.size.form,
} as const;

export const datePickerWidthClasses = {
  xs: "w-24",
  sm: "w-32",
  md: "w-64",
  lg: "w-96",
  xl: "w-[32rem]",
  full: "w-full",
  auto: "w-auto",
  fit: "w-fit",
} as const;

export const datePickerVariantClasses = {
  default:
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  form: commonVariantClasses.date.form,
  filled:
    "placeholder:text-gray-400 border-gray-300 bg-white rounded-[4px] border transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-blue-500 focus:ring-0 hover:border-gray-400",
  bordered:
    "placeholder:text-muted-foreground border-gray-200 bg-transparent rounded-md border transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 hover:border-gray-300",
  flat: "placeholder:text-muted-foreground bg-gray-50 border-0 rounded-md transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus:bg-white focus:ring-2 focus:ring-theme-primary/20",
  ghost:
    "placeholder:text-muted-foreground bg-transparent border-0 rounded-md transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus:bg-gray-50",
} as const;
