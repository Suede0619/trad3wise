"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SITE } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-4 h-14 border-b border-border"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Activity className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">{SITE.name}</div>
          <div className="text-[10px] text-muted-foreground">{SITE.tagline}</div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3 space-y-5">
        {NAV.map((group) => (
          <div key={group.label}>
            <div className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/pricing"
          onClick={onNavigate}
          className="block rounded-md bg-gradient-to-br from-primary/20 to-accent p-3 text-xs"
        >
          <div className="font-semibold text-foreground">Upgrade to Pro</div>
          <div className="text-muted-foreground mt-0.5">
            Unlock the AI agent, API & unlimited alerts.
          </div>
        </Link>
      </div>
    </div>
  );
}
