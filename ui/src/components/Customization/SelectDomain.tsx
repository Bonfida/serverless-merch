import { useState } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Combobox } from "@headlessui/react";
import clsx from "clsx";
import { useUserDomains } from "../../hooks/useUserDomains";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLocalStorageState } from "ahooks";
import Loading from "../Loading";

export default function SelectDomain() {
  const { connected } = useWallet();
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useLocalStorageState("domain");

  const { data, error, loading } = useUserDomains();

  const filteredNames =
    query === ""
      ? data
      : data?.filter((name) => {
          return name.toLowerCase().includes(query.toLowerCase());
        });

  const handle = (e: string) => {
    setDomain(e);
  };

  return (
    <Combobox
      disabled={!connected || !!error || loading}
      as="div"
      value={domain}
      onChange={handle}
    >
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        Select domain name
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full py-2 pl-3 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(domain) => domain + ".sol"}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
          {loading && !data ? (
            <Loading />
          ) : (
            <SelectorIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </Combobox.Button>

        {filteredNames && filteredNames?.length > 0 && (
          <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredNames.map((name) => (
              <Combobox.Option
                key={name}
                value={name}
                className={({ active }) =>
                  clsx(
                    "relative cursor-default select-none py-2 pl-8 pr-4",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={clsx(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {name}.sol
                    </span>

                    {selected && (
                      <span
                        className={clsx(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
