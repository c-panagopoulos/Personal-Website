import { useCallback, useEffect, useRef, useState } from "react";

export function RetrievalStatus({ note }) {
  return (
    <div className="retrieval-status">
      <div className="retrieval-status__chips">
        <span className="shimmer-chip" style={{ width: 132 }} />
        <span className="shimmer-chip" style={{ width: 92, animationDelay: "0.2s" }} />
        <span className="shimmer-chip" style={{ width: 110, animationDelay: "0.4s" }} />
      </div>
      <span className="retrieval-status__note">{note}</span>
    </div>
  );
}

export function ThinkingDots({ note }) {
  return (
    <div className="thinking-dots">
      <div className="thinking-dots__row">
        <span className="thinking-dots__dot" />
        <span className="thinking-dots__dot" style={{ animationDelay: "0.18s" }} />
        <span className="thinking-dots__dot" style={{ animationDelay: "0.36s" }} />
      </div>
      <span className="thinking-dots__note">{note}</span>
    </div>
  );
}

export function SourceChips({ sources }) {
  if (!sources?.length) return null;
  return (
    <div className="source-chips">
      {sources.map((src) => (
        <span className="source-chip" key={src.source}>
          {src.source}
        </span>
      ))}
    </div>
  );
}

export function RetrievedChunks({ sources, threshold }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [rail, setRail] = useState(null);
  const listRef = useRef(null);

  const updateRail = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight + 1) {
      setRail(null);
      return;
    }
    const heightPct = Math.max((clientHeight / scrollHeight) * 100, 8);
    const maxTop = 100 - heightPct;
    const topPct = maxTop <= 0 ? 0 : (scrollTop / (scrollHeight - clientHeight)) * maxTop;
    setRail({ top: topPct, height: heightPct });
  }, []);

  // Re-measure whenever the chunk list itself changes (new question) or an
  // entry expands/collapses (changes the list's scrollHeight without firing
  // a scroll event on its own).
  useEffect(() => {
    updateRail();
  }, [sources, expandedIndex, updateRail]);

  if (!sources?.length) return null;

  return (
    <div className="retrieved-chunks-card">
      <div className="retrieved-chunks-card__head">
        <span className="assistant-section__sidebar-block-label">RETRIEVED CHUNKS</span>
        <span className="retrieved-chunks-card__count">{sources.length}</span>
      </div>
      <div className="retrieved-chunks-card__body">
        <div
          className={"retrieved-chunks" + (rail ? " retrieved-chunks--overflowing" : "")}
          ref={listRef}
          onScroll={updateRail}
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
              >
                <div className="retrieved-chunk__head">
                  <span className="retrieved-chunk__source">{src.source}</span>
                  <span className="retrieved-chunk__score">{src.score.toFixed(2)}</span>
                </div>
                <div className="retrieved-chunk__bar">
                  <div className="retrieved-chunk__bar-fill" style={{ width: `${Math.round(src.score * 100)}%` }} />
                </div>
                <p className={"retrieved-chunk__snippet" + (isExpanded ? " retrieved-chunk__snippet--full" : "")}>
                  {isExpanded ? src.content : src.snippet}
                </p>
              </button>
            );
          })}
        </div>
        {rail && (
          <div className="retrieved-chunks__rail">
            <div
              className="retrieved-chunks__rail-thumb"
              style={{ top: `${rail.top}%`, height: `${rail.height}%` }}
            />
          </div>
        )}
      </div>
      {typeof threshold === "number" && (
        <div className="retrieved-chunks__threshold">min similarity ≥ {threshold.toFixed(2)}</div>
      )}
    </div>
  );
}
