import { Badge } from "@/components/ui/badge";
import type { SignalFlag } from "@/lib/types";
import {
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  MinusCircle,
  Droplets,
  Vote,
  Zap,
  FileText,
} from "lucide-react";

const MAP: Record<SignalFlag, { label: string; variant: "up" | "down" | "warn" | "info" | "primary"; Icon: typeof Zap }> = {
  "insider-buy": { label: "Insider Buy", variant: "up", Icon: ArrowUpRight },
  "insider-sell": { label: "Insider Sell", variant: "down", Icon: ArrowDownRight },
  "13f-add": { label: "13F Add", variant: "up", Icon: PlusCircle },
  "13f-trim": { label: "13F Trim", variant: "down", Icon: MinusCircle },
  dilution: { label: "Dilution", variant: "warn", Icon: Droplets },
  "politician-buy": { label: "Politician", variant: "info", Icon: Vote },
  "unusual-volume": { label: "Unusual Vol", variant: "warn", Icon: Zap },
  "new-filing": { label: "New Filing", variant: "primary", Icon: FileText },
};

export function SignalBadge({ kind }: { kind: SignalFlag }) {
  const m = MAP[kind];
  if (!m) return null;
  const { label, variant, Icon } = m;
  return (
    <Badge variant={variant}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
