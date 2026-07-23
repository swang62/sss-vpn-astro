import { useEffect, useState } from "react";
import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const [theme, setTheme] = useState<ToasterProps["theme"]>("system");

  useEffect(() => {
    const el = document.documentElement;
    const sync = () => {
      setTheme(el.classList.contains("dark") ? "dark" : "light");
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
