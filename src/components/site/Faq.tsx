import { useState } from "react";

const items = [
  {
    q: "Why is there only one image?",
    a: "Because this is not a collection of pictures. It is a single event, and every ticket is proof of attendance. The image is the door. The seat number is yours.",
  },
  {
    q: "Why mint more than one?",
    a: "One ticket places you in the room. Three tickets give you the option to forge a Door Key when the burn opens — the credential required for the second act.",
  },
  {
    q: "What happens when I hold 3?",
    a: "You will be able to burn three Tickets in exchange for one Door Key. The burn is a narrative ritual, not a yield mechanism. Hold them, or give them up.",
  },
  {
    q: "Is there a token?",
    a: "No fungible token. No price promise. No roadmap of returns. The only currency here is attention and the act of showing up.",
  },
  {
    q: "When does the door open?",
    a: "When the final ticket is claimed. Not before. The supply is the clock.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative px-6 md:px-12 py-32 border-t border-border/40">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-mono text-[10px] tracking-[0.3em] text-ash uppercase">— 05 / The Questions —</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-bone">
            Before You <span className="italic text-blood">Enter</span>
          </h2>
        </div>

        <div className="hairline">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-border/40 last:border-b-0">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-card/40 transition-colors"
                >
                  <span className="font-display text-xl md:text-2xl text-bone min-w-0">{it.q}</span>
                  <span className={`shrink-0 font-mono text-blood text-xl transition-transform ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-muted-foreground leading-relaxed">{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
