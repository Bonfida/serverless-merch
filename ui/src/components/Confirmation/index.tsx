import { useState } from "react";
import Card from "../Card";
import { useLocalStorageState } from "ahooks";
import { useEffect } from "react";
import { Order } from "../../utils/order/type";
import { encrypt } from "../../utils/rsa";
import { upload } from "../../utils/ipfs";
import { Transaction, TransactionInstruction } from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
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

const styles = {
  input:
    "block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
  label: "block text-sm font-medium text-gray-700",
  nextButton:
    "flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
  backButton:
    "flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-indigo-600 border-2 border-transparent border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
};

type State = string | undefined | null;

interface Size {
  name: string;
}

const Confirmation = ({ setStep }: { setStep: (arg: number) => void }) => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Size
  const [size] = useLocalStorageState<Size | null | undefined>("size");

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
    apartment &&
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
      apartment,
      city,
      country,
      state,
      postalCode,
      phone,
      email,
      size: size.name,
      customization: domain || "",
    };
    try {
      setLoading(true);
      // Order is encrypted before being uploaded to IPFS
      const encryptedOrder = encrypt(order);

      const hash = await upload(encryptedOrder);

      console.log(`Uploaded on IPFS ${hash}`);

      const tx = new Transaction();

      // Transfer instruction
      const source = await getAssociatedTokenAddress(MINT, publicKey);
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
      setSignature(sig);
      await connection.confirmTransaction(sig);

      toast.success("Transaction confirmed 👌");
      setStep(4);
    } catch (err) {
      console.log(err);
      toast.error("Transaction failed 🤯");
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
              {/* Hoodie details */}
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>
              <Row label="Size" value={size?.name} />
              {domain && <Row label="Domain" value={domain + ".sol"} />}

              {/* Contact details */}
              <h2 className="pt-3 text-lg font-medium text-gray-900 border-t border-gray-200">
                Contact details
              </h2>
              <Row label="Email" value={email} />
              <Row label="Phone" value={phone} />

              {/* Shipping details */}
              <h2 className="pt-3 text-lg font-medium text-gray-900 border-t border-gray-200">
                Shipping details
              </h2>
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
          {!hasOrdered && connected && (
            <>
              <button
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
              <div className="flex flex-row justify-center pt-5 mt-10 border-t border-gray-200">
                <h2 className="mt-1 text-lg font-bold">Order confirmed</h2>{" "}
                <CheckCircleIcon className="w-8 text-sm text-green-400" />
              </div>
              <div className="flex flex-row justify-center mt-5 font-bold text-gray-500 underline underline-offset-2 text-md">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={Urls.explorerSignaturePrefix + signature}
                >
                  {abbreviate(signature)}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Confirmation;

// TODO finish
const Row = ({ label, value }: { label: string; value: State }) => {
  return (
    <div>
      <span className={styles.label}>{label}</span>
      <div className="pt-1 pl-5 text-lg font-bold">{value}</div>
    </div>
  );
};
