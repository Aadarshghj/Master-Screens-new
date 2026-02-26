import type { MynaIconsProps } from "@mynaui/icons-react";
import type { JSX, ReactNode } from "react";

export interface ButtonProps {
  label: (props: MynaIconsProps) => JSX.Element;
  url: string;
}
export interface LandingPageProps {
  children: ReactNode;
  title: string;
  description: string;
  buttonData: ButtonProps[];
  emptyTemplate?: boolean;
}
export interface LandingPageContentProps {
  description: string;
  title: string;
  buttonData: ButtonProps[];
}
export interface LandingPageBannerProps {
  children: ReactNode;
  emptyTemplate?: boolean;
}
