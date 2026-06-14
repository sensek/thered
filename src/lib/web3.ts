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
  console.log('[getEthereumProvider] Checking window...');
  if (typeof window === 'undefined') {
    console.error('[getEthereumProvider] Window is undefined (server-side)');
    throw new Error("Cannot access wallet in server environment.");
  }
  
  console.log('[getEthereumProvider] Detecting available wallets...');
  
  // 列出所有可用的钱包
  const wallets = {
    okxwallet: (window as any).okxwallet,
    ethereum: (window as any).ethereum,
    coinbase: (window as any).coinbaseWalletExtension,
  };
  
  console.log('[getEthereumProvider] Available wallets:', {
    okxwallet: !!wallets.okxwallet,
    ethereum: !!wallets.ethereum,
    coinbase: !!wallets.coinbase,
  });
  
  // 优先使用 OKX
  if (wallets.okxwallet) {
    console.log('[getEthereumProvider] Using OKX Wallet');
    return new BrowserProvider(wallets.okxwallet);
  }
  
  // 然后是标准 ethereum 提供者
  if (wallets.ethereum) {
    console.log('[getEthereumProvider] Using standard Ethereum provider');
    // 检查是否是 MetaMask
    if (wallets.ethereum.isMetaMask) {
      console.log('[getEthereumProvider] Detected MetaMask');
    }
    return new BrowserProvider(wallets.ethereum);
  }
  
  // Coinbase
  if (wallets.coinbase) {
    console.log('[getEthereumProvider] Using Coinbase Wallet');
    return new BrowserProvider(wallets.coinbase);
  }
  
  console.error('[getEthereumProvider] No wallet provider found');
  throw new Error(
    "No Web3 wallet detected. Please install MetaMask, OKX Wallet, or another compatible wallet extension and refresh the page."
  );
}

export async function connectWallet() {
  console.log('[connectWallet] Checking environment...');
  if (typeof window === 'undefined') {
    console.error('[connectWallet] Running in server environment!');
    throw new Error("Wallet connection only available in browser.");
  }
  
  console.log('[connectWallet] Getting provider...');
  const provider = getEthereumProvider();
  console.log('[connectWallet] Requesting accounts...');
  await provider.send("eth_requestAccounts", []);
  console.log('[connectWallet] Getting signer...');
  const signer = await provider.getSigner();
  console.log('[connectWallet] Ensuring correct chain...');
  await ensureCorrectChain(provider);

  const address = await signer.getAddress();
  console.log('[connectWallet] Connected successfully:', address);
  return address;
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
