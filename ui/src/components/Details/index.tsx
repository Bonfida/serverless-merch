import { CheckCircleIcon } from "@heroicons/react/solid";
import { Dialog } from "@headlessui/react";

const conditions = [
  { explanation: "You must hold at least one Bonfida Wolve NFT" },
  {
    explanation:
      "The holding check is done when order is placed but also when the order is processed",
  },
  {
    explanation:
      "If you do not hold the NFT when the order is processed, your order will be cancelled and funds will be returned",
  },
  {
    explanation: "Orders will be processed on xxxxxxx",
  },
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
      <div className="px-10 py-8 text-center text-black rounded-lg bg-slate-100">
        <Dialog.Panel>
          <Dialog.Title className="text-xl font-bold">
            Bonfida Cap - Details
          </Dialog.Title>

          <div>
            {conditions.map((e, idx) => {
              return (
                <div
                  className="flex items-center w-full my-4 space-x-2"
                  key={`condition-${idx}`}
                >
                  <CheckCircleIcon className="w-6 h-6 text-violet-700" />
                  <p className="w-full text-sm font-bold text-left md:text-lg">
                    {e.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
