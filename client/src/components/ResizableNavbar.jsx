// Ported from Aceternity UI's "Resizable Navbar" to plain JS — no
// TypeScript, no Tailwind, no @tabler/icons-react (inline SVGs instead).
// `motion` was already a real dependency (MotionCarousel), so the scroll-
// driven shrink animation and the hover-highlight/mobile-menu transitions
// are kept exactly as built: framer-motion springs, not CSS transitions.
import { useRef, useState, Children, isValidElement, cloneElement } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";

export function Navbar({ children, className = "" }) {
  const ref = useRef(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div ref={ref} className={`resizable-navbar ${className}`}>
      {Children.map(children, (child) => (isValidElement(child) ? cloneElement(child, { visible }) : child))}
    </motion.div>
  );
}

export function NavBody({ children, className = "", visible }) {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(12px)" : "none",
        boxShadow: visible ? "0 8px 32px rgba(2, 6, 16, 0.45), 0 0 0 1px rgba(211, 218, 217, 0.1)" : "none",
        width: visible ? "42%" : "100%",
        y: visible ? 14 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      style={{ minWidth: 460 }}
      className={`resizable-navbar__body ${visible ? "resizable-navbar__body--visible" : ""} ${className}`}
    >
      {/* Match the original: NavBody clones `visible` onto its own children
          too, so the logo/items can compact themselves as it shrinks. */}
      {Children.map(children, (child) => (isValidElement(child) ? cloneElement(child, { visible }) : child))}
    </motion.div>
  );
}

export function NavItems({ items, className = "", onItemClick, visible }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={`resizable-navbar__items ${visible ? "resizable-navbar__items--compact" : ""} ${className}`}
    >
      {items.map((item, idx) => (
        <a
          key={item.link}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="resizable-navbar__item"
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
        backdropFilter: visible ? "blur(12px)" : "none",
        boxShadow: visible ? "0 8px 32px rgba(2, 6, 16, 0.45), 0 0 0 1px rgba(211, 218, 217, 0.1)" : "none",
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
    <button type="button" className="resizable-navbar__toggle" onClick={onClick} aria-label={isOpen ? "Close menu" : "Open menu"}>
      {isOpen ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      )}
    </button>
  );
}
