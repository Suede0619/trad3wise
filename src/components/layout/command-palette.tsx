"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { NAV } from "@/lib/config";
import type { SearchResult } from "@/app/api/search/route";
import { Search, CornerDownLeft } from "lucide-react";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const ctrl = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setResults(d.results || []))
      .catch(() => {});
    return () => ctrl.abort();
  }, [query, open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router, setOpen],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        shouldFilter={false}
        loop
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search companies, insiders, institutions, ETFs…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto scrollbar-thin p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          {!query && (
            <Command.Group
              heading="Navigate"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {NAV.flatMap((g) => g.items).map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.href}
                    value={item.label}
                    onSelect={() => go(item.href)}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-surface-2"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Command.Item>
                );
              })}
            </Command.Group>
          )}

          {results.length > 0 && (
            <Command.Group
              heading="Results"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {results.map((r) => (
                <Command.Item
                  key={r.href}
                  value={r.href}
                  onSelect={() => go(r.href)}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-surface-2"
                >
                  <div className="min-w-0">
                    <div className="truncate">{r.label}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.sub}</div>
                  </div>
                  <span className="rounded border border-border px-1.5 py-0.5 text-[10px] capitalize text-muted-foreground">
                    {r.type}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
        <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
          <CornerDownLeft className="h-3 w-3" /> to select
        </div>
      </Command>
    </div>
  );
}
