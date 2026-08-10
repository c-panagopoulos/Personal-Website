import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&01";
const FRAMES = 18;
const DEFAULT_FRAME_MS = 65;
const DEFAULT_LINE_STAGGER_MS = 180;

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function scramble(text) {
  return text
    .split("")
    .map((c) => (c === " " ? " " : randomChar()))
    .join("");
}

export default function ScrambleText({
  lines,
  as: Tag = "span",
  frameMs = DEFAULT_FRAME_MS,
  lineStaggerMs = DEFAULT_LINE_STAGGER_MS,
}) {
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
              }, frameMs);
            }, lineIndex * lineStaggerMs);
          });
        });
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lines]);

  return (
    <Tag ref={ref} aria-label={lines.join(" ")}>
      <span aria-hidden="true">
        {display.map((line, i) => (
          <span key={i}>
            {line}
            {i < display.length - 1 && <br />}
          </span>
        ))}
      </span>
    </Tag>
  );
}
