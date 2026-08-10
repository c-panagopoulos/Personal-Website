import { useState } from "react";
import { motion } from "motion/react";

// Ported from animate-ui's "send" icon (already used in Hermes's real admin
// UI) — not the full @animate-ui/icons package, which is built for
// shadcn/Tailwind/TS and wraps every icon in a generic animate-on-hover/
// tap/view state machine we don't need here. Just the SVG paths and the
// group's fly-off keyframes. The hover trigger lives on the surrounding
// <button> (see below), not on the icon's own <motion.g> — the paths are
// stroke-only (fill="none"), so hit-testing only registers directly over
// the thin stroke line, not the visually "solid" airplane shape; the
// button's own hover state propagates down to the icon via framer-motion's
// variant propagation instead.
const sendIconGroupVariants = {
  initial: { scale: 1, x: 0, y: 0 },
  animate: {
    scale: [1, 0.8, 1, 1, 1],
    x: [0, "-10%", "100%", "-125%", 0],
    y: [0, "10%", "-100%", "125%", 0],
    transition: {
      default: { ease: "easeInOut", duration: 1.2 },
      x: { ease: "easeInOut", duration: 1.2, times: [0, 0.25, 0.5, 0.5, 1] },
      y: { ease: "easeInOut", duration: 1.2, times: [0, 0.25, 0.5, 0.5, 1] },
    },
  },
};

function SendIcon({ size = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.g variants={sendIconGroupVariants}>
        <path d="M14.5,21.7c.1.3.4.4.7.3.1,0,.2-.2.3-.3L22,2.7c0-.3,0-.5-.3-.6-.1,0-.2,0-.3,0L2.3,8.5c-.3,0-.4.4-.3.6,0,.1.2.2.3.3l7.9,3.2c.5.2.9.6,1.1,1.1l3.2,7.9Z" />
        <path d="M21.9,2.1l-10.9,10.9" />
      </motion.g>
    </svg>
  );
}

export default function ChatInput({ onSend, placeholder, disabled, variant = "hero", promptExpanded = false, onPromptClick }) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") send();
  };

  if (variant === "assistant") {
    return (
      <div className="assistant-input">
        <span className="chat-input__prompt" aria-hidden="true">&gt;</span>
        <input
          className="assistant-input__field"
          aria-label={placeholder || "Ask a question"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <motion.button
          className="assistant-input__send"
          onClick={send}
          disabled={disabled}
          aria-label="Send"
          initial="initial"
          whileHover="animate"
        >
          <SendIcon />
        </motion.button>
      </div>
    );
  }

  const prompt = onPromptClick ? (
    <button
      type="button"
      className={"chat-input__prompt chat-input__prompt--toggle" + (promptExpanded ? " chat-input__prompt--open" : "")}
      onClick={onPromptClick}
      aria-label={promptExpanded ? "Collapse answer" : "Expand answer"}
      aria-expanded={promptExpanded}
    >
      ❯
    </button>
  ) : (
    <span className="chat-input__prompt" aria-hidden="true">❯</span>
  );

  return (
    <div className="chat-input">
      {prompt}
      <input
        className="chat-input__field"
        aria-label={placeholder || "Ask a question"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
      <motion.button
        className="chat-input__send"
        onClick={send}
        disabled={disabled}
        aria-label="Send"
        initial="initial"
        whileHover="animate"
      >
        <SendIcon />
      </motion.button>
    </div>
  );
}
