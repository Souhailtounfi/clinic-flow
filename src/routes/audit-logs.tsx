import { createFileRoute } from "@tanstack/react-router";
import { Search, ScrollText } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { auditLogs } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Journaux d'audit — Clinicab" },
      { name: "description", content: "Toutes les actions effectuées dans le cabinet." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const rows = auditLogs.filter((l) => !q || `${l.who} ${l.action} ${l.target}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell title={t("audit.title")} subtitle={t("audit.subtitle")}>
      <Card className="rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("audit.searchPh")} value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
        </div>
      </Card>
      <Card className="mt-4 overflow-hidden rounded-2xl border-border/60 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead>{t("audit.who")}</TableHead><TableHead>{t("audit.action")}</TableHead><TableHead>{t("audit.target")}</TableHead><TableHead className="text-right">{t("audit.when")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.who}</TableCell>
                  <TableCell><Badge variant="secondary" className="rounded-full font-normal"><ScrollText className="mr-1.5 h-3 w-3" /> {l.action}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.target}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{l.when}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  );
}
