interface NavProps {
  connected: boolean;
  address: string | null;
  onConnect: () => void | Promise<void>;
}

export function Nav({ connected, address, onConnect }: NavProps) {
  const handleClick = () => {
    console.log('[Nav] Connect button clicked!');
    onConnect();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="max-w-7xl mx-auto grid grid-cols-[minmax(0,1fr)_auto] sm:flex sm:items-center sm:justify-between gap-4">
        <a href="#" className="flex items-center gap-3 min-w-0">
          <span className="w-2 h-2 bg-blood animate-door-glow shrink-0" />
          <span className="font-display text-lg text-bone truncate tracking-wider">THE RED LEDGER</span>
        </a>

        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] tracking-[0.25em] text-ash uppercase">
          <a href="#mint" className="hover:text-bone transition-colors">Mint</a>
          <a href="#ledger" className="hover:text-bone transition-colors">Ledger</a>
          <a href="#burn" className="hover:text-bone transition-colors">Burn</a>
          <a href="#faq" className="hover:text-bone transition-colors">FAQ</a>
        </div>

        <button
          onClick={handleClick}
          type="button"
          className="shrink-0 px-4 py-2 hairline font-mono text-[10px] tracking-[0.25em] uppercase text-bone hover:bg-bone hover:text-background transition-all"
        >
          {connected && address ? `${address.slice(0, 4)}…${address.slice(-4)}` : "Connect"}
        </button>
      </div>
    </nav>
  );
}
