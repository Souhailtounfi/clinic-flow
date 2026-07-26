import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, Users, CalendarClock, UserX } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { revenueByMonth, attendanceByMonth, patients } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Rapports — Clinicab" },
      { name: "description", content: "Revenus, rendez-vous, présence et rapports patients." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { t } = useI18n();
  const topPatients = [...patients].sort((a, b) => b.totalVisits - a.totalVisits).slice(0, 8);
  const pie = [
    { name: t("status.present"), value: 88, color: "oklch(0.68 0.16 155)" },
    { name: t("status.absent"), value: 7, color: "oklch(0.6 0.22 27)" },
    { name: t("status.cancelled"), value: 5, color: "oklch(0.78 0.15 75)" },
  ];

  return (
    <AppShell
      title={t("rep.title")}
      subtitle={t("rep.subtitle")}
      actions={<Button variant="outline" className="rounded-lg" onClick={() => toast.success(t("rep.exportReady"))}><Download className="mr-2 h-4 w-4" /> {t("common.exportCSV")}</Button>}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <ReportStat icon={TrendingUp} label={t("rep.revenueMTD")} value="128,400 MAD" delta="+18%" />
        <ReportStat icon={CalendarClock} label={t("rep.aptMTD")} value="312" delta="+9%" />
        <ReportStat icon={Users} label={t("rep.newPatients")} value="41" delta="+12%" />
        <ReportStat icon={UserX} label={t("rep.missed")} value="18" delta="-3" />
      </div>

      <Tabs defaultValue="revenue" className="mt-6">
        <TabsList className="rounded-xl bg-secondary/60">
          <TabsTrigger value="revenue" className="rounded-lg">{t("rep.tab.revenue")}</TabsTrigger>
          <TabsTrigger value="appointments" className="rounded-lg">{t("rep.tab.appointments")}</TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-lg">{t("rep.tab.attendance")}</TabsTrigger>
          <TabsTrigger value="patients" className="rounded-lg">{t("rep.tab.patients")}</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5">
            <div className="text-sm font-semibold">{t("rep.monthlyRevenue")}</div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByMonth} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <defs><linearGradient id="r2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.55 0.18 258)" stopOpacity={0.35} /><stop offset="100%" stopColor="oklch(0.55 0.18 258)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 258)" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 258)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.55 0.18 258)" strokeWidth={2.5} fill="url(#r2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5">
            <div className="text-sm font-semibold">{t("rep.aptPerMonth")}</div>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 258)" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 258)" }} />
                  <Bar dataKey="appointments" fill="oklch(0.55 0.18 258)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5">
              <div className="text-sm font-semibold">{t("rep.attendanceTrend")}</div>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceByMonth} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 258)" vertical={false} />
                    <XAxis dataKey="month" stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 258)" }} />
                    <Bar dataKey="present" fill="oklch(0.68 0.16 155)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="absent" fill="oklch(0.6 0.22 27)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent></Card>
            <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5">
              <div className="text-sm font-semibold">{t("rep.attendanceBreak")}</div>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                      {pie.map((p) => <Cell key={p.name} fill={p.color} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5">
            <div className="mb-3 text-sm font-semibold">{t("rep.topPatients")}</div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="bg-secondary/40 hover:bg-secondary/40">
                  <TableHead>{t("common.patient")}</TableHead><TableHead>{t("common.city")}</TableHead><TableHead>{t("rep.visits")}</TableHead><TableHead>{t("pat.lastVisit")}</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {topPatients.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.firstName} {p.lastName}</TableCell>
                      <TableCell className="text-sm">{p.city}</TableCell>
                      <TableCell className="text-sm font-semibold">{p.totalVisits}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.lastVisit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function ReportStat({ icon: Icon, label, value, delta }: { icon: any; label: string; value: string; delta: string }) {
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
