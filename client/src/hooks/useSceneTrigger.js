import { useEffect, useRef, useState } from "react";

export function useSceneTrigger({ threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    let observer;
    let raf1;
    let raf2;

    const cleanup = () => {
      observer?.disconnect();
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };

    const trigger = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      setVisible(true);
      cleanup();
    };

    function checkScroll() {
      const el = ref.current;
      if (!el || firedRef.current) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) trigger();
    }

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!ref.current) return;
        checkScroll();
        if (!firedRef.current) {
          observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => entry.isIntersecting && trigger()),
            { threshold }
          );
          observer.observe(ref.current);
        }
        window.addEventListener("scroll", checkScroll, { passive: true });
        window.addEventListener("resize", checkScroll);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}
