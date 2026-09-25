import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { z } from "zod";
import { generateTokens } from "../services/mockLLM.ts";

const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "message is required"),
});

const MAX_STREAM_DURATION_MS = 30_000;

function writeEvent(res: Response, event: string, data: unknown) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export async function streamChat(req: Request, res: Response) {
  const parsed = chatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: {
        message: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
    });
    return;
  }

  const { message } = parsed.data;
  const streamId = randomUUID();
  const controller = new AbortController();
  let abortReason: "timeout" | "client-disconnect" | null = null;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const timeout = setTimeout(() => {
    abortReason = "timeout";
    controller.abort();
  }, MAX_STREAM_DURATION_MS);

  // `res` (not `req`) tells us about the client disconnecting: a Readable's
  // `close` fires right after `end`, so `req.on("close")` fires as soon as the
  // body finishes parsing rather than when the connection actually drops.
  const onClose = () => {
    if (!res.writableEnded) {
      abortReason = "client-disconnect";
      controller.abort();
    }
  };
  res.on("close", onClose);

  writeEvent(res, "start", { id: streamId });

  let seq = 0;

  try {
    for await (const delta of generateTokens(message, controller.signal)) {
      writeEvent(res, "chunk", { id: streamId, seq: seq++, delta });
    }

    if (controller.signal.aborted) {
      if (abortReason === "timeout" && !res.writableEnded) {
        writeEvent(res, "error", { id: streamId, message: "stream timed out" });
      }
      // client-disconnect: the connection is already gone, nothing left to write.
    } else {
      writeEvent(res, "done", { id: streamId });
    }
  } catch (err) {
    if (!res.writableEnded) {
      writeEvent(res, "error", {
        id: streamId,
        message: err instanceof Error ? err.message : "internal error",
      });
    }
  } finally {
    clearTimeout(timeout);
    res.off("close", onClose);
    if (!res.writableEnded) res.end();
  }
}
