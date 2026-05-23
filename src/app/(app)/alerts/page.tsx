"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2, Mail, Smartphone, Monitor } from "lucide-react";
import type { AlertRule } from "@/lib/types";

const KEY = "t3-alerts";

const DEFAULTS: AlertRule[] = [
  { id: "a1", name: "Insider buys on my watchlist", type: "insider-buy", target: "watchlist", condition: "Any insider purchase", channels: ["inapp", "email"], active: true },
  { id: "a2", name: "Large 13F additions", type: "13f-add", target: "any", condition: "Position increase > 25%", channels: ["inapp"], active: true },
  { id: "a3", name: "Dilution filings", type: "dilution", target: "any", condition: "S-1 / 424B5 with dilution language", channels: ["inapp", "push"], active: false },
];

export default function AlertsPage() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [type, setType] = useState<AlertRule["type"]>("insider-buy");
  const [target, setTarget] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    setRules(stored ? JSON.parse(stored) : DEFAULTS);
  }, []);

  const save = (next: AlertRule[]) => {
    setRules(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const add = () => {
    const rule: AlertRule = {
      id: `a${Date.now()}`,
      name: `${type} on ${target || "any"}`,
      type,
      target: target || "any",
      condition: "New matching event",
      channels: ["inapp"],
      active: true,
    };
    save([rule, ...rules]);
    setTarget("");
  };

  const toggle = (id: string) => save(rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  const remove = (id: string) => save(rules.filter((r) => r.id !== id));

  return (
    <div>
      <PageHeader title="Alerts" description="Rule-based notifications for insider buys, 13F changes, new filings, price thresholds, and politician trades." />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> New alert rule</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Trigger</label>
              <Select value={type} onChange={(e) => setType(e.target.value as AlertRule["type"])} className="w-full">
                <option value="insider-buy">Insider buy</option>
                <option value="insider-sell">Insider sell</option>
                <option value="13f-add">13F add</option>
                <option value="13f-trim">13F trim</option>
                <option value="dilution">Dilution filing</option>
                <option value="politician-buy">Politician trade</option>
                <option value="new-filing">New filing</option>
                <option value="price">Price threshold</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Target (ticker or blank for any)</label>
              <Input value={target} onChange={(e) => setTarget(e.target.value.toUpperCase())} placeholder="e.g. NVDA" />
            </div>
            <Button onClick={add} className="w-full"><Bell className="h-4 w-4" /> Create alert</Button>
          </CardContent>
        </Card>

        <div className="space-y-3 lg:col-span-2">
          {rules.length === 0 && <p className="text-sm text-muted-foreground">No alert rules yet.</p>}
          {rules.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{r.name}</span>
                    <Badge variant={r.active ? "up" : "outline"}>{r.active ? "active" : "paused"}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{r.condition} · target: <span className="font-mono">{r.target}</span></div>
                  <div className="mt-2 flex gap-1">
                    {r.channels.includes("inapp") && <Badge variant="outline"><Monitor className="h-3 w-3" /> in-app</Badge>}
                    {r.channels.includes("email") && <Badge variant="outline"><Mail className="h-3 w-3" /> email</Badge>}
                    {r.channels.includes("push") && <Badge variant="outline"><Smartphone className="h-3 w-3" /> push</Badge>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggle(r.id)}>{r.active ? "Pause" : "Resume"}</Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
