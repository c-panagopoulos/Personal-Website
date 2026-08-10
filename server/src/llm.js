// Providers are tried in order — Groq first (fast), then Gemma via Google's
// OpenAI-compatible endpoint as a free-tier fallback for when Groq's daily
// token quota is exhausted. Both speak the same OpenAI chat/completions
// shape, so this is one generic streaming client parameterized per
// provider instead of separate bespoke clients.
const PROVIDERS = [
  {
    name: "groq",
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: "https://api.groq.com/openai/v1",
    model: process.env.GROQ_CHAT_MODEL || "openai/gpt-oss-20b",
  },
  {
    name: "gemini",
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: process.env.GEMINI_CHAT_MODEL || "gemma-4-31b-it",
  },
].filter((p) => p.apiKey);

async function streamFromProvider(provider, messages, onToken) {
  const res = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({ model: provider.model, messages, stream: true }),
  });
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`${provider.name} chat request failed (${res.status}). ${detail}`.trim());
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;

      const parsed = JSON.parse(payload);
      const delta = parsed.choices?.[0]?.delta;
      // Gemma 4 always reasons out loud (no API flag to disable it — tried
      // reasoning_effort, Google rejects it as unsupported for this model)
      // and marks those chunks with extra_content.google.thought. The one
      // chunk where it switches over still carries a literal leftover
      // "</thought>" glued onto the real answer, so strip that too instead
      // of just dropping thought-marked chunks.
      if (delta?.extra_content?.google?.thought) continue;
      const token = delta?.content?.replace(/<\/?thought>/g, "");
      if (token) onToken(token);
    }
  }
}

// Returns which provider/model actually answered — callers surface this in
// the UI (the sidebar's MODEL field) so a fallback to Gemini isn't silent.
export async function chatStream(messages, onToken) {
  if (!PROVIDERS.length) {
    throw new Error("No LLM provider configured — set GROQ_API_KEY or GEMINI_API_KEY in .env.");
  }

  let lastError;
  for (const provider of PROVIDERS) {
    try {
      // Failures caught here are always pre-stream (auth/rate-limit
      // rejections happen on the initial response, before any token is
      // read), so falling through to the next provider never mixes partial
      // output from two different models in one answer.
      await streamFromProvider(provider, messages, onToken);
      return { provider: provider.name, model: provider.model };
    } catch (err) {
      console.error(`${provider.name} failed${PROVIDERS.length > 1 ? ", trying next provider" : ""}:`, err.message);
      lastError = err;
    }
  }
  throw lastError;
}
