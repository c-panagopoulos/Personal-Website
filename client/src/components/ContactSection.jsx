import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

const LINKS = [
  { href: "mailto:contact@cpanagopoulos.dev", label: "EMAIL", value: "contact@cpanagopoulos.dev", external: false },
  { href: "https://github.com/c-panagopoulos", label: "GITHUB", value: "github.com/c-panagopoulos", external: true },
  { href: "https://www.linkedin.com/in/c-panagopoulos/", label: "LINKEDIN", value: "linkedin.com/in/c-panagopoulos", external: true },
];

export default function ContactSection() {
  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });

  return (
    <div id="contact" className="contact-section" ref={ref}>
      <div className="contact-section__eyebrow">
        <span className="contact-section__eyebrow-label" style={anim(visible, "rowRise", 0.4, 0.1)}>
          CONTACT
        </span>
        <span className="contact-section__eyebrow-rule" style={anim(visible, "ruleGrow", 0.6, 0.25)} />
      </div>
      <h2 className="contact-section__title" style={anim(visible, "titleWipe", 0.8, 0.6)}>
        Get in touch
      </h2>
      <p className="contact-section__body" style={anim(visible, "sceneRiseBlur", 0.65, 1.3)}>
        For an open role, a question about a project, or feedback on anything above. I usually reply within a day.
      </p>
      <div className="contact-grid">
        {LINKS.map((link, i) => (
          <a
            key={link.label}
            className="contact-link"
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            style={anim(visible, "linkRise", 0.5, 1.6 + i * 0.12)}
          >
            <span className="contact-link__label">{link.label}</span>
            <span className="contact-link__value">{link.value}</span>
          </a>
        ))}
      </div>
      <div className="contact-footer">
        <span className="contact-footer__copy" style={anim(visible, "rowRise", 0.4, 2.1)}>
          © CHARALAMPOS PANAGOPOULOS · ATHENS
        </span>
      </div>
    </div>
  );
}
