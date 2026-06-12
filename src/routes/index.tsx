import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { MintPanel } from "@/components/site/MintPanel";
import { Narrative } from "@/components/site/Narrative";
import { Burn } from "@/components/site/Burn";
import { Seats } from "@/components/site/Seats";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THE LAST TICKET — A One-Image NFT Event" },
      {
        name: "description",
        content:
          "Same ticket. Different seats. When the final ticket is claimed, the door opens. A one-image NFT ceremony.",
      },
      { property: "og:title", content: "THE LAST TICKET" },
      {
        property: "og:description",
        content: "A single image. Thousands of seats. When the last ticket is claimed, the door opens.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  // Placeholder wallet state — swap with wagmi/ethers later
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = () => {
    if (connected) return;
    setConnected(true);
    setAddress("0x8f2C4Dd1E2A0b9cD3f7E51aB42cD8e1F09C7AbE34");
  };

  const handleMintScroll = () => {
    document.getElementById("mint")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav connected={connected} address={address} onConnect={handleConnect} />
      <main>
        <Hero connected={connected} onConnect={handleConnect} onMint={handleMintScroll} />
        <MintPanel connected={connected} address={address} onConnect={handleConnect} />
        <Narrative />
        <div id="burn"><Burn /></div>
        <Seats />
        <div id="faq"><Faq /></div>
      </main>
      <Footer />
    </div>
  );
}
