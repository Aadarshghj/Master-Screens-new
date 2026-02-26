import type { FC } from "react";
import BannerWrapper from "../banner/banner-wrapper";
import LandingPageContent from "../content/content";
import LandingPageHeader from "../header/header";
import type { LandingPageProps } from "@/types";

const LandingPageTemplate: FC<LandingPageProps> = ({
  children,
  title,
  description,
  buttonData,
  emptyTemplate = false,
}) => {
  return (
    <div className="flex w-screen flex-col-reverse items-center bg-blue-900 md:h-screen md:flex-row">
      <LandingPageHeader />
      <LandingPageContent
        buttonData={buttonData}
        description={description}
        title={title}
      />
      <BannerWrapper emptyTemplate={emptyTemplate}>{children}</BannerWrapper>
    </div>
  );
};

export default LandingPageTemplate;
