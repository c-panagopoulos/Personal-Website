import { useEffect, useRef } from "react";

const WIPE_PERIOD = 30;
const FEATHER = 4;

export default function WipeReveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const applyMask = () => {
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.7)));
      const reveal = progress * WIPE_PERIOD;
      const c = Math.min(WIPE_PERIOD, reveal + FEATHER);
      const mask = `repeating-linear-gradient(115deg, black 0px, black ${reveal}px, transparent ${c}px, transparent ${WIPE_PERIOD}px)`;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
    };

    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        applyMask();
      });
    };

    applyMask();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
