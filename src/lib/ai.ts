import Anthropic from "@anthropic-ai/sdk";

export const AI_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
export const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

let _client: Anthropic | null = null;
export function getClient(): Anthropic | null {
  if (!aiEnabled) return null;
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

export const SYSTEM_PROMPT = `You are the Trad3wise Filing-Intelligence Agent.
You help users understand SEC filings, insider transactions, institutional (13F) holdings,
congressional trades, ETF flows, and market data. Be concise, precise, and quantitative.
When you reference a figure, name the filing or data point it came from.
ALWAYS end any analysis with: "Informational only — not investment advice."`;

export const DEMO_REPLY = `**Demo mode** — no \`ANTHROPIC_API_KEY\` is configured, so I'm returning a canned response.

Here's how I'd normally answer: I'd pull the relevant SEC filings and market data for the ticker(s) in your question, summarize the material provisions (e.g. dilution language, ROFR clauses, insider Form 4 activity, 13F changes), and surface the signal with the numbers behind it.

To enable live AI, add \`ANTHROPIC_API_KEY\` to your environment (see \`docs/SETUP.md\`).

Informational only — not investment advice.`;
