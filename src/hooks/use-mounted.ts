import { useEffect, useState } from "react";

// Waits for client side component to be rendered in DOM
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
