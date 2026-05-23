"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE } from "@/lib/config";

const KEY = "t3-access";

/**
 * Lightweight access-code / demo-mode gate (client-side for the scaffold).
 * In production this should be enforced server-side (middleware + session).
 * Any code unlocks the app; "demo" enters demo mode with sample data.
 */
export function AccessGate() {
  const [locked, setLocked] = useState(false);
  const [code, setCode] = useState("");
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (!stored) setLocked(true);
    else setDemo(stored === "demo");
  }, []);

  const enter = (value: string) => {
    localStorage.setItem(KEY, value || "demo");
    setDemo((value || "demo") === "demo");
    setLocked(false);
  };

  if (!locked) {
    return demo ? (
      <div className="fixed bottom-3 left-3 z-40 flex items-center gap-2 rounded-md border border-warn/30 bg-warn/10 px-3 py-1.5 text-xs text-warn">
        Demo mode — sample data
        <button
          className="underline"
          onClick={() => {
            localStorage.removeItem(KEY);
            location.reload();
          }}
        >
          exit
        </button>
      </div>
    ) : null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4 backdrop-blur">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center glow">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Activity className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-lg font-semibold">{SITE.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your access code to continue, or explore in demo mode.
        </p>
        <form
          className="mt-5 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            enter(code.trim());
          }}
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            autoFocus
          />
          <Button type="submit">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        <button
          onClick={() => enter("demo")}
          className="mt-4 text-xs text-muted-foreground hover:text-foreground"
        >
          Continue in demo mode →
        </button>
      </div>
    </div>
  );
}
