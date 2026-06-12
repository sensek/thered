import ticketImg from "@/assets/ticket.jpg";
import { MINT_CONFIG } from "@/lib/mint-config";

interface HeroProps {
  onConnect: () => void;
  onMint: () => void;
  connected: boolean;
}

export function Hero({ onConnect, onMint, connected }: HeroProps) {
  const pct = (MINT_CONFIG.currentSupply / MINT_CONFIG.totalSupply) * 100;

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-20 overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 vignette" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blood opacity-[0.06] blur-[120px] animate-door-glow" />

      <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
        {/* Left: copy */}
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-8 font-mono text-[10px] tracking-[0.3em] text-ash uppercase">
            <span className="w-8 h-px bg-blood" />
            <span>An on-chain ceremony · MMXXVI</span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tight text-bone text-shadow-blood animate-flicker">
            THE
            <br />
            LAST
            <br />
            <span className="text-blood italic">TICKET</span>
          </h1>

          <p className="mt-8 font-display italic text-2xl md:text-3xl text-bone/80">
            同一张票，不同的座位。
          </p>

          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            A single image. Thousands of seats. When the final ticket is claimed,
            the door opens.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={onConnect}
              className="group relative px-8 py-4 hairline bg-transparent text-bone font-mono text-xs tracking-[0.25em] uppercase transition-all hover:bg-bone hover:text-background"
            >
              {connected ? "Wallet Connected" : "Connect Wallet"}
            </button>
            <button
              onClick={onMint}
              className="group relative px-8 py-4 bg-blood text-bone font-mono text-xs tracking-[0.25em] uppercase transition-all hover:blood-glow hover:bg-[color:var(--blood-glow)]"
            >
              Mint Ticket →
            </button>
          </div>

          {/* mint info strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 hairline">
            {[
              ["Free Mint", "1 / wallet"],
              ["Extra Mint", `${MINT_CONFIG.paidPriceEth} ETH`],
              ["Burn 3", "→ Door Key"],
              ["Supply", `${MINT_CONFIG.currentSupply} / ${MINT_CONFIG.totalSupply}`],
            ].map(([k, v]) => (
              <div key={k} className="bg-background p-4">
                <div className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">{k}</div>
                <div className="mt-2 font-display text-xl text-bone">{v}</div>
              </div>
            ))}
          </div>

          {/* progress */}
          <div className="mt-4">
            <div className="h-px w-full bg-border/40 relative">
              <div
                className="absolute inset-y-0 left-0 bg-blood"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
              {pct.toFixed(2)}% claimed
            </div>
          </div>
        </div>

        {/* Right: ticket */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-blood opacity-10 blur-3xl" />
          <div className="relative hairline-blood p-4 bg-card/40 backdrop-blur-sm animate-float blood-glow">
            <img
              src={ticketImg}
              alt="The Last Ticket — the single image every holder receives"
              width={1024}
              height={1024}
              className="w-full max-w-md aspect-square object-cover grayscale-[0.2] contrast-110"
            />
            <div className="mt-4 flex justify-between font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
              <span>Seat No. ████</span>
              <span>Admit One</span>
            </div>
          </div>
        </div>
      </div>

      {/* bottom scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] text-ash uppercase animate-flicker">
        ↓ Enter
      </div>
    </section>
  );
}
