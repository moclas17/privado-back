import { erc20Abi, parseUnits, getContract, createPublicClient, createWalletClient, http, custom } from "viem";
import { avalancheFuji } from "viem/chains";
import { AvaxFujiReciverAbi } from "./utils/avax-fuji-reciver";
import { privateKeyToAccount } from 'viem/accounts';

const RECIVER_CONTRACT = "0x318a72AFc685E0A398c4856bfEF81e9FB89e4747";
const USDC_CONTRACT = "0x5425890298aed601595a70AB815c96711a31Bc65"; // USDC en Fuji
const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
// const privateKey = generatePrivateKey();

const account = privateKeyToAccount(privateKey) 

const publicClient = createPublicClient({
    chain: avalancheFuji,
    transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
});

const walletClient = createWalletClient({
    account,
    chain: avalancheFuji,
    transport: http('https://api.avax-test.network/ext/bc/C/rpc'), 
})

const contract = getContract({
    address: RECIVER_CONTRACT,
    abi: AvaxFujiReciverAbi,
    client: walletClient,
})

const usdcContract = getContract({
    address: USDC_CONTRACT,
    abi: erc20Abi,
    client: walletClient,
});
  
export const setOrder = async (orderId: string, amount: bigint) => {
    try {
        console.log("Setting order with parameters:", {
            orderId,
            amount: amount.toString()
        });

        const approveHash = await usdcContract.write.approve([RECIVER_CONTRACT, amount]);
        console.log("Approve transaction hash:", approveHash);

        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        console.log("Approve confirmed");

        // Primero transferimos 1 USDC al contrato
        const usdcAmount = parseUnits("1", 6); // 1 USDC
        console.log("Transferring USDC to contract...");
        const transferHash = await usdcContract.write.transfer([RECIVER_CONTRACT, usdcAmount]);
        console.log("USDC transfer hash:", transferHash);
        
        // Esperamos a que la transferencia sea minada
        await publicClient.waitForTransactionReceipt({ hash: transferHash });
        console.log("USDC transfer confirmed");

        // Ahora llamamos a setOrder
        const hash = await contract.write.storeOrder([orderId, amount]);
        console.log("storeOrder transaction hash:", hash);

        // Esperar a que la transacción sea minada
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Transaction receipt:", receipt);
        
        return receipt;
    } catch (error) {
        console.error("Error in storeOrder:", error);
        throw error;
    }
};

