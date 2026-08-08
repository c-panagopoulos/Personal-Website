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
  if (!sources?.length) return null;
  return (
    <div className="retrieved-chunks">
      {sources.map((src, i) => (
        <div className="retrieved-chunk" key={`${src.source}-${i}`}>
          <div className="retrieved-chunk__head">
            <span className="retrieved-chunk__source">{src.source}</span>
            <span className="retrieved-chunk__score">{src.score.toFixed(2)}</span>
          </div>
          <p className="retrieved-chunk__snippet">{src.snippet}</p>
        </div>
      ))}
      {typeof threshold === "number" && (
        <div className="retrieved-chunks__threshold">min similarity ≥ {threshold.toFixed(2)}</div>
      )}
    </div>
  );
}
