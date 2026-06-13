import { BrowserProvider, Contract, formatEther, parseEther, type Eip1193Provider } from "ethers";
import { MINT_CONFIG } from "@/lib/mint-config";

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export const NFT_ABI = [
  "function mint(uint256 quantity) payable",
  "function mintedPerWallet(address wallet) view returns (uint256)",
  "function totalMinted() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function PRICE() view returns (uint256)",
] as const;

export interface MintSnapshot {
  totalMinted: number;
  mintedByWallet: number;
  priceEth: string;
}

export function isContractConfigured() {
  return !/^0x0{40}$/i.test(MINT_CONFIG.contractAddress);
}

export function getEthereumProvider() {
  if (typeof window === 'undefined') {
    throw new Error("Cannot access wallet in server environment.");
  }
  
  if (!window.ethereum) {
    throw new Error("No wallet found. Please install MetaMask or another EVM wallet.");
  }

  return new BrowserProvider(window.ethereum);
}

export async function connectWallet() {
  if (typeof window === 'undefined') {
    throw new Error("Wallet connection only available in browser.");
  }
  
  const provider = getEthereumProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  await ensureCorrectChain(provider);

  return signer.getAddress();
}

export async function ensureCorrectChain(provider = getEthereumProvider()) {
  if (typeof window === 'undefined' || !window.ethereum) {
    return;
  }
  
  const network = await provider.getNetwork();
  if (network.chainId === BigInt(MINT_CONFIG.chainId)) return;

  const chainIdHex = `0x${MINT_CONFIG.chainId.toString(16)}`;
  await window.ethereum?.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: chainIdHex }],
  });
}

export async function getMintSnapshot(address: string): Promise<MintSnapshot> {
  if (typeof window === 'undefined') {
    return {
      totalMinted: MINT_CONFIG.currentSupply,
      mintedByWallet: 0,
      priceEth: MINT_CONFIG.paidPriceEth,
    };
  }
  
  if (!isContractConfigured()) {
    return {
      totalMinted: MINT_CONFIG.currentSupply,
      mintedByWallet: 0,
      priceEth: MINT_CONFIG.paidPriceEth,
    };
  }

  const provider = getEthereumProvider();
  const contract = new Contract(MINT_CONFIG.contractAddress, NFT_ABI, provider);
  const [totalMinted, mintedByWallet, price] = await Promise.all([
    contract.totalMinted(),
    contract.mintedPerWallet(address),
    contract.PRICE(),
  ]);

  return {
    totalMinted: Number(totalMinted),
    mintedByWallet: Number(mintedByWallet),
    priceEth: formatEther(price),
  };
}

export function calculateMintCost(quantity: number, mintedByWallet: number) {
  const freeLeft = mintedByWallet === 0 ? MINT_CONFIG.freePerWallet : 0;
  const paidQuantity = Math.max(0, quantity - freeLeft);
  const totalPrice = parseEther(MINT_CONFIG.paidPriceEth) * BigInt(paidQuantity);

  return { freeQuantity: Math.min(quantity, freeLeft), paidQuantity, totalPrice };
}

export async function mintLedger(quantity: number, mintedByWallet: number) {
  if (typeof window === 'undefined') {
    throw new Error("Minting only available in browser.");
  }
  
  if (!isContractConfigured()) {
    throw new Error("Contract address is not configured yet.");
  }

  const provider = getEthereumProvider();
  await ensureCorrectChain(provider);

  const signer = await provider.getSigner();
  const contract = new Contract(MINT_CONFIG.contractAddress, NFT_ABI, signer);
  const { totalPrice } = calculateMintCost(quantity, mintedByWallet);
  const tx = await contract.mint(quantity, { value: totalPrice });
  await tx.wait();

  return tx.hash as string;
}
