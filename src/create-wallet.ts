import 'dotenv/config';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts'

const privateKey = process.env.PRIVATE_KEY

if (!privateKey) {
    throw new Error('No se pudo obtener la private key');
}

const account = privateKeyToAccount(privateKey as `0x${string}`);

export const createWallet = () => {
    return {
        account
    }
}