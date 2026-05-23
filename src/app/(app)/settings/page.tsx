import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Settings" };

function Toggle({ label, desc, on }: { label: string; desc: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <div className={`h-5 w-9 rounded-full p-0.5 ${on ? "bg-primary" : "bg-surface-2"}`}>
        <div className={`h-4 w-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Profile, notifications, and appearance." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Name</label>
              <Input defaultValue="Trad3wise User" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Email</label>
              <Input defaultValue="user@trad3wise.app" type="email" />
            </div>
            <Button size="sm">Save changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border">
            <Toggle label="In-app alerts" desc="Show signals in the notification center" on />
            <Toggle label="Email digests" desc="Daily summary of your signals" on />
            <Toggle label="Web push" desc="Browser push for real-time alerts" />
            <Toggle label="Product updates" desc="Occasional news about new features" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm">Theme</div>
              <Badge variant="outline">Dark (locked)</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Danger zone</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm">Export my data</Button>
            <Button variant="destructive" size="sm">Delete account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
