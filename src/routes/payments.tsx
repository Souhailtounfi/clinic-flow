import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Wallet, Filter, Plus, ArrowUpRight } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { payments } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Paiements — Clinicab" },
      { name: "description", content: "Suivi des paiements et revenus du cabinet." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = payments.filter((p) => (status === "all" || p.status === status) && (!q || p.patientName.toLowerCase().includes(q.toLowerCase())));
  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const outstanding = payments.filter((p) => p.status === "unpaid").reduce((s, p) => s + p.amount, 0);

  return (
    <AppShell
      title={t("pay.title")}
      subtitle={t("pay.subtitle")}
      actions={<Button className="rounded-lg" onClick={() => toast.success(t("pay.recorded"))}><Plus className="mr-2 h-4 w-4" /> {t("pay.record")}</Button>}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label={t("pay.revenueMonth")} value={`${paid.toLocaleString()} MAD`} delta="+18%" tone="success" />
        <StatCard label={t("pay.outstanding")} value={`${outstanding.toLocaleString()} MAD`} delta={`${payments.filter(p => p.status === "unpaid").length} ${t("pay.invoices")}`} tone="warning" />
        <StatCard label={t("pay.avg")} value={`${Math.round(paid / Math.max(payments.filter(p => p.status === "paid").length, 1))} MAD`} delta="—" tone="primary" />
      </div>

      <Card className="mt-4 rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("apt.searchPh")} value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-[150px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="paid">{t("pay.paid")}</SelectItem>
              <SelectItem value="unpaid">{t("pay.unpaid")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden rounded-2xl border-border/60 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead>{t("common.patient")}</TableHead>
                <TableHead>{t("common.amount")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("common.method")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("common.date")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 20).map((p) => (
                <TableRow key={p.id} className="hover:bg-secondary/30">
                  <TableCell className="font-medium">{p.patientName}</TableCell>
                  <TableCell className="text-sm font-semibold">{p.amount.toLocaleString()} MAD</TableCell>
                  <TableCell className="hidden md:table-cell text-sm capitalize">{p.method}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{p.date}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right">
                    {p.status === "unpaid"
                      ? <Button size="sm" variant="outline" onClick={() => toast.success(t("pay.markedPaid"))}>{t("pay.markPaid")}</Button>
                      : <Button size="sm" variant="ghost" className="text-xs text-muted-foreground">{t("common.receipt")} <ArrowUpRight className="ml-1 h-3 w-3" /></Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  );
}

function StatCard({ label, value, delta, tone }: { label: string; value: string; delta: string; tone: "success" | "warning" | "primary" }) {
  const map: Record<string, string> = {
    success: "bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)]",
    warning: "bg-[oklch(0.96_0.06_75)] text-[oklch(0.45_0.12_75)]",
    primary: "bg-primary-soft text-accent-foreground",
  };
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`grid h-9 w-9 place-items-center rounded-lg ${map[tone]}`}><Wallet className="h-4 w-4" /></div>
          <span className="text-[11px] font-medium text-muted-foreground">{delta}</span>
        </div>
        <div className="mt-3 text-xl font-bold">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
