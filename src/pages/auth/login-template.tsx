import LandingPageTemplate from "@/components/ui/landing-page-template/template/template";
import { LoginForm } from "./login";
import { Flex } from "@/components";
import { loginPageConstants } from "./constants/page-constants";

const LoginTemplate = () => {
  return (
    <LandingPageTemplate
      emptyTemplate
      buttonData={loginPageConstants.Buttons}
      description={loginPageConstants.description}
      title={loginPageConstants.title}
    >
      <Flex
        className="h-full w-full "
        direction="col"
        justify="center"
        align="center"
      >
        <LoginForm />
      </Flex>
    </LandingPageTemplate>
  );
};

export default LoginTemplate;
