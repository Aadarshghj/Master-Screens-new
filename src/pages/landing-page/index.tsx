import logo from "@/assets/indel-money-logo.png";
import LandingPageTemplate from "../../components/ui/landing-page-template/template/template";
import { Flex } from "@/components";
import { landingPageConstants } from "./constants/page-constants";

const LandingPage = () => {
  return (
    <LandingPageTemplate
      buttonData={landingPageConstants.Buttons}
      description={landingPageConstants.description}
      title={landingPageConstants.title}
    >
      <Flex
        className="h-full w-full "
        direction="col"
        justify="start"
        align="center"
      >
        <img
          src={logo}
          alt="Incede Technology"
          className="mb-4  w-[120px] object-contain pt-36 sm:mb-6 md:w-[140px] md:pt-40 xl:w-[190px]"
          onError={e => {
            e.currentTarget.style.display = "none";
          }}
        />
      </Flex>
    </LandingPageTemplate>
  );
};

export default LandingPage;
