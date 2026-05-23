"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export function AISummaryButton({ filingId, ticker }: { filingId: string; ticker: string }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setText(null);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filingId, ticker }),
      });
      const data = await res.json();
      setText(data.summary || "No summary returned.");
    } catch {
      setText("Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={run} disabled={loading} size="sm">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Analyzing…" : "Generate AI deep-dive"}
      </Button>
      {text && (
        <div className="mt-3 whitespace-pre-wrap rounded-lg border border-primary/20 bg-accent/40 p-4 text-sm leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}
