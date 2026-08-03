export async function streamChat(question, { onSources, onToken, onDone, onError }, signal) {
  let response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal,
    });
  } catch (err) {
    onError?.(err.message || "Network error");
    return;
  }

  if (!response.ok || !response.body) {
    onError?.(`Request failed (${response.status})`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const lines = frame.split("\n");
      let event = "message";
      let data = "";
      for (const line of lines) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (!data) continue;

      if (event === "sources") {
        try {
          onSources?.(JSON.parse(data));
        } catch {}
      } else if (event === "token") {
        try {
          onToken?.(JSON.parse(data));
        } catch {
          onToken?.(data);
        }
      } else if (event === "done") {
        onDone?.();
      } else if (event === "error") {
        try {
          onError?.(JSON.parse(data).message || "Assistant error");
        } catch {
          onError?.("Assistant error");
        }
      }
    }
  }
}
