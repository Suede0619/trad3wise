"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function EntityTabs({
  base,
  tabs,
}: {
  base: string;
  tabs: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border scrollbar-thin">
      {tabs.map((t) => {
        const href = base + t.href;
        const active = pathname === href || (t.href === "" && pathname === base);
        return (
          <Link
            key={t.href}
            href={href}
            className={cn(
              "whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
