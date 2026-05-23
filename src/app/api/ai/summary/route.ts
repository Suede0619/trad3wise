import { NextResponse } from "next/server";
import { getClient, AI_MODEL, SYSTEM_PROMPT, aiEnabled } from "@/lib/ai";
import { getFiling } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { filingId } = (await req.json()) as { filingId: string; ticker?: string };
  const filing = getFiling(filingId);

  if (!aiEnabled) {
    return NextResponse.json({
      summary:
        `Demo mode (no ANTHROPIC_API_KEY).\n\nA live deep-dive would extract: (1) the material provisions of this ${filing?.type ?? "filing"}, ` +
        `(2) any dilution / ROFR / financing language, (3) changes vs. the prior period, and (4) the resulting signal with figures.\n\n` +
        `Add ANTHROPIC_API_KEY to enable (see docs/SETUP.md).\n\nInformational only — not investment advice.`,
    });
  }

  const client = getClient()!;
  try {
    const msg = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Produce a concise deep-dive of this SEC filing.\nCompany: ${filing?.company}\nTicker: ${filing?.ticker}\nForm: ${filing?.type}\nKnown synopsis: ${filing?.summary}\nTags: ${filing?.tags.join(", ")}\n\nReturn: material provisions, dilution/ROFR/financing notes, period-over-period changes, and the signal.`,
        },
      ],
    });
    const text = msg.content.map((c) => (c.type === "text" ? c.text : "")).join("");
    return NextResponse.json({ summary: text });
  } catch (err) {
    return NextResponse.json({ summary: `AI error: ${(err as Error).message}` }, { status: 500 });
  }
}
