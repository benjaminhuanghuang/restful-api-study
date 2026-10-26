# Client for SSE

```js
async function streamChat(message) {
  const resp = await fetch("http://127.0.0.1:8000/api/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop(); // 保留最后不完整的一段

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);

      if (data === "[DONE]") return;

      const chunk = JSON.parse(data);
      const delta = chunk.choices[0].delta.content;
      if (delta) process.stdout.write(delta); // 或更新 UI
    }
  }
}
```
