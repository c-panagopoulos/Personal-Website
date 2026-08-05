// Ported from Aceternity's "Terminal" component (registry: terminal) to
// plain JS/JSX — keeps the real mechanics (character-by-character typing,
// per-command output reveal, bash token syntax highlighting, blinking
// cursor, IntersectionObserver-gated start on scroll-into-view) and drops
// the mechanical-keyboard sound effects, which depended on an audio asset
// this project doesn't ship.
import { useEffect, useMemo, useRef, useState } from "react";

function useInView(ref, once = true) {
  const [inView, setInView] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || (once && triggered.current)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          setInView(true);
          if (once) {
            triggered.current = true;
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once]);

  return inView;
}

const TOKEN_CLASS = {
  command: "tok-command",
  flag: "tok-flag",
  string: "tok-string",
  number: "tok-number",
  operator: "tok-operator",
  path: "tok-path",
  variable: "tok-variable",
  comment: "tok-comment",
  default: "tok-default",
};

function tokenizeBash(text) {
  const tokens = [];
  const words = text.split(/(\s+)/);
  let isFirstWord = true;

  for (const word of words) {
    if (/^\s+$/.test(word)) {
      tokens.push({ type: "default", value: word });
      continue;
    }
    if (word.startsWith("#")) {
      tokens.push({ type: "comment", value: word });
      continue;
    }
    if (word.startsWith("$")) {
      tokens.push({ type: "variable", value: word });
      isFirstWord = false;
      continue;
    }
    if (word.startsWith("--") || word.startsWith("-")) {
      tokens.push({ type: "flag", value: word });
      isFirstWord = false;
      continue;
    }
    if (/^["'].*["']$/.test(word)) {
      tokens.push({ type: "string", value: word });
      isFirstWord = false;
      continue;
    }
    if (/^\d+$/.test(word)) {
      tokens.push({ type: "number", value: word });
      isFirstWord = false;
      continue;
    }
    if (/^[|>&<]+$/.test(word)) {
      tokens.push({ type: "operator", value: word });
      isFirstWord = true;
      continue;
    }
    if (word.includes("/") || word.startsWith(".") || word.startsWith("~")) {
      tokens.push({ type: "path", value: word });
      isFirstWord = false;
      continue;
    }
    if (isFirstWord) {
      tokens.push({ type: "command", value: word });
      isFirstWord = false;
      continue;
    }
    tokens.push({ type: "default", value: word });
  }

  return tokens;
}

function SyntaxHighlightedText({ text }) {
  return tokenizeBash(text).map((token, i) => (
    <span key={i} className={TOKEN_CLASS[token.type]}>
      {token.value}
    </span>
  ));
}

export default function Terminal({
  commands = ["npx shadcn@latest init"],
  outputs = {},
  username = "guest",
  className = "",
  typingSpeed = 50,
  delayBetweenCommands = 800,
  initialDelay = 500,
}) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const inView = useInView(containerRef);

  const [lines, setLines] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [commandIdx, setCommandIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [outputIdx, setOutputIdx] = useState(-1);
  const [phase, setPhase] = useState("idle");
  const [cursorVisible, setCursorVisible] = useState(true);

  const currentCommand = commands[commandIdx] || "";
  const currentOutputs = useMemo(() => outputs[commandIdx] || [], [outputs, commandIdx]);
  const isLastCommand = commandIdx === commands.length - 1;

  useEffect(() => {
    if (!inView || phase !== "idle") return undefined;
    const t = setTimeout(() => setPhase("typing"), initialDelay);
    return () => clearTimeout(t);
  }, [inView, phase, initialDelay]);

  useEffect(() => {
    if (phase !== "typing") return undefined;
    if (charIdx < currentCommand.length) {
      const t = setTimeout(() => {
        setCurrentText(currentCommand.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, typingSpeed + Math.random() * 30);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("executing"), 80);
    return () => clearTimeout(t);
  }, [phase, charIdx, currentCommand, typingSpeed]);

  useEffect(() => {
    if (phase !== "executing") return;
    setLines((prev) => [...prev, { type: "command", content: currentCommand }]);
    setCurrentText("");
    if (currentOutputs.length > 0) {
      setOutputIdx(0);
      setPhase("outputting");
    } else if (isLastCommand) {
      setPhase("done");
    } else {
      setPhase("pausing");
    }
  }, [phase, currentCommand, currentOutputs.length, isLastCommand]);

  useEffect(() => {
    if (phase !== "outputting") return undefined;
    if (outputIdx >= 0 && outputIdx < currentOutputs.length) {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, { type: "output", content: currentOutputs[outputIdx] }]);
        setOutputIdx((i) => i + 1);
      }, 150);
      return () => clearTimeout(t);
    }
    if (outputIdx >= currentOutputs.length) {
      const t = setTimeout(() => {
        setPhase(isLastCommand ? "done" : "pausing");
      }, 300);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase, outputIdx, currentOutputs, isLastCommand]);

  useEffect(() => {
    if (phase !== "pausing") return undefined;
    const t = setTimeout(() => {
      setCharIdx(0);
      setOutputIdx(-1);
      setCommandIdx((c) => c + 1);
      setPhase("typing");
    }, delayBetweenCommands);
    return () => clearTimeout(t);
  }, [phase, delayBetweenCommands]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines, phase]);

  const prompt = (
    <span className="terminal__prompt">
      <span className="terminal__prompt-user">{username}</span>
      <span className="terminal__prompt-colon">:</span>
      <span className="terminal__prompt-tilde">~</span>
      <span className="terminal__prompt-dollar">$</span>{" "}
    </span>
  );

  return (
    <div ref={containerRef} className={["terminal", className].filter(Boolean).join(" ")}>
      <div className="terminal__frame">
        <div className="terminal__bar">
          <div className="terminal__dots">
            <div className="terminal__dot terminal__dot--red" />
            <div className="terminal__dot terminal__dot--yellow" />
            <div className="terminal__dot terminal__dot--green" />
          </div>
          <div className="terminal__bar-title">
            <span>{username} — bash</span>
          </div>
          <div className="terminal__bar-spacer" />
        </div>

        <div ref={contentRef} className="terminal__body">
          {lines.map((line, i) => (
            <div key={i} className="terminal__line">
              {line.type === "command" ? (
                <span>
                  {prompt}
                  <SyntaxHighlightedText text={line.content} />
                </span>
              ) : (
                <span className="terminal__output">{line.content}</span>
              )}
            </div>
          ))}

          {phase === "typing" && (
            <div className="terminal__line">
              {prompt}
              <SyntaxHighlightedText text={currentText} />
              <span className="terminal__cursor" />
            </div>
          )}

          {(phase === "done" || phase === "pausing" || phase === "outputting") && (
            <div className="terminal__line">
              {prompt}
              <span className={["terminal__cursor", !cursorVisible && "terminal__cursor--hidden"].filter(Boolean).join(" ")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
