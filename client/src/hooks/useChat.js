import { useCallback, useRef, useState } from "react";
import { streamChat } from "../lib/api.js";

const emptyTurn = () => ({
  question: "",
  isRetrieving: false,
  isThinking: false,
  sources: [],
  showSources: false,
  text: "",
  hasText: false,
  done: false,
  error: null,
});

// A list of turns, not one flat turn — so a caller that wants the full
// back-and-forth (AssistantSection's scrollable chat) can render `history`,
// while a caller that only ever shows the latest exchange (Hero's inline
// preview, StackSection's own instance) keeps working unchanged against the
// spread-out "current turn" fields, which are just a view over the last item.
export function useChat() {
  const [turns, setTurns] = useState([]);
  const controllerRef = useRef(null);

  const updateLast = useCallback((updater) => {
    setTurns((prev) => {
      if (!prev.length) return prev;
      const next = [...prev];
      next[next.length - 1] = updater(next[next.length - 1]);
      return next;
    });
  }, []);

  const ask = useCallback(
    (question) => {
      if (!question || !question.trim()) return;
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setTurns((prev) => [...prev, { ...emptyTurn(), question, isRetrieving: true }]);

      streamChat(
        question,
        {
          onSources: (sources) => {
            updateLast((t) => ({ ...t, isRetrieving: false, isThinking: true, sources, showSources: true }));
          },
          onToken: (token) => {
            updateLast((t) => ({ ...t, isThinking: false, hasText: true, text: t.text + token }));
          },
          onDone: () => {
            updateLast((t) => ({ ...t, isRetrieving: false, isThinking: false, done: true }));
          },
          onError: (message) => {
            updateLast((t) => ({ ...t, isRetrieving: false, isThinking: false, error: message, done: true }));
          },
        },
        controller.signal
      );
    },
    [updateLast]
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setTurns([]);
  }, []);

  const current = turns[turns.length - 1] ?? emptyTurn();

  return { ...current, open: turns.length > 0, history: turns, ask, reset };
}
