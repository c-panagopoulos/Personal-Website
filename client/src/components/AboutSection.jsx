import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

export default function AboutSection() {
  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });

  return (
    <div id="about" className="about-section" ref={ref}>
      <div className="contact-section__eyebrow">
        <span className="contact-section__eyebrow-label" style={anim(visible, "rowRise", 0.4, 0.1)}>
          ABOUT
        </span>
        <span className="contact-section__eyebrow-rule" style={anim(visible, "ruleGrow", 0.6, 0.25)} />
      </div>
      <div className="about-section__body" style={anim(visible, "sceneRiseBlur", 0.65, 0.5)}>
        <p>
          It all started when I began self-hosting a few services to make my everyday life easier. The first one
          was Nextcloud, to get my files off Google Drive. One Docker container became two, two became three, and
          that's how I ended up with a homelab.
        </p>
        <p>
          That's when the open source community impressed me: people with passion, working together, have built
          things that in my opinion are often better than the commercial products they compete with.
        </p>
        <p>
          It's also when I saw what a responsibility it is to keep all these services running smoothly. All of
          this fascinated me, and programming was the natural next step.
        </p>
        <p>
          I'm currently changing careers. I work full-time in customer and technical support, and in my free time
          I build projects like these and keep improving my programming skills.
        </p>
        <p>
          Support work has taught me to listen until I understand what someone actually needs and to explain
          technical things in plain language. I've also learned to work well under pressure, to deliver results,
          and to take ownership of customer cases until their issue is resolved.
        </p>
        <p>
          I'm based in Athens and looking for my first role as a junior full-stack web developer. I'm open to
          remote, hybrid or on-site work.
        </p>
      </div>
    </div>
  );
}
