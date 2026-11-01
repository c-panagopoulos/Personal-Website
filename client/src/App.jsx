import Hero from "./components/Hero.jsx";
import NavBar from "./components/NavBar.jsx";
import ProjectScene from "./components/ProjectScene.jsx";
import MotionCarousel from "./components/MotionCarousel.jsx";
import AssistantSection from "./components/AssistantSection.jsx";
import AuditSteps from "./components/AuditSteps.jsx";
import HomelabSection from "./components/HomelabSection.jsx";
import StackSection from "./components/StackSection.jsx";
import AboutSection from "./components/AboutSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import StatMoment from "./components/StatMoment.jsx";
import ZoomableShot from "./components/ZoomableShot.jsx";
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
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <NavBar style={{ animation: "heroRise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) 1.15s both" }} />
        <main id="main" tabIndex={-1}>
        <Hero />

        <ProjectScene
          id="scene-01"
          sceneNumber="01"
          sceneName="TAPSTUDY"
          showBrowserPreview={false}
          title="A study tracker you start by tapping your phone."
          body="I wanted an honest record of how much I was studying alongside a full-time job. An NFC tag on my desk starts and stops each session, so there is no timer app to remember."
          proof={[
            <>Ships as <b>one Docker image</b>, from my dev machine to the homelab</>,
            <>The NFC tag holds a plain <b>URL record</b>, so it works without an app</>,
            <>AI insights are <b>fact-checked</b> before they're shown</>,
            <>Screen readers get an <b>LLM-written description</b> of the chart instead of raw numbers</>,
          ]}
          how="A local model (qwen2.5:1.5b via Ollama) writes the insight sentences but never does the arithmetic. Every number is computed in JavaScript first, and the model only turns it into a sentence. A fact-check pass afterwards discards anything that doesn't match, which also catches prompt-injection attempts."
          evidence={<ZoomableShot src="/images/tapstudy-dashboard.png" label="tapstudy dashboard" alt="tapstudy dashboard with daily study time, AI insights and recent sessions" />}
          ctaLabel="Live demo"
          ctaHref="https://tapstudy.cpanagopoulos.dev"
          githubHref="https://github.com/c-panagopoulos/tapstudy"
          stack={[
            { label: "Engineering", items: ["Single Docker container", "React 19 · Express · PostgreSQL", "NFC tag with a URL record (no Web NFC API)", "Global error handler that hides stack traces"] },
            { label: "Constraints", items: ["Self-hosted on my own hardware", "Local Ollama only", "Single-user by design"] },
          ]}
        />

        <ProjectScene
          id="scene-02"
          sceneNumber="02"
          sceneName="HERMES"
          showBrowserPreview={false}
          divider
          factsLayout="column"
          title="A support chatbot that only answers what it can cite."
          body="Built for a fictional e-commerce brand. Customers ask questions and the bot answers from the brand's own documents, with the sources attached to every reply."
          proof={[
            <><b>Token-streamed</b> replies over SSE</>,
            <>Resists <b>prompt-injection</b> and role-escalation attempts</>,
            <><b>JWT-protected</b> admin panel with live stats and document upload</>,
            <>Hands the conversation to <b>a human</b> when it shouldn't keep answering</>,
          ]}
          how="It retrieves the closest matching chunks with pgvector and answers only from those. If a message matches escalation keywords, such as a lawyer or a formal complaint, it opens a case for a human agent through a configurable webhook. The backend is private; the frontend repo is public."
          ctaLabel="Live demo"
          ctaHref="https://hermes.cpanagopoulos.dev"
          githubHref="https://github.com/c-panagopoulos/hermes-ai"
          secondaryLabel="Frontend repo"
          stack={[
            { label: "Engineering", items: ["PostgreSQL + pgvector", "Token-streamed via SSE", "JWT + bcrypt admin auth", "n8n escalation webhook"] },
            { label: "Constraints", items: ["Deployed on Railway", "Groq in prod, Ollama in dev", "Escalates instead of guessing"] },
          ]}
        />

        <div className="hermes-evidence" ref={hermesEvidenceRef} style={anim(hermesEvidenceVisible, "sceneRiseBlur", 0.6, 0)}>
          <MotionCarousel slides={HERMES_SLIDES} />
        </div>

        <StatMoment
          value="75% → 96.9%"
          label="75% to 96.9%"
          caption="Ghost Data's status accuracy on the 32 sample cases, after separating what the auditor could know at audit time from what it could actually cite."
        />

        <ProjectScene
          id="scene-03"
          sceneNumber="03"
          sceneName="GHOST DATA"
          showBrowserPreview={false}
          title="An agent that checks whether deleted customer data is really gone."
          body="My entry for HackerRank Orchestrate, built solo in about 8 to 9 hours of work during the 24-hour hackathon. It looks through replicas, search indexes, backups, and the sync jobs that can bring deleted data back."
          proof={[
            <>Identity, timing and policy are decided in <b>plain code</b></>,
            <>Reads SQL, JSON, <b>six log formats</b>, PDFs and screenshots</>,
            <>Every finding <b>cites its evidence</b></>,
            <><b>Zero npm dependencies</b>, byte-identical rebuilds</>,
          ]}
          how="Models are used only for unstructured input: deciding whether a request, in any language, actually asks for deletion, and reading facts that exist only inside an image. Everything else, including the order of the fixes, is plain code."
          ctaLabel="GitHub"
          ctaHref="https://github.com/c-panagopoulos/deletion-audit-agent"
          githubHref="https://github.com/c-panagopoulos/deletion-audit-agent/blob/main/code/docs/decisions.md"
          secondaryLabel="31 decision records"
          stack={[
            { label: "Engineering", items: ["Node.js 22.13+, no dependencies", "Groq gpt-oss-120b for intake", "Gemini vision for PDFs + images", "~$0.17 for all 518 requests, from an empty cache"] },
            { label: "Constraints", items: ["Solo, ~8-9 hours of work", "Groq tier I chose: 200k tokens/day", "Refuses to guess unlinkable data"] },
          ]}
        >
          <AuditSteps />
        </ProjectScene>

        <StatMoment
          value="25.2 / 30"
          label="25.2 out of 30"
          caption="Ghost Data's score, graded against answers that were hidden from participants."
        />

        <AssistantSection />

        <HomelabSection />

        <StackSection />

        <AboutSection />

        <ContactSection />
        </main>
      </div>
    </ChatProvider>
  );
}
