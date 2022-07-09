import { CheckCircleIcon } from "@heroicons/react/solid";
import { Dialog } from "@headlessui/react";

const conditions = [
  "Bonfida will not be held responsible for users typing in a wrong address or making a mistake when doing so. Please ensure you double-check your shipping details before confirming. You will not be able to change the address",
  "Bonfida will not be held responsible for the merchandise being lost during shipping",
  "Merchandise is restricted to one product per wallet address",
  "NFT holdings will be verified during ordering and processing. If no NFT is detected, the order will be canceled and your funds will be returned.",
  "Once an order is placed, it cannot be canceled, except for the circumstance explained above",
  "Placing an order will only cost a small gas fee in SOL",
  "Merchandise will take approximately 15 days to manufacture and delivery time will be dependent on your location",
];

export const DetailsDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}) => {
  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="px-10 py-8 text-center text-black rounded-lg bg-white shadow-2xl max-w-[600px]">
        <Dialog.Panel>
          <Dialog.Title className="text-xl font-bold">
            Bonfida Cap - Terms
          </Dialog.Title>

          <div>
            {conditions.map((e, idx) => {
              return (
                <div
                  className="flex items-center w-full my-4 space-x-2"
                  key={`condition-${idx}`}
                >
                  <CheckCircleIcon className="w-6 h-6 text-violet-700" />
                  <p className="w-full text-xs font-semibold text-left md:text-sm">
                    {e}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-black border border-transparent rounded-[8px]"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
