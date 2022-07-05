import { useTokenAccounts } from "@bonfida/hooks";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import hashListRaw from "../../utils/nft/hash_list.json";
import WalletConnect from "../WalletConnect";
import Card from "../Card";
import wolvesGif from "../../assets/wolves-gif.gif";
import {
  LightningBoltIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Loading from "../Loading";
import Urls from "../../utils/urls";

export const SelectNft = ({ setStep }: { setStep: (arg: number) => void }) => {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const { data: tokenAccounts } = useTokenAccounts(connection, publicKey);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    setVerifying(true);
    const maybeNfts = tokenAccounts?.accounts
      .filter((e) => e.decimals === 0 && e.account.amount.toString() === "1")
      .filter((e) => hashListRaw.includes(e.account.mint.toBase58()));
    setVerified(!!maybeNfts && maybeNfts?.length > 0);
    setVerifying(false);
  }, [tokenAccounts?.accounts.length, connected]);

  return (
    <Card>
      <div className="grid items-start w-full grid-cols-1 mt-10 md:ml-10 gap-y-8 gap-x-6 sm:grid-cols-12 lg:items-center lg:gap-x-8">
        <div className="overflow-hidden bg-gray-100 rounded-lg aspect-square sm:col-span-4 lg:col-span-6">
          <img src={wolvesGif} alt="wolves" />
        </div>
        <div className="sm:col-span-8 lg:col-span-6">
          <h2 className="text-xl font-medium text-gray-900 sm:pr-12">
            NFT verification
          </h2>
          <div className="flex items-center mt-10 space-x-3">
            {!connected ? (
              <LightningBoltIcon className="h-6 text-violet-700" />
            ) : verified ? (
              <CheckCircleIcon className="h-6 text-violet-700" />
            ) : (
              <XCircleIcon className="h-6 text-violet-700" />
            )}
            <p className="text-sm font-bold">
              You need to hold at least 1 Bonfida Wolves NFT
            </p>
          </div>
          <p className="text-black">
            {verifying && (
              <div className="flex items-center my-3 space-x-2">
                <Loading /> <p className="text-sm">Verifying NFT holding...</p>
              </div>
            )}
          </p>
          {!connected && (
            <div className="mt-10">
              <WalletConnect />
            </div>
          )}
          {connected && (
            <div>
              {verified ? (
                <button
                  disabled={!verified}
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="submit"
                >
                  Next
                </button>
              ) : (
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={Urls.magiceden}
                  className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Get a Bonfida Wolf
                </a>
              )}
              <button
                onClick={() => setStep(0)}
                type="submit"
                className="flex items-center justify-center w-full px-8 py-3 mt-2 text-base font-medium text-indigo-600 border-2 border-transparent border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
