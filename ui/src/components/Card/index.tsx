import React from "react";
import Urls from "../../utils/urls";

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
      style={{ fontSize: 0 }}
    >
      <div className="flex w-full text-base text-left transition transform md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
        <div className="relative flex items-center w-full px-4 pb-8 pl-20 overflow-hidden bg-white shadow-2xl pt-14 sm:px-6 sm:pt-8 md:p-6 lg:p-8">
          <img
            alt="fida-logo"
            src={Urls.fidaLogo}
            className="absolute z-10 h-10 top-6 left-6"
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
