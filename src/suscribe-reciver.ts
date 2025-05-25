import { createPublicClient, http } from 'viem'
import { avalanche } from 'viem/chains'
import { CChainReciverAbi } from './utils/cchain-reciver'
 
const RECIVER_CONTRACT_CCHAIN = "0x1134584b96749fD4b597390a388210Ea88f2Fcdb";

export const publicClient = createPublicClient({
  chain: avalanche,
  transport: http('https://api.avax.network/ext/bc/C/rpc')
})

publicClient.getContractEvents({
    abi: CChainReciverAbi,
    address: RECIVER_CONTRACT_CCHAIN,
    eventName: "MessageReceived",
    fromBlock: 62636810n,
    toBlock: "latest"
}).then((events) => {
    console.log("MessageReceived event:", events);
}).catch((error) => {
    console.error("Error in getContractEvents:", error);
})