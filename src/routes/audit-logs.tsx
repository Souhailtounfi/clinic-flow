import { createFileRoute } from "@tanstack/react-router";
import { Search, ScrollText } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { auditLogs } from "@/lib/mock-data";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Clinicab" },
      { name: "description", content: "Track every action performed in your clinic workspace." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const [q, setQ] = useState("");
  const rows = auditLogs.filter((l) => !q || `${l.who} ${l.action} ${l.target}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell title="Audit logs" subtitle="Every action, forever traceable">
      <Card className="rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search actions…" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
        </div>
      </Card>
      <Card className="mt-4 overflow-hidden rounded-2xl border-border/60 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead>Who</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead><TableHead className="text-right">When</TableHead>
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
