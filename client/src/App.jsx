import NavBar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import ProjectScene from "./components/ProjectScene.jsx";
import AssistantSection from "./components/AssistantSection.jsx";
import HomelabSection from "./components/HomelabSection.jsx";
import StackSection from "./components/StackSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import DockNav from "./components/DockNav.jsx";
import Reveal from "./components/Reveal.jsx";

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

      <ProjectScene
        id="scene-01"
        sceneNumber="01"
        sceneName="TAPSTUDY"
        browserLabel="tapstudy.local — review"
        browserTag="TAPSTUDY — REVIEW SESSION"
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
        browserLabel="hermes.local — support queue"
        browserTag="HERMES — CUSTOMER SUPPORT CHAT"
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
