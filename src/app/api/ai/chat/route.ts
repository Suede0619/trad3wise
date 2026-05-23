import { getClient, AI_MODEL, SYSTEM_PROMPT, DEMO_REPLY, aiEnabled } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Msg[] };

  // Graceful demo fallback when no API key is configured.
  if (!aiEnabled) {
    const stream = new ReadableStream({
      start(controller) {
        const enc = new TextEncoder();
        for (const chunk of DEMO_REPLY.match(/.{1,8}/g) ?? [DEMO_REPLY]) {
          controller.enqueue(enc.encode(chunk));
        }
        controller.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const client = getClient()!;
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const ai = await client.messages.stream({
          model: AI_MODEL,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });
        for await (const event of ai) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
      } catch (err) {
        controller.enqueue(enc.encode(`\n\n[AI error: ${(err as Error).message}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
