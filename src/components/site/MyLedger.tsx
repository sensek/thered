import { MINT_CONFIG } from "@/lib/mint-config";

interface MyLedgerProps {
  connected: boolean;
  address: string | null;
  mintedByWallet: number;
  currentSupply: number;
  onConnect: () => void | Promise<void>;
}

export function MyLedger({
  connected,
  address,
  mintedByWallet,
  currentSupply,
  onConnect,
}: MyLedgerProps) {
  const freeClaimUsed = mintedByWallet > 0;
  const neededForBurn = Math.max(0, MINT_CONFIG.burnRequired - mintedByWallet);
  const burnReady = connected && neededForBurn === 0;
  const remainingSupply = Math.max(0, MINT_CONFIG.totalSupply - currentSupply);

  return (
    <section id="ledger" className="relative px-6 md:px-12 py-32 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 grid lg:grid-cols-[1fr_1.1fr] gap-10 items-end">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">
              — 02 / My Ledger —
            </div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-[0.95]">
              Read Your
              <br />
              <span className="italic text-blood">Ledger Page.</span>
            </h2>
          </div>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed lg:text-right">
            Connect your wallet to reveal your standing in The Red Ledger: claim status,
            burn readiness, supply position, and the path toward the Red Key.
          </p>
        </div>

        <div className="hairline bg-card/25 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6 p-6 md:p-8 border-b border-border/40">
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
                Wallet Page
              </div>
              <div className="mt-2 font-mono text-sm text-bone truncate">
                {connected && address ? address : "Connect to read your page"}
              </div>
            </div>

            <button
              onClick={onConnect}
              className="shrink-0 px-6 py-3 hairline font-mono text-[10px] tracking-[0.25em] uppercase text-bone hover:bg-bone hover:text-background transition-all"
            >
              {connected ? "Refresh Ledger" : "Connect Wallet"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40">
            <LedgerStat
              label="Your Entries"
              value={connected ? String(mintedByWallet) : "—"}
              detail={connected ? "Ledgers held by this wallet" : "Wallet required"}
              highlight={connected && mintedByWallet > 0}
            />
            <LedgerStat
              label="Free Claim"
              value={!connected ? "—" : freeClaimUsed ? "Used" : "Available"}
              detail={freeClaimUsed ? "Extra mints are paid" : "First Ledger is free"}
              highlight={connected && !freeClaimUsed}
            />
            <LedgerStat
              label="Burn Eligibility"
              value={!connected ? "—" : burnReady ? "Ready" : `Need ${neededForBurn}`}
              detail={burnReady ? "You can enter the burn ritual" : "Hold 3 Ledgers to unlock"}
              highlight={burnReady}
            />
            <LedgerStat
              label="Red Key"
              value={burnReady ? "Unlocked" : "Locked"}
              detail="Burn phase opens later"
              highlight={burnReady}
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-px bg-border/40 border-t border-border/40">
            <div className="bg-background p-6 md:p-8">
              <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
                Owned Token IDs
              </div>
              <div className="mt-6 hairline bg-card/20 p-6 min-h-32 flex items-center justify-center text-center">
                <p className="max-w-sm font-mono text-xs tracking-[0.16em] uppercase text-ash leading-relaxed">
                  {connected
                    ? "Token ID indexing will activate after the contract address is configured."
                    : "Connect your wallet to reveal owned entries."}
                </p>
              </div>
            </div>

            <div className="bg-background p-6 md:p-8">
              <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
                Ledger Supply
              </div>
              <div className="mt-6 grid grid-cols-3 gap-px bg-border/40 hairline">
                <MiniStat label="Claimed" value={String(currentSupply)} />
                <MiniStat label="Remaining" value={String(remainingSupply)} />
                <MiniStat label="Total" value={String(MINT_CONFIG.totalSupply)} />
              </div>
              <div className="mt-6 h-px w-full bg-border/40 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-blood"
                  style={{
                    width: `${Math.min(100, (currentSupply / MINT_CONFIG.totalSupply) * 100)}%`,
                  }}
                />
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-[0.18em] uppercase text-ash">
                The supply is the clock. The final entry opens the sealed page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LedgerStat({
  label,
  value,
  detail,
  highlight,
}: {
  label: string;
  value: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-background p-6 md:p-8 min-h-44">
      <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">{label}</div>
      <div className={`mt-5 font-display text-4xl ${highlight ? "text-blood" : "text-bone"}`}>
        {value}
      </div>
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{detail}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card/30 p-4 text-center">
      <div className="font-mono text-[9px] tracking-[0.2em] text-ash uppercase">{label}</div>
      <div className="mt-2 font-display text-2xl text-bone">{value}</div>
    </div>
  );
}
