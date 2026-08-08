const API_KEY = process.env.GROQ_API_KEY;
const CHAT_MODEL = process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile";
const BASE_URL = "https://api.groq.com/openai/v1";

export async function chatStream(messages, onToken) {
  if (!API_KEY) {
    throw new Error("GROQ_API_KEY is not set. Add it to .env to use the Groq chat model.");
  }

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: CHAT_MODEL, messages, stream: true }),
  });
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq chat request failed (${res.status}). ${detail}`.trim());
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
      const token = parsed.choices?.[0]?.delta?.content;
      if (token) onToken(token);
    }
  }
}
