import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= breakpoint) setIsMobile(true);
  }, [breakpoint]);

  return isMobile;
}
