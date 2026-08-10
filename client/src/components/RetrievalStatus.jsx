import { useCallback, useEffect, useRef, useState } from "react";

export function RetrievalStatus({ note }) {
  return (
    <div className="retrieval-status" role="status" aria-live="polite">
      <div className="retrieval-status__chips" aria-hidden="true">
        <span className="shimmer-chip" style={{ width: 132 }} />
        <span className="shimmer-chip" style={{ width: 92, animationDelay: "0.2s" }} />
        <span className="shimmer-chip" style={{ width: 110, animationDelay: "0.4s" }} />
      </div>
      <span className="retrieval-status__note">{note || "Searching…"}</span>
    </div>
  );
}

export function ThinkingDots({ note }) {
  return (
    <div className="thinking-dots" role="status" aria-live="polite">
      <div className="thinking-dots__row" aria-hidden="true">
        <span className="thinking-dots__dot" />
        <span className="thinking-dots__dot" style={{ animationDelay: "0.18s" }} />
        <span className="thinking-dots__dot" style={{ animationDelay: "0.36s" }} />
      </div>
      <span className="thinking-dots__note">{note || "Thinking…"}</span>
    </div>
  );
}

export function SourceChips({ sources }) {
  if (!sources?.length) return null;
  const uniqueSources = [...new Set(sources.map((src) => src.source))];
  return (
    <div className="source-chips">
      {uniqueSources.map((source) => (
        <span className="source-chip" key={source}>
          {source}
        </span>
      ))}
    </div>
  );
}

const COLLAPSED_SNIPPET_HEIGHT = "56px";

export function RetrievedChunks({ sources, threshold }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [overflowing, setOverflowing] = useState(false);
  const [fullHeights, setFullHeights] = useState({});
  const listRef = useRef(null);
  const snippetRefs = useRef([]);

  const checkOverflow = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    checkOverflow();
    const timer = setTimeout(checkOverflow, 320);
    return () => clearTimeout(timer);
  }, [sources, expandedIndex, checkOverflow]);

  useEffect(() => {
    const next = {};
    snippetRefs.current.forEach((el, i) => {
      if (!el) return;
      const marginTop = parseFloat(getComputedStyle(el).marginTop) || 0;
      next[i] = el.scrollHeight + marginTop;
    });
    setFullHeights(next);
  }, [sources]);

  if (!sources?.length) return null;

  return (
    <div className="retrieved-chunks-card">
      <div className="retrieved-chunks-card__head">
        <span className="assistant-section__sidebar-block-label">RETRIEVED CHUNKS</span>
        <span className="retrieved-chunks-card__count">{sources.length}</span>
      </div>
      <div
        className={"retrieved-chunks" + (overflowing ? " retrieved-chunks--overflowing" : "")}
        ref={listRef}
      >
        {sources.map((src, i) => {
          const isExpanded = expandedIndex === i;
          const isTop = i === 0;
          return (
            <button
              type="button"
              className={
                "retrieved-chunk" +
                (isTop ? " retrieved-chunk--top" : "") +
                (isExpanded ? " retrieved-chunk--expanded" : "")
              }
              key={`${src.source}-${i}`}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              aria-expanded={isExpanded}
            >
              <div className="retrieved-chunk__head">
                <span className="retrieved-chunk__source">{src.source}</span>
                <span className="retrieved-chunk__score">{src.score.toFixed(2)}</span>
              </div>
              <div className="retrieved-chunk__bar">
                <div className="retrieved-chunk__bar-fill" style={{ width: `${Math.round(src.score * 100)}%` }} />
              </div>
              <div
                className="retrieved-chunk__snippet-clip"
                style={{ maxHeight: isExpanded ? `${fullHeights[i] ?? 2000}px` : COLLAPSED_SNIPPET_HEIGHT }}
              >
                <p className="retrieved-chunk__snippet" ref={(el) => (snippetRefs.current[i] = el)}>
                  {src.content || src.snippet}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {typeof threshold === "number" && (
        <div className="retrieved-chunks__threshold">min similarity ≥ {threshold.toFixed(2)}</div>
      )}
    </div>
  );
}
