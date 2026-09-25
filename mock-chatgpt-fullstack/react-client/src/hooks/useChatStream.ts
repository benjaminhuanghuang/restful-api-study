import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

interface SseEvent {
  event: string;
  data: string;
}

/** Splits a raw SSE buffer into complete `event:`/`data:` records, keeping any trailing partial record for the next read. */
function parseSseChunk(buffer: string): { events: SseEvent[]; rest: string } {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  const events: SseEvent[] = [];

  for (const part of parts) {
    let event = "message";
    let data = "";
    for (const line of part.split("\n")) {
      if (line.startsWith("event: ")) event = line.slice("event: ".length);
      else if (line.startsWith("data: ")) data = line.slice("data: ".length);
    }
    if (data) events.push({ event, data });
  }

  return { events, rest };
}

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Lets `retry` read the latest messages without depending on `messages`,
  // so its identity stays stable across streaming updates.
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const patchMessage = useCallback(
    (id: string, patch: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
      );
    },
    []
  );

  const appendContent = useCallback((id: string, delta: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content: m.content + delta } : m))
    );
  }, []);

  const runStream = useCallback(
    async (assistantId: string, userText: string) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      // Batch token deltas into animation frames instead of a setState per token,
      // so a fast-streaming response doesn't trigger a re-render per word.
      let pending = "";
      let flushScheduled = false;
      const flush = () => {
        flushScheduled = false;
        if (!pending) return;
        const delta = pending;
        pending = "";
        appendContent(assistantId, delta);
      };
      const scheduleFlush = () => {
        if (flushScheduled) return;
        flushScheduled = true;
        requestAnimationFrame(flush);
      };

      let sawDone = false;

      try {
        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const { events, rest } = parseSseChunk(buffer);
          buffer = rest;

          for (const { event, data } of events) {
            const parsed = JSON.parse(data) as {
              delta?: string;
              message?: string;
            };

            if (event === "chunk" && parsed.delta) {
              pending += parsed.delta;
              scheduleFlush();
            } else if (event === "done") {
              sawDone = true;
            } else if (event === "error") {
              throw new Error(parsed.message ?? "stream error");
            }
          }
        }

        flush();
        patchMessage(assistantId, { status: sawDone ? "completed" : "failed" });
      } catch (err) {
        flush();
        const aborted =
          err instanceof DOMException && err.name === "AbortError";
        patchMessage(assistantId, { status: aborted ? "stopped" : "failed" });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [appendContent, patchMessage]
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const userMessage: ChatMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
      };
      const assistantId = nextId();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        status: "streaming",
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      void runStream(assistantId, trimmed);
    },
    [isStreaming, runStream]
  );

  const retry = useCallback(
    (assistantId: string) => {
      if (isStreaming) return;
      const list = messagesRef.current;
      const index = list.findIndex((m) => m.id === assistantId);
      const userMessage = list[index - 1];
      if (!userMessage || userMessage.role !== "user") return;

      patchMessage(assistantId, { content: "", status: "streaming" });
      void runStream(assistantId, userMessage.content);
    },
    [isStreaming, patchMessage, runStream]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, isStreaming, send, retry, stop };
}
