import Card from "../Card";
import { useLocalStorageState } from "ahooks";
import { useEffect, useState } from "react";
import { Order } from "../../utils/order/type";
import { encrypt } from "../../utils/rsa";
import { upload } from "../../utils/ipfs";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { MEMO_ID } from "../../utils/memo";
import { toast } from "react-toastify";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { MINT, COLLECT_KEY, PRICE } from "../../utils/settings";
import WalletConnect from "../WalletConnect";
import Loading from "../Loading";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Urls from "../../utils/urls";
import { abbreviate } from "../../utils/transactions";
import { checkAccountExists, USDC_MINT } from "@bonfida/hooks";
import { DetailsDialog } from "../Details";
import { useSmallScreen, useTokenAccounts } from "@bonfida/hooks";

const styles = {
  input:
    "block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
  label: "block text-sm font-medium text-gray-700",
  nextButton:
    "flex items-center justify-center w-full px-8 py-3 mt-4 text-base font-medium text-white bg-black border border-transparent rounded-[8px]",
  backButton:
    "flex items-center justify-center w-full px-8 py-3 mt-2 text-base font-medium text-black border-2 border-transparent border-black rounded-[8px]",
};

type State = string | undefined | null;

interface Size {
  name: string;
}

const Confirmation = ({ setStep }: { setStep: (arg: number) => void }) => {
  const smallScreen = useSmallScreen();
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: tokenAccounts } = useTokenAccounts(connection, publicKey);
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  // Size
  const [size] = useLocalStorageState<Size | null | undefined>("size", {
    defaultValue: { name: "S" },
  });

  // Customization
  const [domain] = useLocalStorageState<State>("domain");

  // Shipping details
  const [email] = useLocalStorageState<State>("email");
  const [firstName] = useLocalStorageState<State>("firstName");
  const [lastName] = useLocalStorageState<State>("lastName");
  const [address] = useLocalStorageState<State>("address");
  const [apartment] = useLocalStorageState<State>("apartment");
  const [city] = useLocalStorageState<State>("city");
  const [country] = useLocalStorageState<State>("country");
  const [state] = useLocalStorageState<State>("state");
  const [postalCode] = useLocalStorageState<State>("postalCode");
  const [phone] = useLocalStorageState<State>("phone");
  const [discord] = useLocalStorageState<State>("discord");

  // Transaction signature
  const [signature, setSignature] = useLocalStorageState<string>("signature");

  // Loading
  const [loading, setLoading] = useState(false);

  const ok =
    size &&
    size.name &&
    // domain && Allow people to order without domain names
    email &&
    firstName &&
    lastName &&
    address &&
    // apartment && Don't require appartment
    city &&
    country &&
    state &&
    postalCode &&
    phone;

  const hasOrdered = !!signature;

  useEffect(() => {
    if (!ok) {
      localStorage.clear();
      setStep(0);
    }
  }, [ok, setStep]);

  const handle = async () => {
    if (!ok) return;
    if (!publicKey || !connected) return;

    const order: Order = {
      firstName,
      lastName,
      address,
      apartment: apartment || "No appartment specified",
      discord: discord || "No discord specified",
      city,
      country,
      state,
      postalCode,
      phone,
      email,
      size: size.name,
      customization: domain || "",
    };
    const acc = tokenAccounts?.getByMint(MINT);

    if (!acc || Number(acc?.account.amount) < PRICE) {
      return toast.info("You do not have enough USDC");
    }

    try {
      setLoading(true);
      // Order is encrypted before being uploaded to IPFS
      const encryptedOrder = encrypt(order);

      const hash = await upload(encryptedOrder);

      console.log(`Uploaded on IPFS ${hash}`);

      const tx = new Transaction();

      // Transfer instruction
      const source = await getAssociatedTokenAddress(MINT, publicKey);

      if (!(await checkAccountExists(connection, source))) {
        const ix = createAssociatedTokenAccountInstruction(
          publicKey,
          source,
          publicKey,
          new PublicKey(USDC_MINT)
        );
        tx.add(ix);
      }

      let ix = createTransferInstruction(source, COLLECT_KEY, publicKey, PRICE);
      tx.add(ix);

      // Memo instruction
      ix = new TransactionInstruction({
        keys: [],
        programId: MEMO_ID,
        data: Buffer.from(hash, "utf-8"),
      });
      tx.add(ix);

      const sig = await sendTransaction(tx, connection);
      console.log(`Order signature: ${sig}`);

      await connection.confirmTransaction(sig, "confirmed");
      setSignature(sig);

      toast.success(<p className="text-xs">Transaction confirmed 👌</p>);
      setStep(4);
    } catch (err) {
      console.log(err);
      toast.error(<p className="text-xs">Transaction failed 🤯</p>);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="w-full">
        <h2 className="sr-only">Confirmation</h2>

        <div>
          <div>
            <h2 className="pl-10 text-lg font-medium text-gray-900">
              Order confirmation
            </h2>

            <div className="grid grid-cols-1 mt-4 gap-y-6">
              {/* Contact details */}
              <div className="grid grid-cols-1 py-4 border-t border-gray-200 md:grid-cols-12 gap-x-8">
                <h2 className="col-span-4 py-3 text-lg font-medium text-gray-900">
                  Contact details
                </h2>
                <div className="col-span-8">
                  <div className="grid w-full grid-cols-2 gap-y-10">
                    <Row label="Email" value={email} />
                    <Row label="Phone" value={phone} />
                  </div>
                </div>
              </div>

              {/* Shipping details */}
              <div className="grid grid-cols-1 py-4 border-t border-gray-200 md:grid-cols-12 gap-x-8">
                <h2 className="col-span-4 py-3 text-lg font-medium text-gray-900">
                  Shipping details
                </h2>
                <div className="col-span-8">
                  <div className="grid w-full grid-cols-2 gap-y-10">
                    <Row label="First name" value={firstName} />
                    <Row label="Last name" value={lastName} />
                    <Row label="Address" value={address} />
                    <Row label="Apartment" value={apartment} />
                    <Row label="City" value={city} />
                    <Row label="Country" value={country} />
                    <Row label="State" value={state} />
                    <Row label="Postal code" value={postalCode} />
                  </div>
                </div>
              </div>

              {/* Order total */}
              <div className="grid grid-cols-1 py-4 border-t border-gray-200 md:grid-cols-12 gap-x-8">
                <div className="flex justify-between col-span-12 my-1">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-900">50 USDC</p>
                </div>

                <div className="flex justify-between col-span-12 my-1">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium text-gray-900">0 USDC</p>
                </div>

                <div className="col-span-12 h-[1px] bg-gray-200 my-2" />

                <div className="flex justify-between col-span-12">
                  <p className="font-bold text-gray-900">Order total</p>
                  <p className="font-bold text-indigo-500">50 USDC</p>
                </div>
              </div>
            </div>
          </div>
          {!hasOrdered && connected && (
            <>
              <div className="flex items-center mt-10 ml-2 space-x-4">
                <input
                  className="w-4 h-4 rounded"
                  onChange={() => setChecked((prev) => !prev)}
                  checked={checked}
                  type="checkbox"
                />

                <p className="text-sm font-semibold">
                  I confirm that the information is correct and I have read and
                  agree{" "}
                  <span
                    onClick={() => setIsOpen(true)}
                    className="underline cursor-pointer"
                  >
                    to terms of service
                  </span>
                </p>
              </div>
              <button
                disabled={!checked}
                onClick={handle}
                type="submit"
                className={styles.nextButton}
              >
                {loading ? <Loading /> : "Confirm"}
              </button>
              <button
                onClick={() => setStep(2)}
                type="submit"
                className={styles.backButton}
              >
                Back
              </button>
            </>
          )}
          {!hasOrdered && !connected && (
            <div className="flex flex-row justify-center mt-5">
              <WalletConnect />
            </div>
          )}
          {hasOrdered && (
            <>
              <div className="flex flex-row justify-center pt-5 mt-10 space-x-4 border-t border-gray-200">
                <h2 className="mt-1 text-lg font-bold">Order confirmed</h2>{" "}
                <CheckCircleIcon className="w-8 text-sm text-green-400" />
              </div>
              <div className="flex flex-row justify-center mt-5 font-bold text-gray-500 underline underline-offset-2 text-md">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={Urls.explorerSignaturePrefix + signature}
                >
                  {abbreviate(signature, smallScreen ? 7 : undefined)}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      <DetailsDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </Card>
  );
};

export default Confirmation;

const Row = ({ label, value }: { label: string; value: State }) => {
  return (
    <div>
      <span className={styles.label}>{label}</span>
      <div className="pt-1 text-lg font-bold">{value}</div>
    </div>
  );
};
