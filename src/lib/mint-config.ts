// Configuration constants — replace with on-chain values when wiring the contract.
export const MINT_CONFIG = {
  name: "THE LAST TICKET",
  totalSupply: 10000,
  currentSupply: 1487, // placeholder, replace with contract read
  freePerWallet: 1,
  paidPriceEth: 0.005,
  burnRequired: 3,
  contractAddress: "0x0000000000000000000000000000000000000000",
  chainName: "Ethereum",
  links: {
    twitter: "#",
    discord: "#",
    opensea: "#",
    contract: "#",
  },
} as const;

export type MintStatus =
  | "idle"
  | "connecting"
  | "waiting_wallet"
  | "submitted"
  | "success"
  | "failed";
