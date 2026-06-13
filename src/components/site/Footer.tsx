import { MINT_CONFIG } from "@/lib/mint-config";

export function Footer() {
  const links = [
    ["Twitter", MINT_CONFIG.links.twitter],
    ["Discord", MINT_CONFIG.links.discord],
    ["Contract", MINT_CONFIG.links.contract],
    ["OpenSea", MINT_CONFIG.links.opensea],
  ] as const;

  return (
    <footer className="relative px-6 md:px-12 py-20 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-12">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">— Coda —</div>
            <h3 className="mt-4 font-display text-4xl md:text-6xl text-bone leading-[0.95]">
              THE RED<br />
              <span className="italic text-blood">LEDGER</span>
            </h3>
            <p className="mt-4 text-muted-foreground max-w-md">
              A one-image NFT event. The sealed page opens when the last entry is claimed.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase mb-6">Channels</div>
            <ul className="space-y-3">
              {links.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-3 font-display text-xl text-bone hover:text-blood transition-colors"
                  >
                    <span className="w-6 h-px bg-ash group-hover:bg-blood transition-colors" />
                    {label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between gap-2 font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
          <span>© MMXXVI · The Red Ledger</span>
          <span className="truncate">Contract · {MINT_CONFIG.contractAddress.slice(0, 10)}…{MINT_CONFIG.contractAddress.slice(-6)}</span>
        </div>
      </div>
    </footer>
  );
}
