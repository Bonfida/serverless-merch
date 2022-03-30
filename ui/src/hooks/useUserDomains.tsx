import { useRequest } from "ahooks";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  NAME_PROGRAM_ID,
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from "@bonfida/spl-name-service";
import { PublicKey, Connection } from "@solana/web3.js";
import BN from "bn.js";

const CLASS_PROGRAM = new PublicKey(
  "jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR"
);

export async function performReverseLookupBatch(
  connection: Connection,
  nameAccounts: PublicKey[]
): Promise<(string | undefined)[]> {
  const [centralState] = await PublicKey.findProgramAddress(
    [CLASS_PROGRAM.toBuffer()],
    CLASS_PROGRAM
  );
  let reverseLookupAccounts: PublicKey[] = [];
  for (let nameAccount of nameAccounts) {
    const hashedReverseLookup = await getHashedName(nameAccount.toBase58());
    const reverseLookupAccount = await getNameAccountKey(
      hashedReverseLookup,
      centralState
    );
    reverseLookupAccounts.push(reverseLookupAccount);
  }

  let names = await NameRegistryState.retrieveBatch(
    connection,
    reverseLookupAccounts
  );

  return names.map((name) => {
    if (name === undefined || name.data === undefined) {
      return undefined;
    }
    let nameLength = new BN(name.data.slice(0, 4), "le").toNumber();
    return name.data.slice(4, 4 + nameLength).toString();
  });
}

export const useUserDomains = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  const fn = async () => {
    if (!connected || !publicKey) {
      return;
    }
    const filters = [
      {
        memcmp: {
          offset: 32,
          bytes: publicKey.toBase58(),
        },
      },
    ];
    const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
      filters,
    });
    const names = await performReverseLookupBatch(
      connection,
      accounts.map((a) => a.pubkey)
    );
    return names.filter((e) => !!e) as string[];
  };

  return useRequest(fn, {
    refreshDeps: [connected, publicKey],
    cacheKey: `useUserDomains`,
  });
};
