import {
    erc20Abi,
    parseUnits,
  } from "viem";

import { arbitrum } from "viem/chains";
  
  import {
    createMeeClient,
    mcUSDC,
    mcARB,
    mcWEETH,
    greaterThanOrEqualTo,
    runtimeERC20BalanceOf,
    mcUniswapSwapRouter,
    UniswapSwapRouterAbi,
    type MultichainSmartAccount
  } from "@biconomy/abstractjs";

import { createMultichainSmartAccount } from "./utils/multichain-smart-account";

export const swapOrchestation = async () => {
    const smartAccount: MultichainSmartAccount = await createMultichainSmartAccount();
  
    console.log("Smart Account Address:", smartAccount.addressOn(arbitrum.id));
    console.log("Arbitrum USDC Address:", mcUSDC.addressOn(arbitrum.id));
    console.log("Arbitrum WEETH Address:", mcWEETH.addressOn(arbitrum.id));
    try {
      // Check token balance across chains
      const balance = await smartAccount.getUnifiedERC20Balance(mcUSDC);
      const arbBalance = await smartAccount.getUnifiedERC20Balance(mcARB);
      console.log("USDC balance:", balance);
      console.log("ARB balance:", arbBalance);
    } catch (error) {
      console.error("Error getting balances:", error);
      // Continuar con un balance por defecto
      console.log("Using default balance of 0");
    }
  
    const usdcAmount = parseUnits("1", 6);
    const arbAmount = parseUnits("2.5", 18);
  
    const executionConstraints = [
      greaterThanOrEqualTo((usdcAmount * BigInt(80)) / BigInt(100)) // 20% slippage
    ];
  
    const appoveSwapInstructions = await smartAccount.buildComposable({
      type: "default",
      data: {
        to: mcARB.addressOn(arbitrum.id),
        abi: erc20Abi,
        functionName: "approve",
        args: [
          mcUniswapSwapRouter.addressOn(arbitrum.id),
          runtimeERC20BalanceOf({
            targetAddress: smartAccount.addressOn(arbitrum.id, true),
            tokenAddress: mcARB.addressOn(arbitrum.id),
            constraints: executionConstraints
          })
        ],
        chainId: arbitrum.id
      }
    });
  
    const swapInstructions = await smartAccount.buildComposable({
      type: "default",
      data: {
        to: mcUniswapSwapRouter.addressOn(arbitrum.id),
        abi: UniswapSwapRouterAbi,
        functionName: "exactInputSingle",
        args: [{    
          tokenIn: mcARB.addressOn(arbitrum.id),
          tokenOut: mcWEETH.addressOn(arbitrum.id),
          fee: 5000,
          recipient: smartAccount.addressOn(arbitrum.id, true),
          deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
          amountIn: runtimeERC20BalanceOf({
            targetAddress: smartAccount.addressOn(arbitrum.id, true),
            tokenAddress: mcARB.addressOn(arbitrum.id)
          }),
          amountOutMinimum: (usdcAmount * BigInt(80)) / BigInt(100), // 20% slippage
          sqrtPriceLimitX96: 0n
        }],
        chainId: arbitrum.id
      }
    });
  
    console.log("Executing swap with parameters:", {
      tokenIn: mcARB.addressOn(arbitrum.id),
      tokenOut: mcWEETH.addressOn(arbitrum.id),
      amountIn: arbAmount.toString(),
      amountOutMinimum: ((usdcAmount * BigInt(80)) / BigInt(100)).toString(),
      // expectedOutput: usdcAmount.toString()
    });
  
    // Initialize the orchestration client
    const meeClient = await createMeeClient({
      account: smartAccount,
      apiKey: process.env.BICONOMY_API_KEY,
    });
  
    const { hash } = await meeClient.executeQuote({
      quote: await meeClient.getQuote({
        instructions: [appoveSwapInstructions, swapInstructions],
        feeToken: {
          address: mcUSDC.addressOn(arbitrum.id),
          chainId: arbitrum.id,
        }
      })
    });
  
    console.log(`Started execution: ${hash}`);
  
    // Wait for the transaction to complete
    const receipt = await meeClient.waitForSupertransactionReceipt({ hash });
    console.log(`Successful execution: ${receipt.hash}`);
    
    return receipt;
}