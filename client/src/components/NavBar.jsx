import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "./ResizableNavbar.jsx";

const LINKS = [
  { name: "work", link: "#scene-01" },
  { name: "assistant", link: "#assistant" },
  { name: "stack", link: "#stack" },
  { name: "homelab", link: "#homelab" },
  { name: "contact", link: "#contact" },
];

function Brand({ visible }) {
  return (
    <div className="nav__brand">
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
    </div>
  );
}

export default function NavBar({ style }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Navbar style={style}>
      <NavBody>
        <Brand />
        <NavItems items={LINKS} />
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
              className="resizable-navbar__mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
