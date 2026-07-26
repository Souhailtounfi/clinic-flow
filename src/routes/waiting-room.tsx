import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Play, Check, Users } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { waitingRoom } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/waiting-room")({
  head: () => ({
    meta: [
      { title: "Salle d'attente — Clinicab" },
      { name: "description", content: "File d'attente en direct des patients." },
    ],
  }),
  component: WaitingRoomPage,
});

function minutesSince(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

function WaitingRoomPage() {
  const { t, lang } = useI18n();
  const localeTag = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-MA" : "en-GB";
  const [queue, setQueue] = useState(waitingRoom);

  const setStatus = (id: string, s: typeof waitingRoom[number]["status"]) => {
    setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: s } : x)));
    toast.success(s === "in_consultation" ? t("wait.startedToast") : s === "done" ? t("wait.finishedToast") : t("wait.updated"));
  };

  const stats = [
    { label: t("wait.inQueue"), value: queue.filter((q) => q.status === "waiting").length, icon: Users },
    { label: t("wait.inConsult"), value: queue.filter((q) => q.status === "in_consultation").length, icon: Play },
    { label: t("wait.avgWait"), value: `${Math.round(queue.reduce((s, x) => s + minutesSince(x.arrivedAt), 0) / Math.max(queue.length, 1))} ${t("wait.min")}`, icon: Clock },
  ];

  return (
    <AppShell title={t("wait.title")} subtitle={t("wait.subtitle")}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-accent-foreground"><s.icon className="h-4 w-4" /></div>
              <div><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {queue.map((entry) => (
          <Card key={entry.id} className="rounded-2xl border-border/60 shadow-sm transition hover:shadow-md">
            <CardContent className="flex flex-wrap items-center gap-4 p-4">
              <Avatar className="h-11 w-11"><AvatarFallback className="bg-primary-soft text-accent-foreground font-semibold">{entry.patientName.split(" ").map((x) => x[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <Link to="/patients/$id" params={{ id: entry.patientId }} className="truncate text-sm font-semibold hover:underline">{entry.patientName}</Link>
                <div className="truncate text-xs text-muted-foreground">{entry.reason}</div>
              </div>
              <div className="hidden text-right text-xs sm:block">
                <div className="text-muted-foreground">{t("wait.arrived")} {new Date(entry.arrivedAt).toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit" })}</div>
                <div className="font-semibold">{t("wait.waitingFor")} {minutesSince(entry.arrivedAt)} {t("wait.min")}</div>
              </div>
              <StatusBadge status={entry.status} />
              <div className="flex gap-2">
                {entry.status === "waiting" && <Button size="sm" onClick={() => setStatus(entry.id, "in_consultation")}><Play className="mr-1.5 h-3.5 w-3.5" /> {t("wait.start")}</Button>}
                {entry.status === "in_consultation" && <Button size="sm" variant="outline" onClick={() => setStatus(entry.id, "done")}><Check className="mr-1.5 h-3.5 w-3.5" /> {t("wait.finish")}</Button>}
                <Button size="sm" variant="outline" asChild><Link to="/consultations">{t("common.open")}</Link></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
