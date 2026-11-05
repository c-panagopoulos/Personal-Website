import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

export default function AboutSection() {
  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });

  return (
    <div id="about" className="about-section" ref={ref}>
      <div className="contact-section__eyebrow">
        <h2 className="contact-section__eyebrow-label" style={anim(visible, "rowRise", 0.4, 0.1)}>
          ABOUT
        </h2>
        <span className="contact-section__eyebrow-rule" style={anim(visible, "ruleGrow", 0.6, 0.25)} />
      </div>
      <div className="about-chapters">
        <div className="about-chapter" style={anim(visible, "sceneRiseBlur", 0.65, 0.5)}>
          <h3 className="about-chapter__title">How it started</h3>
          <p>
            It all started when I began self-hosting a few services to make my everyday life easier. The first
            one was Nextcloud, to get my files off Google Drive. One Docker container became two, two became
            three, and that's how I ended up with a homelab.
          </p>
          <p>
            That's also when I came to admire the open-source community, and saw what a responsibility it is to
            keep all these services running smoothly. Programming was the natural next step.
          </p>
        </div>
        <div className="about-chapter" style={anim(visible, "sceneRiseBlur", 0.65, 0.6)}>
          <h3 className="about-chapter__title">Right now</h3>
          <p>
            I'm currently changing careers. I work full-time in customer and technical support, and in my free
            time I build projects like these and keep improving my programming skills.
          </p>
          <p>
            Support work has taught me to listen until I understand what someone actually needs, to explain
            technical things in plain language, and to own a case until it's resolved.
          </p>
        </div>
        <div className="about-chapter" style={anim(visible, "sceneRiseBlur", 0.65, 0.7)}>
          <h3 className="about-chapter__title">What I'm looking for</h3>
          <p>
            I'm based in Athens and looking for my first role as a junior full-stack web developer. I'm open to
            remote, hybrid or on-site work.
          </p>
        </div>
      </div>
    </div>
  );
}
