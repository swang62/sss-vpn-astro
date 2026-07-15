import { navigate } from "astro:transitions/client";
import { LoaderCircle, Power } from "lucide-react";
import { useCallback, useState } from "react";

function ConnectButton() {
  const [connecting, setConnecting] = useState(false);

  const handleClick = useCallback(() => {
    if (connecting) return;
    setConnecting(true);
    setTimeout(() => navigate("/signup"), 800);
  }, [connecting]);

  return (
    <div className="group relative flex justify-center">
      <div className="relative size-48">
        <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
        <div className="wave-ring" />
        <div className="wave-ring" />
        <div className="wave-ring" />
        <button
          type="button"
          onClick={handleClick}
          disabled={connecting}
          className="relative z-10 flex size-48 cursor-pointer flex-col items-center justify-center rounded-full border border-primary/20 bg-card shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 disabled:cursor-wait"
        >
          <div className="connect-ring-spin" />
          {connecting ? (
            <>
              <LoaderCircle className="mb-2 size-10 animate-spin text-primary" />
              <span className="font-mono text-muted-foreground text-xs tracking-[0.2em]">
                CONNECTING...
              </span>
            </>
          ) : (
            <>
              <Power className="mb-2 size-10 text-destructive transition-colors duration-300 group-hover:text-secondary" />
              <span className="font-mono text-foreground text-xs tracking-[0.2em]">
                CONNECT
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ConnectButton;
