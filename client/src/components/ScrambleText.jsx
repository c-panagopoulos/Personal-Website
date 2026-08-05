import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&01";
const FRAMES = 14;
const FRAME_MS = 35;
const LINE_STAGGER_MS = 120;

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function scramble(text) {
  return text
    .split("")
    .map((c) => (c === " " ? " " : randomChar()))
    .join("");
}

export default function ScrambleText({ lines, as: Tag = "span" }) {
  const [display, setDisplay] = useState(() => lines.map(scramble));
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || startedRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || startedRef.current) return;
          startedRef.current = true;
          observer.disconnect();

          lines.forEach((line, lineIndex) => {
            setTimeout(() => {
              let frame = 0;
              const iv = setInterval(() => {
                frame++;
                const revealCount = Math.floor((frame / FRAMES) * line.length);
                setDisplay((prev) => {
                  const next = [...prev];
                  next[lineIndex] = line
                    .split("")
                    .map((c, i) => (c === " " ? " " : i < revealCount ? c : randomChar()))
                    .join("");
                  return next;
                });
                if (frame >= FRAMES) {
                  clearInterval(iv);
                  setDisplay((prev) => {
                    const next = [...prev];
                    next[lineIndex] = line;
                    return next;
                  });
                }
              }, FRAME_MS);
            }, lineIndex * LINE_STAGGER_MS);
          });
        });
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lines]);

  return (
    <Tag ref={ref}>
      {display.map((line, i) => (
        <span key={i}>
          {line}
          {i < display.length - 1 && <br />}
        </span>
      ))}
    </Tag>
  );
}
