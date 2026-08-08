import { useCallback, useRef, useState } from "react";
import { streamChat } from "../lib/api.js";

const emptyTurn = () => ({
  question: "",
  origin: null,
  isRetrieving: false,
  isThinking: false,
  sources: [],
  threshold: null,
  showSources: false,
  text: "",
  hasText: false,
  done: false,
  error: null,
});

// A list of turns, not one flat turn — so a caller that wants the full
// back-and-forth (AssistantSection's scrollable chat) can render `history`,
// while a caller that only ever shows the latest exchange (StackSection's
// own instance) keeps working unchanged against the spread-out "current
// turn" fields, which are just a view over the last item. Each turn also
// carries the `origin` string passed to `ask()` (or null) — Hero shares
// this same instance with AssistantSection so a question asked in Hero
// still shows up in the Intermission's full history, but Hero itself must
// not reflect the globally-latest turn if that turn was actually started
// from the Intermission's own composer — it looks up its own turn by
// origin instead of trusting `current`.
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
    (question, origin = null) => {
      if (!question || !question.trim()) return;
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setTurns((prev) => [...prev, { ...emptyTurn(), question, origin, isRetrieving: true }]);

      streamChat(
        question,
        {
          onSources: ({ chunks, threshold }) => {
            updateLast((t) => ({ ...t, isRetrieving: false, isThinking: true, sources: chunks, threshold, showSources: true }));
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
