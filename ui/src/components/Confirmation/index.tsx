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

  useEffect(() => {
    if (!ok) {
      localStorage.clear();
      setStep(0);
    }
  }, []);

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
      // Order is encrypted before being uploaded to IPFS
      const encryptedOrder = encrypt(order);

      const hash = await upload(
        new Blob([Buffer.from(encryptedOrder, "base64")])
      );

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
      await connection.confirmTransaction(sig);

      console.log(signature);
      setSignature(sig);

      toast.success("Transaction confirmed 👌");
    } catch (err) {
      toast.error("Transaction failed 🤯");
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

            <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <Row label="Size" value={size?.name} />
              {domain && (
                <div>
                  <span className={styles.label}>Domain</span>
                  <span className="pl-5 mt-1 font-500">{domain}</span>
                </div>
              )}
            </div>
          </div>
          {connected && (
            <>
              <button
                onClick={handle}
                type="submit"
                className={styles.nextButton}
              >
                Next
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
      <span className="pl-5 mt-1 font-500">{value}</span>
    </div>
  );
};
