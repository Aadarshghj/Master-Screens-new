import { ENV } from "@/config";

const AppVersion = () => {
  const version = ENV.VITE_APP_VERSION;
  return (
    <p className=" fixed right-2 bottom-2 z-50 text-[10px] opacity-70">
      V.{version}
    </p>
  );
};

export default AppVersion;
