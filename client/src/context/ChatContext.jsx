import { createContext, useContext } from "react";
import { useChat } from "../hooks/useChat.js";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const chat = useChat();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useSharedChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useSharedChat must be used within a ChatProvider");
  return ctx;
}
