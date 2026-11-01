import { useSceneTrigger } from "../hooks/useSceneTrigger.js";

// Full-screen moment for one real number. `label` is the plain-text reading of
// `value` for screen readers and search, since the visual may use symbols.
export default function StatMoment({ value, label, caption }) {
  const [ref, visible] = useSceneTrigger({ threshold: 0.35 });
  const play = (delay) => ({
    animation: `zoomSettle 0.9s cubic-bezier(0.16, 0.9, 0.2, 1) ${delay}s both`,
    animationPlayState: visible ? "running" : "paused",
  });

  return (
    <div className="statement" ref={ref}>
      <span
        aria-hidden="true"
        className="statement__vignette"
        style={{ animationPlayState: visible ? "running" : "paused" }}
      />
      <figure className="statement__stat">
        <p className="statement__value" aria-label={label} style={play(0.1)}>
          <span aria-hidden="true">{value}</span>
        </p>
        <figcaption className="statement__caption" style={play(0.3)}>
          {caption}
        </figcaption>
      </figure>
    </div>
  );
}
