import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Activity className="h-6 w-6" />
      </span>
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
