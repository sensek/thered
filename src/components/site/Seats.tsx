export function Seats() {
  // visual seat grid
  const seats = Array.from({ length: 60 }, (_, i) => i);
  const taken = new Set([3, 7, 12, 18, 23, 27, 31, 38, 44, 49, 52, 55]);
  const yours = new Set([16]);

  return (
    <section className="relative px-6 md:px-12 py-32 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">— 04 / The Seat —</div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-[0.95]">
            Your Token ID<br />
            <span className="italic text-blood">Is Your Seat.</span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Every ticket looks the same. Every token ID is a different seat. Early
            numbers, mirrored numbers, sequential numbers — some may matter when the
            curtain lifts.
          </p>
        </div>

        <div className="hairline p-6 md:p-10 bg-card/20">
          <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5">
            {seats.map((i) => {
              const isTaken = taken.has(i);
              const isYours = yours.has(i);
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center font-mono text-[8px] transition-all ${
                    isYours
                      ? "bg-blood text-bone blood-glow"
                      : isTaken
                      ? "bg-bone/15 text-ash"
                      : "hairline text-ash/40 hover:border-blood/60 hover:text-bone"
                  }`}
                  title={isYours ? "Your seat" : isTaken ? "Taken" : "Available"}
                >
                  {String(i + 1).padStart(3, "0")}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
            <Legend swatch="hairline" label="Open" />
            <Legend swatch="bg-bone/15" label="Taken" />
            <Legend swatch="bg-blood blood-glow" label="Yours" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`inline-block w-3 h-3 ${swatch}`} />
      {label}
    </span>
  );
}
