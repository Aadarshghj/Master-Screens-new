import React from "react";
import logo from "@/assets/incede.png";
import { Button } from "@/components";

const NotFoundPage: React.FC = () => {
  const handleGoHome = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <img
            src={logo}
            alt="Incede Technology"
            className=""
            onError={e => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="mb-8">
          <div className="text-primary mb-4 text-6xl font-bold ">404</div>
          <p className="mb-2 text-lg text-gray-300 md:text-xl">
            We seem to have lost something...
          </p>
          <p className="mb-8 text-base text-gray-400 md:text-lg">
            The page you're looking for has wandered off into the digital void.
          </p>
        </div>

        <div className="space-y-4 sm:flex sm:justify-center sm:space-y-0 sm:space-x-4">
          <Button
            onClick={handleGoHome}
            className="bg-primary hover:bg-primary w-full rounded-lg px-8 py-3 font-semibold text-white transition-colors duration-300 sm:w-auto"
          >
            Go Back Home
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="border-primary text-primary hover:bg-primary w-full rounded-lg border-2 bg-transparent px-8 py-3 font-semibold transition-colors duration-300 hover:text-white sm:w-auto"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
