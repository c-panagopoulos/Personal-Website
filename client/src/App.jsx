import Hero from "./components/Hero.jsx";
import NavBar from "./components/NavBar.jsx";
import MacbookScroll from "./components/MacbookScroll.jsx";
import ProjectScene from "./components/ProjectScene.jsx";
import MotionCarousel from "./components/MotionCarousel.jsx";
import AssistantSection from "./components/AssistantSection.jsx";
import HomelabSection from "./components/HomelabSection.jsx";
import StackSection from "./components/StackSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import DockNav from "./components/DockNav.jsx";
import StatementReveal from "./components/StatementReveal.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { useSceneTrigger } from "./hooks/useSceneTrigger.js";
import { anim } from "./lib/anim.js";

const HERMES_SLIDES = [
  { name: "chat-ui", label: "Chat UI", src: "/images/hermes-homepage.png" },
  { name: "admin-dashboard", label: "Admin Dashboard", src: "/images/admin-stats.png" },
  { name: "doc-ingest", label: "Doc Ingest Pipeline", src: "/images/admin-document-upload-v2.png" },
  { name: "injection-resistance", label: "Injection Resistance", src: "/images/prompt-injection.png" },
];

export default function App() {
  const [hermesEvidenceRef, hermesEvidenceVisible] = useSceneTrigger({ threshold: 0.15 });

  return (
    <ChatProvider>
      <div className="page">
        <NavBar style={{ animation: "heroRise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) 1.15s both" }} />
        <Hero />

        <div className="statement">
          <StatementReveal lines={["I wanted to know", "how much I really studied.", "So I built", "TapStudy."]} />
        </div>

        <MacbookScroll src="/images/dashboard.png" alt="tapstudy dashboard" />

        <ProjectScene
          id="scene-01"
          sceneNumber="01"
          sceneName="TAPSTUDY"
          showBrowserPreview={false}
          title="A study tracker you start by tapping your phone."
          body="I wanted an honest record of how much I was actually studying alongside a full-time job, so I stuck an NFC tag on my desk instead of a timer app — tap to start, tap to stop. It's still the first thing I touch every morning."
          proof={[
            <>Ships as <b>one Docker image</b> — dev machine to homelab, no registry</>,
            <>NFC tag as a <b>URL record</b> — no app, nothing to open</>,
            <>AI insights are <b>fact-checked</b> before they're shown</>,
            <>Public demo is <b>read-only</b>, blocked at the backend</>,
          ]}
          how="A local model (qwen2.5:1.5b, via Ollama) writes the insight sentences, but never does the arithmetic — every number is computed in JavaScript first and the model's only job is turning an already-correct fact into a sentence. Prompt-injection attempts get caught and discarded by a fact-check pass afterward, not just prompted around."
          ctaLabel="Live demo"
          ctaHref="https://tapstudy.cpanagopoulos.dev"
          githubHref="https://github.com/c-panagopoulos/tapstudy"
          stack={[
            { label: "Engineering", items: ["Single Docker container", "React 19 · Express · PostgreSQL", "NFC tag → URL record, no Web NFC API", "Global error handling, no leaked stack traces"] },
            { label: "Constraints", items: ["Self-hosted, own hardware", "Local Ollama, no external API", "Single-user by design"] },
          ]}
        />

        <div className="statement">
          <StatementReveal lines={["One started as", "a personal itch.", "The other had to", "survive real customers."]} />
        </div>

        <ProjectScene
          id="scene-02"
          sceneNumber="02"
          sceneName="HERMES"
          showBrowserPreview={false}
          divider
          factsLayout="column"
          title="A support chatbot that only answers what it can cite."
          body="Customers ask questions; the bot answers only from what it can cite — no hallucinated policy, no made-up support replies."
          proof={[
            <>Answers only from <b>cited sources</b></>,
            <><b>Token-streamed</b> replies, sources attached</>,
            <>Resists <b>prompt-injection</b> and role-escalation attempts</>,
            <><b>JWT-protected</b> admin panel — live stats + doc ingestion</>,
          ]}
          how="Retrieves the closest matching chunks from internal docs via pgvector, then answers only from those. A message matching escalation keywords — a lawyer, a formal complaint — opens a case for a human agent through a configurable webhook, instead of letting the bot keep guessing."
          ctaLabel="Live demo"
          ctaHref="https://hermes.cpanagopoulos.dev"
          githubHref="https://github.com/c-panagopoulos/hermes-ai"
          stack={[
            { label: "Engineering", items: ["PostgreSQL + pgvector", "Token-streamed via SSE", "JWT + bcrypt admin auth", "n8n escalation webhook"] },
            { label: "Constraints", items: ["Self-hosted on Hetzner", "Groq in prod, Ollama in dev", "Escalates instead of guessing"] },
          ]}
        />

        <div className="hermes-evidence" ref={hermesEvidenceRef} style={anim(hermesEvidenceVisible, "sceneRiseBlur", 0.6, 0)}>
          <MotionCarousel slides={HERMES_SLIDES} terminalHost="hermes.local" />
        </div>

        <AssistantSection />

        <div className="statement">
          <StatementReveal lines={["Software", "fails.", "So I built", "my own infrastructure."]} />
        </div>

        <HomelabSection />

        <StackSection />

        <div className="statement" style={{ justifyContent: "center" }}>
          <StatementReveal
            as="p"
            align="center"
            style={{ fontSize: "3.2rem" }}
            lines={[
              "Years on a support line before I wrote a line of code.",
              <>
                Most of debugging is still just <span style={{ color: "var(--accent)" }}>listening</span>.
              </>,
            ]}
          />
        </div>

        <ContactSection />
        <DockNav />
      </div>
    </ChatProvider>
  );
}
