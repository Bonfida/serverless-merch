import React, { useMemo } from "react";
import "./App.css";
import Steps from "./components/Steps";
import Hoodie from "./components/Hoodie";
import { useLocalStorageState } from "ahooks";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Customization from "./components/Customization";
import Shipping from "./components/Shipping";
import Confirmation from "./components/Confirmation";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const WrapApp = () => {
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(
    () =>
      process.env.NODE_ENV === "production"
        ? (process.env.REACT_APP_CONNECTION as string)
        : (process.env.REACT_APP_CONNECTION_DEV as string),
    []
  );

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({}),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({}),
      new SolletExtensionWalletAdapter({}),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </ConnectionProvider>
  );
};

function App() {
  const [step, setStep] = useLocalStorageState("step", {
    defaultValue: 0,
  });

  return (
    <div className="App">
      <Steps selectedStep={step} />
      {step === 0 && <Hoodie setStep={setStep} />}
      {step === 1 && <Customization setStep={setStep} />}
      {step === 2 && <Shipping setStep={setStep} />}
      {[3, 4].includes(step) && <Confirmation setStep={setStep} />}
      <Footer />
    </div>
  );
}

export default WrapApp;
