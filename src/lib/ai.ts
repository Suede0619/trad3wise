import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * AI is powered by the local **Claude Code CLI** (the `claude` binary) in headless mode,
 * NOT the Anthropic HTTP API. No ANTHROPIC_API_KEY is used.
 *
 * Requirements: the `claude` CLI must be installed and authenticated on the machine running
 * the Next.js server (works for `pnpm dev` / `pnpm start` / self-hosted). On Vercel's
 * serverless runtime the CLI is not present, so the routes fall back to a labeled demo reply.
 */
export const AI_MODEL = process.env.CLAUDE_MODEL || "sonnet"; // CLI alias: "sonnet" | "opus" | full id
const TIMEOUT_MS = Number(process.env.CLAUDE_TIMEOUT_MS || 90_000);

/**
 * Resolve the Claude CLI binary. Prefer an explicit override, then the standard local-install
 * path (`~/.claude/local/claude`), then `claude` on PATH. (A stale `claude` on PATH can be an
 * old, broken version, so the local-install path is preferred.)
 */
function resolveBin(): string {
  if (process.env.CLAUDE_CLI_PATH) return process.env.CLAUDE_CLI_PATH;
  const local = join(homedir(), ".claude", "local", "claude");
  if (existsSync(local)) return local;
  return "claude";
}

export const SYSTEM_PROMPT = `You are the Trad3wise Filing-Intelligence Agent.
You help users understand SEC filings, insider transactions, institutional (13F) holdings,
congressional trades, ETF flows, and market data. Be concise, precise, and quantitative.
When you reference a figure, name the filing or data point it came from.
ALWAYS end any analysis with: "Informational only — not investment advice."`;

export const DEMO_REPLY = `**Demo mode** — the Claude Code CLI isn't reachable from this server (e.g. a Vercel serverless deploy), so I'm returning a canned response.

Run the app where the \`claude\` CLI is installed and authenticated (\`pnpm dev\` locally, or a self-hosted server) and I'll answer for real — pulling the relevant SEC filings/market data, summarizing material provisions (dilution, ROFR, Form 4 activity, 13F changes), and surfacing the signal with the numbers.

Informational only — not investment advice.`;

/**
 * Run the Claude Code CLI headlessly with the given prompt (sent via stdin).
 * Resolves with the model's text output. Rejects if the CLI is missing or errors.
 */
export function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      resolveBin(),
      [
        "-p",
        "--model",
        AI_MODEL,
        "--output-format",
        "text",
        "--append-system-prompt",
        SYSTEM_PROMPT,
        // Pure Q&A — deny all tools so it never tries to touch the filesystem/network.
        "--disallowedTools",
        "Bash Edit Write Read WebFetch WebSearch Glob Grep Task",
      ],
      { stdio: ["pipe", "pipe", "pipe"] },
    );

    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Claude CLI timed out"));
    }, TIMEOUT_MS);

    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e); // e.g. ENOENT when the CLI isn't installed
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && out.trim()) resolve(out.trim());
      else reject(new Error(err.trim() || `Claude CLI exited with code ${code}`));
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}

/** Build a single prompt string from a chat history for the headless CLI. */
export function buildChatPrompt(messages: { role: "user" | "assistant"; content: string }[]): string {
  if (messages.length === 1) return messages[0].content;
  const history = messages
    .slice(0, -1)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");
  const latest = messages[messages.length - 1].content;
  return `Conversation so far:\n${history}\n\nUser: ${latest}`;
}
