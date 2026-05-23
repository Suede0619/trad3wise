"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import { CommandPalette } from "./command-palette";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Menu, X, Bell, Sparkles } from "lucide-react";

export function Topbar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNav(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <button
          onClick={() => setPaletteOpen(true)}
          className="flex h-9 flex-1 max-w-md items-center gap-2 rounded-md border border-input bg-surface px-3 text-sm text-muted-foreground hover:bg-surface-2"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search markets…</span>
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] sm:block">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="up" className="hidden sm:inline-flex">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-up" />
            Live
          </Badge>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/alerts" aria-label="Alerts">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/ai">
              <Sparkles className="h-4 w-4" /> Ask AI
            </Link>
          </Button>
          <Link
            href="/account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-xs font-medium"
            aria-label="Account"
          >
            T3
          </Link>
        </div>
      </header>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />

      {/* Mobile nav drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileNav(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 h-full w-72 border-r border-border bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileNav(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sidebar onNavigate={() => setMobileNav(false)} />
          </div>
        </div>
      )}
    </>
  );
}
