function scrollToContact(event) {
  event.preventDefault();
  const el = document.getElementById("contact");
  if (!el) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

// Shared renderer for chat error turns — a plain message for most failures,
// plus a nudge toward the contact section for rate-limited visitors instead
// of just telling them to stop.
export default function ChatError({ error, className = "chat-bubble__text--muted" }) {
  if (!error) return null;
  return (
    <p className={className}>
      {error.message}
      {error.type === "rate_limited" && (
        <>
          {" "}
          If you're this curious, <a href="#contact" onClick={scrollToContact}>get in touch</a> instead of grilling
          the assistant.
        </>
      )}
    </p>
  );
}
