import { runClaude, buildChatPrompt, DEMO_REPLY } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 120;

type Msg = { role: "user" | "assistant"; content: string };

function streamText(text: string): Response {
  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      // Chunk the output for a typed-in feel.
      for (const chunk of text.match(/[\s\S]{1,6}/g) ?? [text]) {
        controller.enqueue(enc.encode(chunk));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Msg[] };
  try {
    const reply = await runClaude(buildChatPrompt(messages));
    return streamText(reply);
  } catch {
    // CLI unavailable (e.g. serverless) or errored → graceful demo fallback.
    return streamText(DEMO_REPLY);
  }
}
