import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { MintPanel } from "@/components/site/MintPanel";
import { MyLedger } from "@/components/site/MyLedger";
import { Narrative } from "@/components/site/Narrative";
import { Burn } from "@/components/site/Burn";
import { Seats } from "@/components/site/Seats";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { connectWallet, getMintSnapshot, mintLedger, type MintSnapshot } from "@/lib/web3";
import { MINT_CONFIG } from "@/lib/mint-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THE RED LEDGER — A One-Image NFT Event" },
      {
        name: "description",
        content:
          "One book. 6,666 copies. The eye remembers every owner. A one-image NFT ceremony.",
      },
      { property: "og:title", content: "THE RED LEDGER" },
      {
        property: "og:description",
        content: "One book. 6,666 copies. Burn three Ledgers to reveal one Key.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<MintSnapshot>({
    totalMinted: MINT_CONFIG.currentSupply,
    mintedByWallet: 0,
    priceEth: MINT_CONFIG.paidPriceEth,
  });
  const [walletError, setWalletError] = useState<string | null>(null);

  const refreshSnapshot = useCallback(async (walletAddress: string) => {
    const nextSnapshot = await getMintSnapshot(walletAddress);
    setSnapshot(nextSnapshot);
  }, []);

  const handleConnect = useCallback(async () => {
    let walletAddress: string;
    try {
      setWalletError(null);
      walletAddress = await connectWallet();
      setConnected(true);
      setAddress(walletAddress);
    } catch (error) {
      setConnected(false);
      setWalletError(error instanceof Error ? error.message : "Wallet connection failed.");
      return;
    }

    try {
      await refreshSnapshot(walletAddress);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Could not fetch contract data.");
    }
  }, [refreshSnapshot]);

  const handleMint = useCallback(
    async (quantity: number) => {
      if (!address) {
        await handleConnect();
        return;
      }

      const txHash = await mintLedger(quantity, snapshot.mintedByWallet);
      await refreshSnapshot(address);
      return txHash;
    },
    [address, handleConnect, refreshSnapshot, snapshot.mintedByWallet],
  );

  const handleMintScroll = () => {
    document.getElementById("mint")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const ethereum = window.ethereum;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const [nextAddress] = Array.isArray(accounts) ? accounts : [];
      if (typeof nextAddress === "string") {
        setConnected(true);
        setAddress(nextAddress);
        void refreshSnapshot(nextAddress).catch((error) => {
          setWalletError(error instanceof Error ? error.message : "Could not refresh wallet data.");
        });
      } else {
        setConnected(false);
        setAddress(null);
        setSnapshot((current) => ({ ...current, mintedByWallet: 0 }));
      }
    };

    ethereum.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, [refreshSnapshot]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav connected={connected} address={address} onConnect={handleConnect} />
      <main>
        <Hero
          connected={connected}
          currentSupply={snapshot.totalMinted}
          onConnect={handleConnect}
          onMint={handleMintScroll}
        />
        <MintPanel
          connected={connected}
          address={address}
          mintedByWallet={snapshot.mintedByWallet}
          currentSupply={snapshot.totalMinted}
          walletError={walletError}
          onConnect={handleConnect}
          onMint={handleMint}
        />
        <MyLedger
          connected={connected}
          address={address}
          mintedByWallet={snapshot.mintedByWallet}
          currentSupply={snapshot.totalMinted}
          onConnect={handleConnect}
        />
        <Narrative />
        <div id="burn"><Burn /></div>
        <Seats />
        <div id="faq"><Faq /></div>
      </main>
      <Footer />
    </div>
  );
}
