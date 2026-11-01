import { useSceneTrigger } from "../hooks/useSceneTrigger.js";

// Full-screen moment for one or more real numbers. Each stat's `label` is the
// plain-text reading of `value` for screen readers, since the visual may use symbols.
export default function StatMoment({ stats }) {
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
      <div className="statement__stats">
        {stats.map((stat, i) => (
          <figure className="statement__stat" key={stat.label}>
            <p className="statement__value" style={play(0.1 + i * 0.25)}>
              <span aria-hidden="true">{stat.value}</span>
              <span className="sr-only">{stat.label}</span>
            </p>
            <figcaption className="statement__caption" style={play(0.3 + i * 0.25)}>
              {stat.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
