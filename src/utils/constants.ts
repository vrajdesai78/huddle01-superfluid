import { ethers } from "ethers";

export const contractAddress = "0x9880305646840fB9fa3D180361a3A78017558Bc4";

export const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string);

