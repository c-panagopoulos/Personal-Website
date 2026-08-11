export async function streamChat(question, { onSources, onToken, onDone, onError }, signal, history = []) {
  let response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
      signal,
    });
  } catch {
    onError?.({ type: "generic", message: "Couldn't reach the server, check your connection and try again." });
    return;
  }

  if (!response.ok || !response.body) {
    try {
      const body = await response.json();
      onError?.({ type: body.type || "generic", message: body.message || `Request failed (${response.status})` });
    } catch {
      onError?.({ type: "generic", message: `Request failed (${response.status})` });
    }
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
        try {
          onDone?.(JSON.parse(data));
        } catch {
          onDone?.({});
        }
      } else if (event === "error") {
        try {
          const parsed = JSON.parse(data);
          onError?.({ type: parsed.type || "generic", message: parsed.message || "Assistant error" });
        } catch {
          onError?.({ type: "generic", message: "Assistant error" });
        }
      }
    }
  }
}
