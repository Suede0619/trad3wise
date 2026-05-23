"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("t3-cookie-consent")) setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = (v: string) => {
    localStorage.setItem("t3-cookie-consent", v);
    setShow(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-2xl rounded-lg border border-border bg-popover p-4 shadow-xl sm:inset-x-auto sm:right-4">
      <p className="text-xs text-muted-foreground">
        We use cookies to keep you signed in, remember preferences, and measure usage. See our{" "}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => dismiss("all")}>Accept all</Button>
        <Button size="sm" variant="outline" onClick={() => dismiss("essential")}>
          Essential only
        </Button>
      </div>
    </div>
  );
}
