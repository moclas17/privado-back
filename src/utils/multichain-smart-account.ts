import {
    toMultichainNexusAccount,
  } from "@biconomy/abstractjs";
  import { arbitrum } from "viem/chains";
  import { http } from "viem";
import { createWallet } from "../create-wallet";

export const createMultichainSmartAccount = async () => {
    console.log("Creating multichain smart account");
    const { account } = createWallet();
    // Create multichain smart account
    const smartAccount = await toMultichainNexusAccount({
        signer: account,
        chains: [arbitrum],
        transports: [http()],
      });
    
      // Log the orchestrator account address
      console.log(
        "Orchestrator Account address:",
        smartAccount.addressOn(arbitrum.id)
      );

      return smartAccount;
}
