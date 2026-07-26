import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Check, CalendarClock, Wallet, Settings } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Clinicab" },
      { name: "description", content: "Reminders and clinic activity notifications." },
    ],
  }),
  component: NotificationsPage,
});

const kindIcon: Record<string, any> = { appointment: CalendarClock, payment: Wallet, system: Settings };

function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => !n.read).length;

  return (
    <AppShell
      title="Notifications"
      subtitle={`${unread} unread`}
      actions={<Button variant="outline" onClick={() => { setItems(items.map((n) => ({ ...n, read: true }))); toast.success("All marked read"); }}><Check className="mr-2 h-4 w-4" /> Mark all read</Button>}
    >
      <Tabs defaultValue="all">
        <TabsList className="rounded-xl bg-secondary/60">
          <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
          <TabsTrigger value="unread" className="rounded-lg">Unread</TabsTrigger>
          <TabsTrigger value="today" className="rounded-lg">Today</TabsTrigger>
        </TabsList>
        {(["all", "unread", "today"] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-0">
              <ul className="divide-y">
                {items
                  .filter((n) => tab === "all" || (tab === "unread" ? !n.read : n.time.includes("ago") || n.time.includes("min")))
                  .map((n) => {
                    const Icon = kindIcon[n.kind] ?? Bell;
                    return (
                      <li key={n.id} className={cn("flex items-start gap-3 p-4 transition hover:bg-secondary/30", !n.read && "bg-primary-soft/30")}>
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground"><Icon className="h-4 w-4" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium">{n.title}</span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{n.body}</div>
                        </div>
                        {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </li>
                    );
                  })}
              </ul>
            </CardContent></Card>
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}
