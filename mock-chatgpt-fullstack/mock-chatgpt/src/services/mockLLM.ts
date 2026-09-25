const SAMPLE_RESPONSES = [
  "Sure, here is a concise explanation of how streaming APIs work in practice. The server forwards each token to the client as soon as it is generated, instead of waiting for the full response.",
  "Great question. Let's break this down into a few steps: first the client opens a long-lived connection, then the server streams incremental chunks, and finally the client appends each chunk as it arrives.",
  "I can help with that. This is a mock response generated token by token to simulate how a real LLM streams output over Server-Sent Events.",
];

function hashCode(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function pickResponse(prompt: string): string {
  const response =
    SAMPLE_RESPONSES[Math.abs(hashCode(prompt)) % SAMPLE_RESPONSES.length];
  return response ?? SAMPLE_RESPONSES[0]!;
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }

    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

/**
 * Mock LLM: yields the response one word at a time with a randomized delay,
 * simulating token-by-token generation. Stops immediately once `signal` aborts
 * (client disconnect, cancel, or timeout) instead of finishing the response.
 */
export async function* generateTokens(
  prompt: string,
  signal: AbortSignal,
): AsyncGenerator<string> {
  const words = pickResponse(prompt).split(" ");

  for (let i = 0; i < words.length; i++) {
    if (signal.aborted) return;
    await sleep(20 + Math.random() * 60, signal);
    if (signal.aborted) return;
    yield i === words.length - 1 ? words[i]! : `${words[i]} `;
  }
}
