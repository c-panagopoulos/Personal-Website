// Illustrative — the shape of a real request trace and usage pattern,
// not a live telemetry feed. Bar heights are fixed, not random, so the
// streak reads as consistent rather than noisy.
const DAY_BARS = [78, 92, 65, 88, 95, 70, 84, 91, 60, 87, 96, 73, 89, 94];

export default function TapStudyEvidence() {
  return (
    <div className="evidence-panel">
      <div className="evidence-panel__section">
        <div className="evidence-panel__label">SESSION FLOW</div>
        <div className="evidence-flow">
          <div className="evidence-flow__step">
            <span>tap → POST /sessions</span>
            <span className="evidence-flow__meta">202 · 38ms</span>
          </div>
          <div className="evidence-flow__step">
            <span>tap → PATCH /sessions/:id</span>
            <span className="evidence-flow__meta">200 · 24ms</span>
          </div>
        </div>
      </div>
      <div className="evidence-panel__section">
        <div className="evidence-panel__label">LAST 14 DAYS</div>
        <div className="evidence-chart">
          {DAY_BARS.map((h, i) => (
            <span className="evidence-chart__bar" key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="evidence-panel__section">
        <div className="evidence-metric">
          <span className="evidence-metric__value">731</span>
          <span className="evidence-metric__caption">
            day streak
            <br />
            every morning since launch
          </span>
        </div>
      </div>
    </div>
  );
}
