export function Narrative() {
  const stages = [
    {
      n: "I",
      title: "One Ticket",
      tag: "You are on the list.",
      body: "A single image lands in your wallet. The ushers know your name.",
    },
    {
      n: "II",
      title: "Three Tickets",
      tag: "You may open the door.",
      body: "Three seats held by one hand. A key can be forged from what you burn.",
    },
    {
      n: "III",
      title: "Final Ticket",
      tag: "The story begins.",
      body: "When the last admission is claimed, the second act is no longer a rumor.",
    },
  ];

  return (
    <section className="relative px-6 md:px-12 py-32 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 max-w-3xl">
          <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">— 02 / The Premise —</div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-[0.95]">
            This Is Not<br />
            <span className="italic text-blood">A Collection.</span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Every NFT is the same ticket, because everyone is entering the same door.
            The difference is not in the picture — it is in the seat number, the count
            in your wallet, and whether you choose to burn them.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border/40 hairline">
          {stages.map((s) => (
            <div key={s.n} className="bg-background p-10 group hover:bg-card/40 transition-colors">
              <div className="font-display text-7xl text-blood/60 group-hover:text-blood transition-colors">{s.n}</div>
              <div className="mt-8 font-mono text-[10px] tracking-[0.3em] text-ash uppercase">{s.title}</div>
              <div className="mt-3 font-display text-2xl text-bone italic">{s.tag}</div>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
