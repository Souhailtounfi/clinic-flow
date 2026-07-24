import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, CalendarClock, Armchair, UserX, TrendingUp, Wallet,
  ArrowUpRight, Clock, Activity, Bell,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { appointments, notifications, revenueByMonth, attendanceByMonth } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Medicab" },
      { name: "description", content: "Today's clinic activity, revenue and upcoming appointments at a glance." },
      { property: "og:title", content: "Dashboard — Medicab" },
      { property: "og:description", content: "Your clinic day, unified." },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  { label: "Today's Appointments", value: "24", delta: "+3", icon: CalendarClock, tone: "primary" as const },
  { label: "Patients Waiting", value: "5", delta: "live", icon: Armchair, tone: "warning" as const },
  { label: "Present Today", value: "18", delta: "+2", icon: Users, tone: "success" as const },
  { label: "Absent Today", value: "2", delta: "-1", icon: UserX, tone: "destructive" as const },
  { label: "Revenue Today", value: "4,850 MAD", delta: "+12%", icon: Wallet, tone: "primary" as const },
  { label: "Revenue This Month", value: "128,400 MAD", delta: "+18%", icon: TrendingUp, tone: "success" as const },
];

const toneMap: Record<string, string> = {
  primary: "bg-primary-soft text-accent-foreground",
  success: "bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)]",
  warning: "bg-[oklch(0.96_0.06_75)] text-[oklch(0.45_0.12_75)]",
  destructive: "bg-[oklch(0.95_0.05_27)] text-[oklch(0.45_0.18_27)]",
};

function DashboardPage() {
  const upcoming = appointments
    .filter((a) => new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  return (
    <AppShell
      title="Good morning, Kaoutar"
      subtitle="Here's what's happening in your clinic today."
      actions={
        <>
          <Button variant="outline" className="rounded-lg">Export</Button>
          <Button asChild className="rounded-lg"><Link to="/appointments">New appointment</Link></Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`grid h-9 w-9 place-items-center rounded-lg ${toneMap[s.tone]}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{s.delta}</span>
              </div>
              <div className="mt-3 text-xl font-bold tracking-tight">{s.value}</div>
              <div className="text-[11px] font-medium text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Monthly revenue</div>
                <div className="text-xs text-muted-foreground">Last 7 months · MAD</div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">View report <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByMonth} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.18 258)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.55 0.18 258)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 258)" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 258)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.55 0.18 258)" strokeWidth={2.5} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Attendance rate</div>
                <div className="text-xs text-muted-foreground">Present vs absent</div>
              </div>
              <span className="rounded-full bg-[oklch(0.94_0.06_155)] px-2 py-0.5 text-[11px] font-medium text-[oklch(0.35_0.12_155)]">93%</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceByMonth} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 258)" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 258)" }} />
                  <Line type="monotone" dataKey="present" stroke="oklch(0.68 0.16 155)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="absent" stroke="oklch(0.6 0.22 27)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Appointments per month</div>
                <div className="text-xs text-muted-foreground">Volume trend</div>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 258)" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.55 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 258)" }} />
                  <Bar dataKey="appointments" fill="oklch(0.55 0.18 258)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Today's notifications</div>
              <Link to="/notifications" className="text-xs font-medium text-primary hover:underline">View all</Link>
            </div>
            <ul className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <li key={n.id} className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{n.title}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{n.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Upcoming appointments</div>
              <Link to="/appointments" className="text-xs font-medium text-primary hover:underline">See all</Link>
            </div>
            <div className="divide-y">
              {upcoming.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-3">
                  <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary-soft text-accent-foreground text-xs font-semibold">{a.patientName.split(" ").map(x => x[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.patientName}</div>
                    <div className="truncate text-xs text-muted-foreground">{a.reason} · {a.doctorName}</div>
                  </div>
                  <div className="hidden text-right text-xs text-muted-foreground sm:block">
                    <div className="font-medium text-foreground">{new Date(a.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</div>
                    <div>{new Date(a.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Recent activity</div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <ol className="space-y-4">
              {[
                { who: "Sara Bennani", what: "created an appointment for Youssef El Amrani", when: "2 min ago" },
                { who: "Dr. Idrissi", what: "finished consultation with Salma Alaoui", when: "18 min ago" },
                { who: "Sara Bennani", what: "marked payment of 400 MAD as paid", when: "42 min ago" },
                { who: "Imane Tazi", what: "sent reminder to 12 patients", when: "1 h ago" },
                { who: "Dr. Benali", what: "prescribed medication to Omar Bennani", when: "3 h ago" },
              ].map((a, i) => (
                <li key={i} className="flex gap-3">
                  <div className="relative">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-accent-foreground text-[11px] font-semibold">
                      {a.who.split(" ").map(x => x[0]).join("").slice(0, 2)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="text-foreground"><span className="font-semibold">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></div>
                    <div className="mt-0.5 flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {a.when}</div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
