// Ported from React Bits' DotField (JS + CSS variant) — already plain JS,
// zero dependencies (canvas 2D). Styling lives in global.css
// (.dot-field-container) instead of a separate stylesheet, to match how the
// rest of this project's CSS is organized. Glow effect removed per request;
// only the cursor-proximity dot bulge remains.
import { useEffect, useRef, memo } from "react";

const TWO_PI = Math.PI * 2;

const DotField = memo(
  ({
    dotRadius = 1.5,
    dotSpacing = 14,
    cursorRadius = 500,
    cursorForce = 0.1,
    bulgeOnly = true,
    bulgeStrength = 67,
    sparkle = false,
    waveAmplitude = 0,
    gradientFrom = "rgba(211, 218, 217, 0.3)",
    gradientTo = "rgba(68, 68, 78, 0.4)",
    // "Thinking" ring: an expanding glow wave from the field's center,
    // looping while true. Independent of the cursor bulge above.
    pulseActive = false,
    pulseColor = "#9c8683",
    pulseSpeed = 1,
    ...rest
  }) => {
    const canvasRef = useRef(null);
    const dotsRef = useRef([]);
    const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 });
    const rafRef = useRef(null);
    const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 });
    const engagement = useRef(0);
    const propsRef = useRef({});
    propsRef.current = {
      dotRadius,
      dotSpacing,
      cursorRadius,
      cursorForce,
      bulgeOnly,
      bulgeStrength,
      sparkle,
      waveAmplitude,
      gradientFrom,
      gradientTo,
      pulseActive,
      pulseColor,
      pulseSpeed,
    };
    const rebuildRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: true });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let resizeTimer;

      function resize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(doResize, 100);
      }

      function doResize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        sizeRef.current = { w, h };

        buildDots(w, h);
      }

      function buildDots(w, h) {
        const p = propsRef.current;
        const step = p.dotRadius + p.dotSpacing;
        const cols = Math.floor(w / step);
        const rows = Math.floor(h / step);
        const padX = (w % step) / 2;
        const padY = (h % step) / 2;
        const dots = new Array(rows * cols);
        let idx = 0;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const ax = padX + col * step + step / 2;
            const ay = padY + row * step + step / 2;
            dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
          }
        }
        dotsRef.current = dots;
      }

      function onMouseMove(e) {
        // Measured fresh (not cached from the last resize) so a layout
        // shift elsewhere on the page — e.g. an element above this canvas
        // changing height — can't leave the cursor mapping stale; resize
        // and ResizeObserver only fire when this canvas's own box changes,
        // not when its position on the page moves.
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
      }

      function updateMouseSpeed() {
        const m = mouseRef.current;
        const dx = m.prevX - m.x;
        const dy = m.prevY - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        m.speed += (dist - m.speed) * 0.5;
        if (m.speed < 0.001) m.speed = 0;
        m.prevX = m.x;
        m.prevY = m.y;
      }

      const speedInterval = setInterval(updateMouseSpeed, 20);

      let frameCount = 0;

      function tick() {
        frameCount++;
        const dots = dotsRef.current;
        const m = mouseRef.current;
        const { w, h } = sizeRef.current;
        const p = propsRef.current;
        const len = dots.length;
        const t = frameCount * 0.02;

        // Proximity-based, not speed-based: the original decays engagement
        // to 0 the instant the cursor stops moving, which reads as "the
        // bulge doesn't work" on a still hover. Keep it active for as long
        // as the cursor is actually near the field.
        const withinField = m.x > -p.cursorRadius && m.x < w + p.cursorRadius && m.y > -p.cursorRadius && m.y < h + p.cursorRadius;
        const targetEngagement = withinField ? 1 : 0;
        engagement.current += (targetEngagement - engagement.current) * 0.12;
        if (engagement.current < 0.001) engagement.current = 0;
        const eng = engagement.current;

        ctx.clearRect(0, 0, w, h);

        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, p.gradientFrom);
        grad.addColorStop(1, p.gradientTo);
        ctx.fillStyle = grad;

        const cr = p.cursorRadius;
        const crSq = cr * cr;
        const rad = p.dotRadius / 2;
        const isBulge = p.bulgeOnly;

        ctx.beginPath();

        for (let i = 0; i < len; i++) {
          const d = dots[i];
          const dx = m.x - d.ax;
          const dy = m.y - d.ay;
          const distSq = dx * dx + dy * dy;

          if (distSq < crSq && eng > 0.01) {
            const dist = Math.sqrt(distSq);
            if (isBulge) {
              const tt = 1 - dist / cr;
              const push = tt * tt * p.bulgeStrength * eng;
              const angle = Math.atan2(dy, dx);
              d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
              d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
            } else {
              const angle = Math.atan2(dy, dx);
              const move = (500 / dist) * (m.speed * p.cursorForce);
              d.vx += Math.cos(angle) * -move;
              d.vy += Math.sin(angle) * -move;
            }
          } else if (isBulge) {
            d.sx += (d.ax - d.sx) * 0.1;
            d.sy += (d.ay - d.sy) * 0.1;
          }

          if (!isBulge) {
            d.vx *= 0.9;
            d.vy *= 0.9;
            d.x = d.ax + d.vx;
            d.y = d.ay + d.vy;
            d.sx += (d.x - d.sx) * 0.1;
            d.sy += (d.y - d.sy) * 0.1;
          }

          let drawX = d.sx;
          let drawY = d.sy;
          if (p.waveAmplitude > 0) {
            drawY += Math.sin(d.ax * 0.03 + t) * p.waveAmplitude;
            drawX += Math.cos(d.ay * 0.03 + t * 0.7) * p.waveAmplitude * 0.5;
          }

          if (p.sparkle) {
            const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0;
            if (hash % 100 < 3) {
              ctx.moveTo(drawX + rad * 1.8, drawY);
              ctx.arc(drawX, drawY, rad * 1.8, 0, TWO_PI);
            } else {
              ctx.moveTo(drawX + rad, drawY);
              ctx.arc(drawX, drawY, rad, 0, TWO_PI);
            }
          } else {
            ctx.moveTo(drawX + rad, drawY);
            ctx.arc(drawX, drawY, rad, 0, TWO_PI);
          }

          if (p.pulseActive) {
            d.drawX = drawX;
            d.drawY = drawY;
          }
        }

        ctx.fill();

        if (p.pulseActive) {
          const cx = w / 2;
          const cy = h / 2;
          const maxRadius = Math.hypot(cx, cy);
          const cycleMs = 2200 / p.pulseSpeed;
          const waveRadius = ((performance.now() % cycleMs) / cycleMs) * maxRadius;
          const band = Math.max(30, maxRadius * 0.08);

          for (let i = 0; i < len; i++) {
            const d = dots[i];
            const dist = Math.hypot(d.drawX - cx, d.drawY - cy);
            const diff = Math.abs(dist - waveRadius);
            if (diff < band) {
              const strength = 1 - diff / band;
              ctx.globalAlpha = strength;
              ctx.beginPath();
              ctx.arc(d.drawX, d.drawY, rad * (1 + strength), 0, TWO_PI);
              ctx.fillStyle = p.pulseColor;
              ctx.fill();
            }
          }
          ctx.globalAlpha = 1;
        }

        rafRef.current = requestAnimationFrame(tick);
      }

      doResize();
      window.addEventListener("resize", resize);
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      rafRef.current = requestAnimationFrame(tick);

      // The original only re-measured on window resize, so a parent that
      // grows from its own content (e.g. a chat bubble expanding as text
      // streams in) left the dot field clipped to its initial, smaller size.
      const parentResizeObserver = new ResizeObserver(resize);
      parentResizeObserver.observe(canvas.parentElement);

      rebuildRef.current = () => {
        const { w, h } = sizeRef.current;
        if (w > 0 && h > 0) buildDots(w, h);
      };

      return () => {
        cancelAnimationFrame(rafRef.current);
        clearInterval(speedInterval);
        clearTimeout(resizeTimer);
        parentResizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMouseMove);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      rebuildRef.current?.();
    }, [dotRadius, dotSpacing]);

    return (
      <div className="dot-field-container" aria-hidden="true" {...rest}>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  }
);

DotField.displayName = "DotField";

export default DotField;
