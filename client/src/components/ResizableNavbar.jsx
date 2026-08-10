// Ported from Aceternity UI's "Resizable Navbar" to plain JS — no
// TypeScript, no Tailwind, no @tabler/icons-react (inline SVGs instead).
// `motion` was already a real dependency (MotionCarousel), so the scroll-
// driven shrink animation and the hover-highlight/mobile-menu transitions
// are kept exactly as built: framer-motion springs, not CSS transitions.
import { useEffect, useRef, useState, Children, isValidElement, cloneElement } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";

export function Navbar({ children, className = "", style }) {
  const ref = useRef(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  // Exposed as a CSS var so viewport-height sections (e.g. the assistant
  // section) can subtract the nav's real rendered height instead of a fixed
  // 100vh — the nav is sticky and still reserves its own flow space above
  // any section below it, so a plain 100vh section plus this nav always
  // overflows the viewport by exactly the nav's height.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setNavHeightVar = () => {
      document.documentElement.style.setProperty("--nav-height", `${el.getBoundingClientRect().height}px`);
    };
    setNavHeightVar();
    const observer = new ResizeObserver(setNavHeightVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav ref={ref} aria-label="Primary" className={`resizable-navbar ${className}`} style={style}>
      {Children.map(children, (child) => (isValidElement(child) ? cloneElement(child, { visible }) : child))}
    </motion.nav>
  );
}

export function NavBody({ children, className = "", visible }) {
  return (
    <motion.div
      animate={{
        boxShadow: visible ? "0 14px 44px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(211, 218, 217, 0.16)" : "none",
        width: visible ? "42%" : "100%",
        y: visible ? 14 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      style={{ minWidth: 460 }}
      className={`resizable-navbar__body ${visible ? "resizable-navbar__body--visible" : "resizable-navbar__body--wide"} ${className}`}
    >
      {/* Match the original: NavBody clones `visible` onto its own children
          too, so the logo/items can compact themselves as it shrinks. */}
      {Children.map(children, (child) => (isValidElement(child) ? cloneElement(child, { visible }) : child))}
    </motion.div>
  );
}

export function NavItems({ items, className = "", onItemClick, visible, activeLink }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={`resizable-navbar__items ${visible ? "resizable-navbar__items--compact" : "resizable-navbar__items--edge"} ${className}`}
    >
      {items.map((item, idx) => (
        <a
          key={item.link}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={`resizable-navbar__item ${item.link === activeLink ? "resizable-navbar__item--active" : ""}`}
        >
          {hovered === idx && (
            <motion.div layoutId="resizable-navbar-hover" className="resizable-navbar__item-highlight" />
          )}
          <span className="resizable-navbar__item-label">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
}

export function MobileNav({ children, className = "", visible }) {
  return (
    <motion.div
      animate={{
        boxShadow: visible ? "0 14px 44px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(211, 218, 217, 0.16)" : "none",
        width: visible ? "94%" : "100%",
        borderRadius: visible ? "16px" : "22px",
        y: visible ? 14 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={`resizable-navbar__mobile ${visible ? "resizable-navbar__mobile--visible" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function MobileNavHeader({ children, className = "" }) {
  return <div className={`resizable-navbar__mobile-header ${className}`}>{children}</div>;
}

export function MobileNavMenu({ children, className = "", isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-nav-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`resizable-navbar__mobile-menu ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MobileNavToggle({ isOpen, onClick }) {
  return (
    <button
      type="button"
      className="resizable-navbar__toggle"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-menu"
    >
      {isOpen ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      )}
    </button>
  );
}
