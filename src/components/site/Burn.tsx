import doorImg from "@/assets/door.jpg";

export function Burn() {
  const flow = [
    { k: "01", l: "Mint Ledger" },
    { k: "02", l: "Hold Three" },
    { k: "03", l: "Burn" },
    { k: "04", l: "Claim Red Key" },
    { k: "05", l: "Phase II" },
  ];

  return (
    <section className="relative px-6 md:px-12 py-32 border-t border-border/40">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute inset-0 bg-blood opacity-20 blur-3xl animate-door-glow" />
          <div className="relative hairline overflow-hidden">
            <img
              src={doorImg}
              alt="A black door slightly ajar, dim crimson light spilling from the crack"
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full aspect-square object-cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2 min-w-0">
          <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">— 03 / The Sacrifice —</div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-[0.95]">
            Burn 3.<br />
            <span className="italic text-blood">Claim The Key.</span>
          </h2>

          <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
            Holders of three Ledgers may, in time, burn them in exchange for a single
            Red Key — the credential of the second act.
          </p>
          <p className="mt-4 text-sm text-ash leading-relaxed italic">
            This is a narrative mechanism, not a financial instrument. No yield is
            promised. No price is implied. Only entry.
          </p>

          <ol className="mt-12 space-y-px">
            {flow.map((f, i) => (
              <li
                key={f.k}
                className="hairline flex items-center gap-6 p-5 bg-card/30 hover:bg-card/60 transition-colors"
              >
                <span className="font-mono text-xs text-blood w-10 shrink-0">{f.k}</span>
                <span className="font-display text-xl text-bone min-w-0 truncate">{f.l}</span>
                {i < flow.length - 1 && <span className="ml-auto text-ash shrink-0">↓</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
