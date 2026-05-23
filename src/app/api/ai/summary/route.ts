import { NextResponse } from "next/server";
import { runClaude } from "@/lib/ai";
import { getFiling } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const { filingId } = (await req.json()) as { filingId: string; ticker?: string };
  const filing = getFiling(filingId);

  const prompt = `Produce a concise deep-dive of this SEC filing based ONLY on the metadata below.
Do not ask for the document or more details — infer typical content for this form type and explain it.

Company: ${filing?.company ?? "a public company"}
Ticker: ${filing?.ticker ?? "N/A"}
Form: ${filing?.type ?? "an SEC filing"}
Synopsis: ${filing?.summary ?? "A filing submitted to the SEC."}
Tags: ${filing?.tags?.join(", ") || "none"}

Cover: (1) what this form type discloses and why it matters, (2) the likely material provisions
given the synopsis/tags, (3) dilution/ROFR/financing implications if relevant, and (4) the signal an
investor would take from it. Keep it to a few short paragraphs.`;

  try {
    const summary = await runClaude(prompt);
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({
      summary:
        `Demo mode — the Claude Code CLI isn't reachable from this server.\n\n` +
        `A live deep-dive would extract the material provisions of this ${filing?.type ?? "filing"}, ` +
        `any dilution / ROFR / financing language, changes vs. the prior period, and the resulting signal with figures.\n\n` +
        `Run the app where the \`claude\` CLI is installed and authenticated.\n\nInformational only — not investment advice.`,
    });
  }
}
