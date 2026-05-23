"use client";

import { useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Summarize the latest insider buying signals.",
  "Which institutions added NVDA last quarter?",
  "Explain dilution risk in a shelf registration.",
  "What did politicians trade this month?",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Something went wrong." };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-3xl flex-col">
      <PageHeader title="Filing-Intelligence Agent" description="Ask anything about filings, insiders, 13F holdings, politician trades, and market data.">
        <Badge variant="primary"><Sparkles className="h-3 w-3" /> Claude Code CLI</Badge>
      </PageHeader>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bot className="h-6 w-6" />
              </span>
              <p className="max-w-sm text-sm text-muted-foreground">
                I read SEC filings so you don&apos;t have to. Ask me to summarize a filing, surface a signal, or compare holdings.
              </p>
              <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-md border border-border p-2 text-left text-xs text-muted-foreground hover:bg-surface-2 hover:text-foreground">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${m.role === "user" ? "bg-surface-2" : "bg-primary/15 text-primary"}`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1 whitespace-pre-wrap text-sm leading-relaxed">
                {m.content || (busy && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null)}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agent…"
            className="h-10 flex-1 rounded-md border border-input bg-surface px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" size="icon" disabled={busy}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">Informational only — not investment advice.</p>
    </div>
  );
}
