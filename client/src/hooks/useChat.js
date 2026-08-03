import { useCallback, useRef, useState } from "react";
import { streamChat } from "../lib/api.js";

const initialState = {
  open: false,
  question: "",
  isRetrieving: false,
  isThinking: false,
  sources: [],
  showSources: false,
  text: "",
  hasText: false,
  done: false,
  error: null,
};

export function useChat() {
  const [state, setState] = useState(initialState);
  const controllerRef = useRef(null);

  const ask = useCallback((question) => {
    if (!question || !question.trim()) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({
      ...initialState,
      open: true,
      question,
      isRetrieving: true,
    });

    streamChat(
      question,
      {
        onSources: (sources) => {
          setState((s) => ({
            ...s,
            isRetrieving: false,
            isThinking: true,
            sources,
            showSources: true,
          }));
        },
        onToken: (token) => {
          setState((s) => ({
            ...s,
            isThinking: false,
            hasText: true,
            text: s.text + token,
          }));
        },
        onDone: () => {
          setState((s) => ({ ...s, isRetrieving: false, isThinking: false, done: true }));
        },
        onError: (message) => {
          setState((s) => ({
            ...s,
            isRetrieving: false,
            isThinking: false,
            error: message,
            done: true,
          }));
        },
      },
      controller.signal
    );
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setState(initialState);
  }, []);

  return { ...state, ask, reset };
}
