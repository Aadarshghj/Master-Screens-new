import type { FC } from "react";
import background from "../../../../assets/landing-page-banner.png";
import emptyBackground from "../../../../assets/landing-page-banner-empty.png";
import type { LandingPageBannerProps } from "@/types";

const BannerWrapper: FC<LandingPageBannerProps> = ({
  children,
  emptyTemplate = false,
}) => {
  return (
    <div
      className="h-screen w-full bg-white bg-size-[120%] bg-right bg-no-repeat md:w-1/2 md:bg-transparent md:bg-cover"
      style={{
        backgroundImage: `url(${emptyTemplate ? emptyBackground : background})`,
      }}
    >
      {children}
    </div>
  );
};

export default BannerWrapper;
