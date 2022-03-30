import Card from "../Card";
import WalletConnect from "../WalletConnect";
import SelectDomain from "./SelectDomain";
import { useWallet } from "@solana/wallet-adapter-react";

const Customization = ({ setStep }: { setStep: (arg: number) => void }) => {
  const { connected } = useWallet();

  return (
    <Card>
      <div className="grid items-start w-full grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-12 lg:items-center lg:gap-x-8">
        <div className="overflow-hidden bg-gray-100 rounded-lg aspect-w-2 aspect-h-3 sm:col-span-4 lg:col-span-5">
          <img
            src="https://i.imgur.com/5RobrP1.png"
            alt=""
            className="object-cover object-center"
          />
        </div>
        <div className="sm:col-span-8 lg:col-span-7">
          <h2 className="sr-only">Checkout</h2>
          <SelectDomain />
          {!connected && (
            <div className="flex items-center justify-center w-full px-8 py-3 mt-8">
              <WalletConnect />
            </div>
          )}
          {connected && (
            <>
              <button
                onClick={() => setStep(2)}
                type="submit"
                className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
              <button
                onClick={() => setStep(0)}
                type="submit"
                className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-indigo-600 border-2 border-transparent border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Customization;
