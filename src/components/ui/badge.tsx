import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-tight",
  {
    variants: {
      variant: {
        default: "border-transparent bg-surface-2 text-foreground",
        primary: "border-primary/30 bg-accent text-accent-foreground",
        up: "border-up/30 bg-up/10 text-up",
        down: "border-down/30 bg-down/10 text-down",
        warn: "border-warn/30 bg-warn/10 text-warn",
        info: "border-info/30 bg-info/10 text-info",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
