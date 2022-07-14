import React from "react";
import Urls from "../../utils/urls";
import { Logo } from "@bonfida/components";

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex h-full text-center md:block md:px-2 lg:px-4"
      style={{ fontSize: 0 }}
    >
      <div className="flex w-full text-base text-left transition transform md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
        <div className="relative flex items-center w-full px-4 pb-8 overflow-hidden bg-white rounded-lg shadow-2xl sm:pl-20 pt-14 sm:px-6 sm:pt-8 md:p-6 lg:p-8">
          <Logo
            alt=""
            variant="color"
            className="absolute z-10 invisible h-10 sm:visible top-6 left-6"
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
