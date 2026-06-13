// Replace contractAddress after deploying The Red Ledger contract.
export const MINT_CONFIG = {
  name: "THE RED LEDGER",
  tokenName: "The Red Ledger",
  symbol: "LEDGER",
  totalSupply: 6666,
  currentSupply: 0,
  freePerWallet: 1,
  paidPriceEth: "0.0001",
  burnRequired: 3,
  contractAddress: "0xEf639e28e3eFB05888CaF479C334FAFD011fEF8A",
  chainId: 1,
  chainName: "Ethereum",
  links: {
    twitter: "#",
    discord: "#",
    opensea: "#",
    contract: "https://etherscan.io/address/0xef639e28e3efb05888caf479c334fafd011fef8a",
  },
} as const;

export type MintStatus =
  | "idle"
  | "connecting"
  | "waiting_wallet"
  | "submitted"
  | "success"
  | "failed";
