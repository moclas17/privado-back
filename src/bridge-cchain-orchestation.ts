import { erc20Abi, parseUnits } from "viem";
import { arbitrum } from "viem/chains";

import {
  createMeeClient,
  mcUSDC,
  mcARB,
  greaterThanOrEqualTo,
  runtimeERC20BalanceOf,
  type MultichainSmartAccount,
} from "@biconomy/abstractjs";
import { ChainLinkSenderAbi } from "./utils/chainlink-abi";
import { createMultichainSmartAccount } from "./utils/multichain-smart-account";

const chainLinkSenderContract = "0x1134584b96749fD4b597390a388210Ea88f2Fcdb";

export const bridgeToCChain = async () => {
  const smartAccount: MultichainSmartAccount =
    await createMultichainSmartAccount();

  console.log("Smart Account Address:", smartAccount.addressOn(arbitrum.id));
  // Check token balance across chains
  const balance = await smartAccount.getUnifiedERC20Balance(mcUSDC);
  console.log("USDC balance:", balance);

  const balanceARB = await smartAccount.getUnifiedERC20Balance(mcARB);
  console.log("ARB balance:", balanceARB);

  const usdcAmount = parseUnits("1.5", 6);
  const arbAmount = parseUnits("1.2", 18);

  // Verificar si tenemos suficiente balance

  const executionConstraints = [
    greaterThanOrEqualTo((arbAmount * BigInt(96)) / BigInt(100)),
  ];

  const approveSendToCChain = await smartAccount.buildComposable({
    type: "default",
    data: {
      to: mcUSDC.addressOn(arbitrum.id),
      abi: erc20Abi,
      functionName: "approve",
      args: [
        chainLinkSenderContract,
        runtimeERC20BalanceOf({
          targetAddress: smartAccount.addressOn(arbitrum.id, true),
          tokenAddress: mcUSDC.addressOn(arbitrum.id),
          constraints: executionConstraints,
        }),
      ],
      chainId: arbitrum.id,
    },
  });

  const depositUSDCToSender = await smartAccount.buildComposable({
    type: "default",
    data: {
      to: mcUSDC.addressOn(arbitrum.id),
      abi: erc20Abi,
      functionName: "transfer",
      args: [
        chainLinkSenderContract,
        usdcAmount
      ],
      chainId: arbitrum.id,
    },
  });

  const sendToCChain = await smartAccount.buildComposable({
    type: "default",
    data: {
      to: chainLinkSenderContract,
      abi: ChainLinkSenderAbi,
      functionName: "sendMessagePayLINK",
      args: [
        "6433500567565415381",
        "order_10101",
        usdcAmount,
      ],
      chainId: arbitrum.id,
    },
  });

 /*  const acceptOwnership = await smartAccount.build({
    type: "default",
    data: {
      chainId: arbitrum.id,
      calls: [
        {
          to: chainLinkSenderContract,
          data: "0x79ba5097" // acceptOwnership() function selector
        },
      ],
    },
  }); */

  const meeClient = await createMeeClient({
    account: smartAccount,
    apiKey: process.env.BICONOMY_API_KEY,
  });

  const { hash } = await meeClient.executeQuote({
    quote: await meeClient.getQuote({
      instructions: [approveSendToCChain, depositUSDCToSender, sendToCChain],
      feeToken: {
        address: mcUSDC.addressOn(arbitrum.id),
        chainId: arbitrum.id,
      },
    }),
  });

  console.log(`Started execution: ${hash}`);

  // Wait for the transaction to complete
  const receipt = await meeClient.waitForSupertransactionReceipt({ hash });
  console.log(`Successful execution: ${receipt}`);

  return receipt;
};
