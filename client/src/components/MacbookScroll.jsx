import { useEffect, useRef, useState } from "react";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function interpolate(t, inputRange, outputRange) {
  if (t <= inputRange[0]) return outputRange[0];
  const last = inputRange.length - 1;
  if (t >= inputRange[last]) return outputRange[last];
  for (let i = 0; i < last; i++) {
    if (t >= inputRange[i] && t <= inputRange[i + 1]) {
      const localT = (t - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return outputRange[i] + (outputRange[i + 1] - outputRange[i]) * localT;
    }
  }
  return outputRange[last];
}

function useScrollProgress(ref) {
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [progress, setProgress] = useState(prefersReducedMotion ? 1 : 0);
  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    let raf = null;
    const update = () => {
      raf = null;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setProgress(rect.height > 0 ? clamp(-rect.top / rect.height, 0, 1) : 0);
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return progress;
}

export default function MacbookScroll({ src, alt, title }) {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);

  const scaleX = interpolate(progress, [0, 0.3], [1.2, 1.5]);
  const scaleY = interpolate(progress, [0, 0.3], [0.6, 1.5]);
  const translateY = interpolate(progress, [0, 1], [0, 1500]);
  const rotate = interpolate(progress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTranslate = interpolate(progress, [0, 0.3], [0, 100]);
  const textOpacity = interpolate(progress, [0, 0.2], [1, 0]);

  return (
    <div className="macbook-scroll-wrap">
    <div ref={ref} className="macbook-scroll">
      <h2
        className="macbook-scroll__title"
        style={{ transform: `translateY(${textTranslate}px)`, opacity: textOpacity }}
      >
        {title || (
          <>
            tapstudy runs on a tap.
            <br />
            no kidding.
          </>
        )}
      </h2>

      <div className="macbook-scroll__lid-wrap">
        <div className="macbook-scroll__lid-back" style={{ opacity: 1 - clamp(progress / 0.12, 0, 1) }}>
          <div className="macbook-scroll__lid-back-inner">
            <BrandMark />
          </div>
        </div>
        <div
          className="macbook-scroll__lid-front"
          style={{
            transform: `translateY(${translateY}px) scaleX(${scaleX}) scaleY(${scaleY}) rotateX(${rotate}deg)`,
          }}
        >
          <div className="macbook-scroll__lid-front-bg" />
          <img className="macbook-scroll__screen-img" src={src} alt={alt} />
        </div>
      </div>

      <div className="macbook-scroll__base">
        <div className="macbook-scroll__hinge-row">
          <div className="macbook-scroll__hinge-notch" />
        </div>
        <div className="macbook-scroll__deck-row">
          <div className="macbook-scroll__speaker-col">
            <SpeakerGrid />
          </div>
          <div className="macbook-scroll__keypad-col">
            <Keypad />
          </div>
          <div className="macbook-scroll__speaker-col">
            <SpeakerGrid />
          </div>
        </div>
        <div className="macbook-scroll__trackpad">
          <div
            className="macbook-scroll__nfc"
            style={{ opacity: clamp((progress - 0.75) / 0.25, 0, 1) }}
          >
            <span className="macbook-scroll__nfc-ring" />
            <span className="macbook-scroll__nfc-ring macbook-scroll__nfc-ring--delay" />
            <span className="macbook-scroll__nfc-dot" />
          </div>
        </div>
        <div className="macbook-scroll__chin" />
      </div>
    </div>
    </div>
  );
}

function KBtn({ style, labelStyle, children }) {
  return (
    <div className="kbtn">
      <div className="kbtn__face" style={style}>
        <div className="kbtn__label" style={labelStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Keypad() {
  const fRow = ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];
  const num2 = ["~ `", "! 1", "@ 2", "# 3", "$ 4", "% 5", "^ 6", "& 7", "* 8", "( 9", ") 0", "— _", "+ ="];
  const qwerty = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{ [", "} ]", "| \\"];
  const home = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ": ;", `" '`];
  const bottom = ["Z", "X", "C", "V", "B", "N", "M", "< ,", "> .", "? /"];

  const twoLine = (label) => {
    const [top, bottom2] = label.split(" ");
    return (
      <>
        <span>{top}</span>
        <span>{bottom2}</span>
      </>
    );
  };

  return (
    <div className="macbook-scroll__keypad">
      <div className="macbook-scroll__krow">
        <KBtn style={{ width: 40, alignItems: "flex-end", justifyContent: "flex-start", paddingLeft: 4, paddingBottom: 2 }}>
          esc
        </KBtn>
        {fRow.slice(1).map((label) => (
          <KBtn key={label}>{label}</KBtn>
        ))}
      </div>

      <div className="macbook-scroll__krow">
        {num2.map((label) => (
          <KBtn key={label}>{twoLine(label)}</KBtn>
        ))}
        <KBtn style={{ width: 40, alignItems: "flex-end", justifyContent: "flex-end", paddingRight: 4, paddingBottom: 2 }}>
          delete
        </KBtn>
      </div>

      <div className="macbook-scroll__krow">
        <KBtn style={{ width: 40, alignItems: "flex-end", justifyContent: "flex-start", paddingLeft: 4, paddingBottom: 2 }}>
          tab
        </KBtn>
        {qwerty.map((label) => (
          <KBtn key={label}>{label.includes(" ") ? twoLine(label) : label}</KBtn>
        ))}
      </div>

      <div className="macbook-scroll__krow">
        <KBtn style={{ width: 45, alignItems: "flex-end", justifyContent: "flex-start", paddingLeft: 4, paddingBottom: 2 }}>
          caps lock
        </KBtn>
        {home.map((label) => (
          <KBtn key={label}>{label.includes(" ") ? twoLine(label) : label}</KBtn>
        ))}
        <KBtn style={{ width: 46, alignItems: "flex-end", justifyContent: "flex-end", paddingRight: 4, paddingBottom: 2 }}>
          return
        </KBtn>
      </div>

      <div className="macbook-scroll__krow">
        <KBtn style={{ width: 58, alignItems: "flex-end", justifyContent: "flex-start", paddingLeft: 4, paddingBottom: 2 }}>
          shift
        </KBtn>
        {bottom.map((label) => (
          <KBtn key={label}>{label.includes(" ") ? twoLine(label) : label}</KBtn>
        ))}
        <KBtn style={{ width: 58, alignItems: "flex-end", justifyContent: "flex-end", paddingRight: 4, paddingBottom: 2 }}>
          shift
        </KBtn>
      </div>

      <div className="macbook-scroll__krow">
        <KBtn labelStyle={{ height: "100%", justifyContent: "space-between", padding: "4px 0" }}>
          <div className="kbtn__split"><span>fn</span></div>
          <div className="kbtn__split"><span>◯</span></div>
        </KBtn>
        <KBtn labelStyle={{ height: "100%", justifyContent: "space-between", padding: "4px 0" }}>
          <div className="kbtn__split"><span>⌃</span></div>
          <div className="kbtn__split"><span>control</span></div>
        </KBtn>
        <KBtn labelStyle={{ height: "100%", justifyContent: "space-between", padding: "4px 0" }}>
          <div className="kbtn__split"><span>⌥</span></div>
          <div className="kbtn__split"><span>option</span></div>
        </KBtn>
        <KBtn style={{ width: 32 }} labelStyle={{ height: "100%", justifyContent: "space-between", padding: "4px 0" }}>
          <div className="kbtn__split"><span>⌘</span></div>
          <div className="kbtn__split"><span>command</span></div>
        </KBtn>
        <KBtn style={{ width: 131 }} />
        <KBtn style={{ width: 32 }} labelStyle={{ height: "100%", justifyContent: "space-between", padding: "4px 0" }}>
          <div className="kbtn__split"><span>⌘</span></div>
          <div className="kbtn__split"><span>command</span></div>
        </KBtn>
        <KBtn labelStyle={{ height: "100%", justifyContent: "space-between", padding: "4px 0" }}>
          <div className="kbtn__split"><span>⌥</span></div>
          <div className="kbtn__split"><span>option</span></div>
        </KBtn>
        <div className="macbook-scroll__arrows">
          <KBtn style={{ height: 12, width: 24 }}>▲</KBtn>
          <div className="macbook-scroll__arrows-row">
            <KBtn style={{ height: 12, width: 24 }}>◀</KBtn>
            <KBtn style={{ height: 12, width: 24 }}>▼</KBtn>
            <KBtn style={{ height: 12, width: 24 }}>▶</KBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeakerGrid() {
  return <div className="macbook-scroll__speaker-grid" />;
}

function BrandMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 66 65" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
}
