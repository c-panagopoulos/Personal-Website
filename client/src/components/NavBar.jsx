import { useEffect, useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "./ResizableNavbar.jsx";

// Order matches the actual page flow (assistant, then homelab, then stack) —
// a mismatch here previously made the highlighted item jump around oddly
// once scroll-spy landed on whichever section the visitor was really in.
const LINKS = [
  { name: "work", link: "#scene-01" },
  { name: "assistant", link: "#assistant" },
  { name: "homelab", link: "#homelab" },
  { name: "stack", link: "#stack" },
  { name: "contact", link: "#contact" },
];

const SECTION_IDS = LINKS.map((item) => item.link.slice(1));

// Whichever section's top has scrolled past the nav is "current" — not a
// one-shot IntersectionObserver trigger, since this needs to keep tracking
// as the visitor scrolls back and forth, and "work" should stay highlighted
// across both project scenes between the scene-01 and assistant anchors.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;

    let ticking = false;
    const update = () => {
      ticking = false;
      // At the very bottom of the page the last section's top can never
      // cross the offset line if it's shorter than a viewport, since the
      // browser stops scrolling once it runs out of document — without this
      // check, the last nav item can never light up.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(els[els.length - 1].id);
        return;
      }
      const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 0;
      const offset = navHeight + 48;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - offset <= 0) current = el.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}

function scrollToTarget(el) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

// Shared by both the desktop pill nav and the mobile menu links — reads the
// href straight off the clicked anchor instead of needing per-item handlers.
function handleNavClick(event) {
  const href = event.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#")) return;
  const el = document.querySelector(href);
  if (!el) return;
  event.preventDefault();
  scrollToTarget(el);
}

function scrollToTop(event) {
  event.preventDefault();
  // Scrolls the top of #main into view rather than calling window.scrollTo
  // directly — same scrollIntoView path as the nav links above, kept
  // consistent rather than mixing two different smooth-scroll APIs.
  const el = document.getElementById("main") || document.body;
  scrollToTarget(el);
}

function Brand({ visible }) {
  return (
    <button type="button" className="nav__brand" onClick={scrollToTop} aria-label="Scroll to top">
      <span className="nav__bracket">
        <span className="nav__bracket-edge">[</span>
        <span className="nav__bracket-id">cp</span>
        <span className="nav__bracket-edge">]</span>
      </span>
      {!visible && (
        <span className="nav__name">
          panagopoulos<span>.dev</span>
        </span>
      )}
    </button>
  );
}

export default function NavBar({ style }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const activeLink = `#${activeId}`;

  return (
    <Navbar style={style}>
      <NavBody>
        <Brand />
        <NavItems items={LINKS} activeLink={activeLink} onItemClick={handleNavClick} />
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <Brand />
          <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileOpen}>
          {LINKS.map((item) => (
            <a
              key={item.link}
              href={item.link}
              className={`resizable-navbar__mobile-link ${item.link === activeLink ? "resizable-navbar__mobile-link--active" : ""}`}
              onClick={(event) => {
                handleNavClick(event);
                setMobileOpen(false);
              }}
            >
              {item.name}
            </a>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
