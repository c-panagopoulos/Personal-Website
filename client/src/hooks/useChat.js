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
  provider: null,
  model: null,
});

const MAX_HISTORY_TURNS = 6;

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

      // Only completed, error-free turns count as history — a turn still
      // streaming or one that got flagged/failed has nothing coherent to
      // hand back to the model as its own prior answer.
      const historyPayload = turns
        .filter((t) => t.hasText && t.done && !t.error)
        .slice(-MAX_HISTORY_TURNS)
        .map((t) => ({ question: t.question, answer: t.text }));

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
          onDone: ({ provider, model } = {}) => {
            updateLast((t) => ({ ...t, isRetrieving: false, isThinking: false, done: true, provider, model }));
          },
          onError: (error) => {
            updateLast((t) => ({ ...t, isRetrieving: false, isThinking: false, text: "", hasText: false, error, done: true }));
          },
        },
        controller.signal,
        historyPayload
      );
    },
    [updateLast, turns]
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setTurns([]);
  }, []);

  const current = turns[turns.length - 1] ?? emptyTurn();

  return { ...current, open: turns.length > 0, history: turns, ask, reset };
}
