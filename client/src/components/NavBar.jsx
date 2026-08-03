export default function NavBar() {
  return (
    <nav className="nav">
      <div className="nav__brand">
        <div className="nav__mark">cp</div>
        <span className="nav__name">
          panagopoulos<span>.dev</span>
        </span>
        <span className="nav__name caret">_</span>
      </div>
      <div className="nav__links">
        <a href="#scene-01">work</a>
        <a href="#assistant">assistant</a>
        <a href="#stack">stack</a>
        <a href="#homelab">homelab</a>
        <a href="#contact">contact</a>
      </div>
    </nav>
  );
}
