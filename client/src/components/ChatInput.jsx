import { useState } from "react";

export default function ChatInput({ onSend, placeholder, disabled, variant = "hero" }) {
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
        <span className="chat-input__prompt">&gt;</span>
        <input
          className="assistant-input__field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button className="assistant-input__send" onClick={send} disabled={disabled}>
          ENTER
        </button>
      </div>
    );
  }

  return (
    <div className="chat-input">
      <span className="chat-input__prompt">❯</span>
      <input
        className="chat-input__field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <button className="chat-input__send" onClick={send} disabled={disabled}>
        ↑
      </button>
    </div>
  );
}
