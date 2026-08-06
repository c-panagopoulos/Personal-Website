import NavBar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import MacbookScroll from "./components/MacbookScroll.jsx";
import ProjectScene from "./components/ProjectScene.jsx";
import MotionCarousel from "./components/MotionCarousel.jsx";
import AssistantSection from "./components/AssistantSection.jsx";
import HomelabSection from "./components/HomelabSection.jsx";
import StackSection from "./components/StackSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import DockNav from "./components/DockNav.jsx";
import Reveal from "./components/Reveal.jsx";
import WipeReveal from "./components/WipeReveal.jsx";

const HERMES_SLIDES = [
  { name: "chat-ui", label: "Chat UI", src: "/images/hermes-homepage.png" },
  { name: "admin-dashboard", label: "Admin Dashboard", src: "/images/admin-stats.png" },
  { name: "doc-ingest", label: "Doc Ingest Pipeline", src: "/images/admin-document-upload-v2.png" },
  { name: "injection-resistance", label: "Injection Resistance", src: "/images/prompt-injection.png" },
];

export default function App() {
  return (
    <div className="page">
      <NavBar />
      <Hero />

      <div className="statement">
        <WipeReveal as="h2" className="statement__text">
          I kept forgetting
          <br />
          to log my study.
          <br />
          So I built
          <br />
          TapStudy.
        </WipeReveal>
      </div>

      <MacbookScroll src="/images/dashboard.png" alt="tapstudy dashboard" />

      <ProjectScene
        id="scene-01"
        sceneNumber="01"
        sceneName="TAPSTUDY"
        showBrowserPreview={false}
        title="A study tracker you start by tapping your phone."
        body="I kept forgetting to log study sessions, so I stuck an NFC tag on my desk — tap to start, tap to stop. It's still the first thing I touch every morning."
        proof={[
          "Running every morning for two years",
          "Single Docker container, own hardware",
          "NFC-triggered — no app to open",
        ]}
        how="Auth, rate limiting and error handling shipped before the first session was ever logged — it was never a toy."
        ctaLabel="Live demo"
        ctaTag="TAPSTUDY"
        ctaHref="#scene-01"
        stack={[
          { label: "ENGINEERING", items: ["Single Docker container", "React 19 · Express · PostgreSQL", "NFC read via Web NFC API"] },
          { label: "CONSTRAINTS", items: ["Self-hosted, own hardware", "Local Ollama, no external API", "Single-user by design"] },
        ]}
      />

      <div className="statement">
        <WipeReveal as="h2" className="statement__text">
          One started as
          <br />
          a personal itch.
          <br />
          The other had to
          <br />
          survive real customers.
        </WipeReveal>
      </div>

      <ProjectScene
        id="scene-02"
        sceneNumber="02"
        sceneName="HERMES"
        showBrowserPreview={false}
        divider
        factsLayout="inline"
        title="A support chatbot that only answers what it can cite."
        body="Customers ask questions; the bot answers only from what it can cite — no hallucinated policy, no made-up support replies."
        proof={[
          "Answers only from cited sources",
          "Token-streamed replies, sources attached",
          "Auto-escalates dissatisfied customers to Salesforce",
          "Self-hosted on Hetzner",
        ]}
        how="Retrieves the closest matching chunks from internal docs via pgvector, then answers only from those. When a customer sounds dissatisfied, an n8n webhook opens a case in Salesforce for a human agent."
        ctaLabel="Read more"
        ctaTag="HERMES"
        ctaHref="#assistant"
        stack={[
          { label: "ENGINEERING", items: ["PostgreSQL + pgvector", "Token-streamed via SSE", "n8n → Salesforce escalation"] },
          { label: "CONSTRAINTS", items: ["Self-hosted on Hetzner", "No hosted LLM API", "Escalates instead of guessing"] },
        ]}
      />

      <div className="hermes-evidence">
        <MotionCarousel slides={HERMES_SLIDES} terminalHost="hermes.local" />
      </div>

      <AssistantSection />

      <div className="statement">
        <WipeReveal as="h2" className="statement__text">
          Software
          <br />
          fails.
          <br />
          So I built
          <br />
          my own infrastructure.
        </WipeReveal>
      </div>

      <HomelabSection />

      <StackSection />

      <div className="statement" style={{ justifyContent: "center" }}>
        <Reveal as="p" className="statement__text" style={{ fontSize: "3.2rem", textAlign: "center", margin: "0 auto" }}>
          Years on a support line before I wrote a line of code. Most of debugging is still just{" "}
          <span style={{ color: "var(--accent)" }}>listening</span>.
        </Reveal>
      </div>

      <ContactSection />
      <DockNav />
    </div>
  );
}
