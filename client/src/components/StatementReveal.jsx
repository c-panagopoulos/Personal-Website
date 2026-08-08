import { useSceneTrigger } from "../hooks/useSceneTrigger.js";

// Cinematic zoom-settle + a radial vignette flash, once per block, replacing
// the old scroll-driven diagonal-stripe mask reveal. The vignette is
// position:fixed (true viewport edges) rather than absolute inside the
// padded/max-width text column — an absolute inset:0 there only reaches the
// column's own box, which reads as a visible dark rectangle instead of a
// full-bleed spotlight fading into the section background.
export default function StatementReveal({ as: Tag = "h2", lines, align = "left", style, ...rest }) {
  const [ref, visible] = useSceneTrigger({ threshold: 0.35 });
  const isCenter = align === "center";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <span
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: `radial-gradient(circle at ${isCenter ? "50% 50%" : "30% 50%"}, transparent 40%, rgba(0, 0, 0, 0.85) 100%)`,
          animation: "vignettePulse 1.6s ease-out 0.05s both",
          animationPlayState: visible ? "running" : "paused",
        }}
      />
      <Tag
        className="statement__text"
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: isCenter ? "center" : "left",
          margin: isCenter ? "0 auto" : 0,
          ...style,
        }}
        {...rest}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            style={{
              display: "block",
              transformOrigin: isCenter ? "center" : "left center",
              animation: `zoomSettle 0.9s cubic-bezier(0.16, 0.9, 0.2, 1) ${0.1 + i * 0.16}s both`,
              animationPlayState: visible ? "running" : "paused",
            }}
          >
            {line}
          </span>
        ))}
      </Tag>
    </div>
  );
}
