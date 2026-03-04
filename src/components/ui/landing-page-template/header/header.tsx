import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/incede-logo.png";
import logoWhite from "@/assets/incede-logo-white.png";

import { Button } from "@/components";

const LandingPageHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const buttonDetails = [
    { path: "/", label: "Home" },
    { path: "/messages", label: "Messages" },
    { path: "/contact", label: "Contact" },
    { path: "/login", label: "Login" },
  ];

  return (
    <div className="absolute top-0 left-0 flex flex-wrap items-center justify-start gap-1 px-2 py-4 sm:justify-start sm:gap-5 sm:p-5  ">
      <img
        src={logo}
        alt="Incede Technology"
        className="mr-2 w-[70px] sm:mr-7 sm:w-[120px] md:hidden"
        onError={e => {
          e.currentTarget.style.display = "none";
        }}
      />
      <img
        src={logoWhite}
        alt="Incede Technology"
        className="mr-2 hidden w-[70px] sm:mr-7 sm:w-[120px] md:block"
        onError={e => {
          e.currentTarget.style.display = "none";
        }}
      />

      {buttonDetails.map(item => {
        const isActive = location.pathname === item.path;

        return (
          <Button
            key={item.label}
            onClick={() => navigate(item.path)}
            variant="bordered"
            className={`border-1 text-xs transition-all hover:border-blue-900 sm:h-[38px] sm:min-w-[100px]
              ${
                isActive
                  ? "text-primary-dark border-blue-900 bg-white hover:bg-white"
                  : "hover:text-primary-dark border-white/60 bg-blue-900 text-white hover:bg-white"
              }`}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};

export default LandingPageHeader;
