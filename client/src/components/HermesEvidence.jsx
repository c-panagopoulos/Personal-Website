import Terminal from "./Terminal.jsx";

const COMMANDS = [
  'curl -N hermes.local/api/chat -d \'{"q":"refund policy"}\'',
  'curl -N hermes.local/api/chat -d \'{"q":"this is unacceptable"}\'',
];

const OUTPUTS = {
  0: [
    "→ embed query · 12ms",
    "→ pgvector · cosine · top-4 · 41ms",
    "→ 4 chunks retrieved · refund-policy.md, terms.md",
    "→ streaming tokens...",
    '"Refunds are available within 30 days of purchase..."',
    "→ sources: [refund-policy.md §2, terms.md §4]",
    "→ sentiment: neutral · no escalation",
  ],
  1: [
    "→ embed query · 9ms",
    "→ pgvector · cosine · top-4 · 33ms",
    "→ streaming tokens...",
    '"I\'m sorry for the trouble — let me escalate this."',
    "→ sentiment: negative · escalating",
    "→ n8n webhook → Salesforce case #4821 created",
  ],
};

export default function HermesEvidence() {
  return (
    <div>
      <div className="evidence-panel__label" style={{ marginBottom: 10 }}>
        REQUEST TRACE
      </div>
      <Terminal username="hermes" commands={COMMANDS} outputs={OUTPUTS} delayBetweenCommands={1400} />
    </div>
  );
}
