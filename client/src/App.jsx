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
        <Reveal as="h2" className="statement__text">
          Everything after
          <br />
          this line is
          <br />
          still running.
        </Reveal>
      </div>

      <MacbookScroll src="/images/dashboard.png" alt="tapstudy dashboard" />

      <ProjectScene
        id="scene-01"
        sceneNumber="01"
        sceneName="TAPSTUDY"
        showBrowserPreview={false}
        title="A study tracker you start by tapping your phone."
        body="I kept forgetting to log study sessions, so I stuck an NFC tag on my desk — tap to start, tap to stop. Auth, rate limiting and error handling went in before the first session was ever recorded. Two years later it is still the first thing I touch in the morning."
        ctaLabel="Live demo"
        ctaTag="TAPSTUDY"
        ctaHref="#scene-01"
        facts={[
          { label: "STACK", lines: ["React · Express", "PostgreSQL"] },
          { label: "DEPLOY", lines: ["single-image Docker", "own hardware"] },
          { label: "AI", lines: ["local Ollama", "prompt-hardened"] },
          { label: "USERS", lines: ["me,", "every morning"] },
        ]}
      />

      <ProjectScene
        id="scene-02"
        sceneNumber="02"
        sceneName="HERMES"
        showBrowserPreview={false}
        title="A support chatbot that only answers what it can cite."
        body="Customers ask questions, the bot retrieves the closest matching chunks from internal docs via pgvector, and answers only from those — streamed token by token, sources attached. When a customer seems dissatisfied, an n8n webhook opens a case in Salesforce for a human agent."
        ctaLabel="Read more"
        ctaTag="HERMES"
        ctaHref="#assistant"
        facts={[
          { label: "STACK", lines: ["Node · Express", "PostgreSQL"] },
          { label: "DEPLOY", lines: ["Dockerized", "self-hosted, Hetzner"] },
          { label: "AI", lines: ["RAG · pgvector", "streamed via SSE"] },
          { label: "ESCALATION", lines: ["n8n → Salesforce", "case per dissatisfied customer"] },
        ]}
      />

      <div style={{ padding: "0 0 40px" }}>
        <MotionCarousel slides={HERMES_SLIDES} terminalHost="hermes.local" />
      </div>

      <AssistantSection />

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
