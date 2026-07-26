import { createFileRoute } from "@tanstack/react-router";
import { Building2, TrendingUp, Users, Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { clinics, revenueByMonth } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Super Admin — Clinicab" },
      { name: "description", content: "Vue plateforme sur tous les cabinets et abonnements." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { t } = useI18n();
  const active = clinics.filter((c) => c.status === "active").length;
  const inactive = clinics.length - active;
  const totalRevenue = clinics.reduce((s, c) => s + c.revenueMAD, 0);
  const totalPatients = clinics.reduce((s, c) => s + c.patients, 0);

  return (
    <AppShell title={t("adm.title")} subtitle={t("adm.subtitle")}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AdminStat icon={Building2} label={t("adm.activeClinics")} value={active.toString()} delta={`${inactive} ${t("adm.inactive")}`} />
        <AdminStat icon={Users} label={t("adm.totalPatients")} value={totalPatients.toLocaleString()} delta={`+312 ${t("adm.week")}`} />
        <AdminStat icon={TrendingUp} label={t("adm.mrr")} value={`${totalRevenue.toLocaleString()} MAD`} delta="+22%" />
        <AdminStat icon={Activity} label={t("adm.uptime")} value="99.98%" delta="30d" />
      </div>

      <Card className="mt-6 rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-5">
          <div className="mb-4 text-sm font-semibold">{t("adm.platformRevenue")}</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.55 0.18 258)" stopOpacity={0.35} /><stop offset="100%" stopColor="oklch(0.55 0.18 258)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 258)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 258)" }} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.55 0.18 258)" strokeWidth={2.5} fill="url(#ar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 overflow-hidden rounded-2xl border-border/60 shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <div className="text-sm font-semibold">{t("adm.clinics")} ({clinics.length})</div>
          <Button size="sm" onClick={() => toast.success(t("adm.inviteSent"))}>{t("adm.invite")}</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead>{t("adm.clinics")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("common.city")}</TableHead>
                <TableHead>{t("adm.plan")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("adm.doctors")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("nav.patients")}</TableHead>
                <TableHead>{t("adm.revenue")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-accent-foreground"><Building2 className="h-4 w-4" /></div>
                      <div><div className="text-sm font-medium">{c.name}</div><div className="text-[11px] text-muted-foreground">{t("adm.since")} {c.since}</div></div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{c.city}</TableCell>
                  <TableCell><Badge variant="secondary" className="rounded-full">{c.plan}</Badge></TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{c.doctors}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{c.patients}</TableCell>
                  <TableCell className="text-sm font-semibold">{c.revenueMAD.toLocaleString()} MAD</TableCell>
                  <TableCell>
                    {c.status === "active"
                      ? <Badge className="rounded-full bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)] hover:bg-[oklch(0.94_0.06_155)]">{t("status.active")}</Badge>
                      : <Badge variant="secondary" className="rounded-full">{t("status.inactive")}</Badge>}
                  </TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => toast(t("adm.managing"))}>{t("adm.manage")}</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  );
}

function AdminStat({ icon: Icon, label, value, delta }: { icon: any; label: string; value: string; delta: string }) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-accent-foreground"><Icon className="h-4 w-4" /></div>
          <span className="text-[11px] font-medium text-muted-foreground">{delta}</span>
        </div>
        <div className="mt-3 text-xl font-bold">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
