import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Transition } from "@headlessui/react";

export const Carousel = ({ items }: { items: string[] }) => {
  const [visible, setVisible] = useState(0);

  return (
    <>
      <div className="flex items-center justify-center w-full h-full overflow-hidden">
        {items.map((e, idx) => {
          return (
            <Transition
              key={`carousel-item-${idx}`}
              as={"div"}
              show={visible === idx}
            >
              <Transition.Child
                unmount={false}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100 hidden"
                leaveTo="opacity-0 hidden"
              >
                <Transition.Child
                  unmount={false}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0 hidden"
                  leaveTo="translate-x-full hidden"
                >
                  <img alt="" className="w-full h-full p-10" src={e} />
                </Transition.Child>
              </Transition.Child>
            </Transition>
          );
        })}
      </div>
      {/* Visibility stuff */}
      <div className="flex items-center justify-center mt-5 space-x-5 rounded-xl">
        {items.map((e, idx) => {
          return (
            <button
              key={`carousel-button-${idx}`}
              onClick={() => setVisible(idx)}
              type="button"
              className={twMerge(
                "h-20 w-20 rounded-xl p-5",

                "border-[3px]",
                visible === idx
                  ? "border-indigo-600"
                  : "border-gray-400 border-opacity-20"
              )}
            >
              <img src={e} alt="" />
            </button>
          );
        })}
      </div>
    </>
  );
};
