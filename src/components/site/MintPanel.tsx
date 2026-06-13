import { useMemo, useState } from "react";
import { formatEther } from "ethers";
import { MINT_CONFIG, type MintStatus } from "@/lib/mint-config";
import { calculateMintCost, isContractConfigured } from "@/lib/web3";

interface MintPanelProps {
  connected: boolean;
  address: string | null;
  mintedByWallet: number;
  currentSupply: number;
  walletError: string | null;
  onConnect: () => void | Promise<void>;
  onMint?: (qty: number) => Promise<string | void>;
}

export function MintPanel({
  connected,
  address,
  mintedByWallet,
  currentSupply,
  walletError,
  onConnect,
  onMint,
}: MintPanelProps) {
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<MintStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);

  const remainingSupply = Math.max(0, MINT_CONFIG.totalSupply - currentSupply);
  const maxQuantity = Math.min(20, Math.max(1, remainingSupply));
  const { freeQuantity, paidQuantity, totalPrice } = useMemo(
    () => calculateMintCost(qty, mintedByWallet),
    [mintedByWallet, qty],
  );
  const totalPriceEth = formatEther(totalPrice);

  const handleMint = async () => {
    if (!connected) {
      setStatus("connecting");
      await onConnect();
      setStatus("idle");
      return;
    }

    try {
      setTxHash(null);
      setMintError(null);
      setStatus("waiting_wallet");
      const hash = await onMint?.(qty);
      setStatus("submitted");
      if (hash) setTxHash(hash);
      setStatus("success");
    } catch (error) {
      setMintError(error instanceof Error ? error.message : "Mint failed.");
      setStatus("failed");
    }
  };

  const statusText: Record<MintStatus, string> = {
    idle: "Awaiting your move.",
    connecting: "Connecting wallet…",
    waiting_wallet: "Waiting for wallet…",
    submitted: "Transaction submitted…",
    success: "Mint successful. The Ledger remembers.",
    failed: "Mint failed. The book remains closed.",
  };

  return (
    <section id="mint" className="relative px-6 md:px-12 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">— 01 / The Ritual —</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-bone">Claim Your Ledger</h2>
        </div>

        <div className="hairline bg-card/30 backdrop-blur-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-6 border-b border-border/40">
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">Wallet</div>
              <div className="mt-1 font-mono text-sm text-bone truncate">
                {connected && address ? address : "— Not connected —"}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">Status</div>
              <div className={`mt-1 flex items-center gap-2 font-mono text-sm ${connected ? "text-bone" : "text-muted-foreground"}`}>
                <span className={`w-2 h-2 rounded-full ${connected ? "bg-blood animate-door-glow" : "bg-muted-foreground"}`} />
                {connected ? `${mintedByWallet} held by wallet` : "Disconnected"}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="p-6 md:p-10 border-b border-border/40">
            <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">Quantity</div>
            <div className="mt-6 flex items-center justify-center gap-8">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-14 h-14 hairline text-bone text-2xl font-display hover:bg-bone hover:text-background transition-colors"
                aria-label="Decrease"
              >
                −
              </button>
              <div className="font-display text-7xl md:text-8xl text-bone tabular-nums w-32 text-center">
                {String(qty).padStart(2, "0")}
              </div>
              <button
                onClick={() => setQty(Math.min(maxQuantity, qty + 1))}
                disabled={remainingSupply === 0}
                className="w-14 h-14 hairline text-bone text-2xl font-display hover:bg-bone hover:text-background transition-colors"
                aria-label="Increase"
              >
                +
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-px bg-border/40 hairline">
              <Stat label="Free" value={`${freeQuantity}`} />
              <Stat label="Paid" value={`${paidQuantity}`} />
              <Stat label="Total" value={totalPrice === 0n ? "Free" : `${totalPriceEth} ETH`} highlight />
            </div>

            <div className="mt-5 text-center font-mono text-[10px] tracking-[0.18em] uppercase text-ash">
              Supply {currentSupply} / {MINT_CONFIG.totalSupply}
            </div>
          </div>

          {/* Action */}
          <div className="p-6 md:p-10">
            <button
              onClick={handleMint}
              disabled={status === "connecting" || status === "waiting_wallet" || status === "submitted" || remainingSupply === 0}
              className="w-full py-5 bg-blood text-bone font-mono text-sm tracking-[0.3em] uppercase transition-all hover:bg-[color:var(--blood-glow)] hover:blood-glow disabled:opacity-50 disabled:cursor-wait"
            >
              {connected ? `Mint ${qty} ${qty === 1 ? "Ledger" : "Ledgers"}` : "Connect Wallet to Mint"}
            </button>

            <div className="mt-6 flex items-center justify-center gap-3 font-mono text-xs text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${
                status === "success" ? "bg-blood" :
                status === "failed" ? "bg-destructive" :
                status === "idle" ? "bg-muted-foreground" :
                "bg-bone animate-pulse"
              }`} />
              {statusText[status]}
            </div>

            {!isContractConfigured() && (
              <p className="mt-4 text-center font-mono text-[10px] tracking-[0.16em] uppercase text-blood">
                Contract address not configured yet
              </p>
            )}
            {(walletError || mintError) && (
              <p className="mt-4 text-center text-xs text-destructive">
                {mintError || walletError}
              </p>
            )}
            {txHash && (
              <p className="mt-4 text-center font-mono text-[10px] text-ash break-all">
                Transaction: {txHash}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-background p-4 text-center">
      <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">{label}</div>
      <div className={`mt-2 font-display text-2xl ${highlight ? "text-blood" : "text-bone"}`}>{value}</div>
    </div>
  );
}
