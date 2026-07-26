import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { appointments } from "@/lib/mock-data";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Clinicab" },
      { name: "description", content: "Day, week and month views of your clinic schedule." },
    ],
  }),
  component: CalendarPage,
});

type View = "day" | "week" | "month";

function CalendarPage() {
  const [view, setView] = useState<View>("week");
  const [cursor, setCursor] = useState(() => new Date());

  return (
    <AppShell
      title="Calendar"
      subtitle="Drag & drop appointments across the schedule."
      actions={
        <>
          <div className="flex items-center rounded-lg border bg-card p-0.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shift(cursor, view, -1, setCursor)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="h-8 rounded-md px-2 text-xs font-medium" onClick={() => setCursor(new Date())}>Today</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shift(cursor, view, 1, setCursor)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <TabsList className="rounded-lg">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="rounded-lg"><Plus className="mr-2 h-4 w-4" /> New</Button>
        </>
      }
    >
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-3 sm:p-5">
          <div className="mb-3 text-sm font-semibold">
            {cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric", day: view === "day" ? "2-digit" : undefined, weekday: view === "day" ? "long" : undefined })}
          </div>
          {view === "week" && <WeekView cursor={cursor} />}
          {view === "day" && <DayView cursor={cursor} />}
          {view === "month" && <MonthView cursor={cursor} />}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function shift(cursor: Date, view: View, dir: number, set: (d: Date) => void) {
  const d = new Date(cursor);
  if (view === "day") d.setDate(d.getDate() + dir);
  if (view === "week") d.setDate(d.getDate() + 7 * dir);
  if (view === "month") d.setMonth(d.getMonth() + dir);
  set(d);
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function WeekView({ cursor }: { cursor: Date }) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i);
  return (
    <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] gap-px overflow-x-auto rounded-xl border bg-border">
      <div className="bg-card" />
      {days.map((d) => (
        <div key={d.toISOString()} className={`bg-card px-2 py-2 text-center text-xs ${sameDay(d, new Date()) ? "font-bold text-primary" : "text-muted-foreground"}`}>
          <div className="uppercase tracking-wide">{d.toLocaleDateString("en-GB", { weekday: "short" })}</div>
          <div className="text-sm font-semibold text-foreground">{d.getDate()}</div>
        </div>
      ))}
      {hours.map((h) => (
        <FragmentRow key={h} hour={h} days={days} />
      ))}
    </div>
  );
}

function FragmentRow({ hour, days }: { hour: number; days: Date[] }) {
  return (
    <>
      <div className="bg-card px-2 py-6 text-right text-[11px] text-muted-foreground">{hour.toString().padStart(2, "0")}:00</div>
      {days.map((d) => {
        const items = appointments.filter((a) => {
          const dt = new Date(a.date);
          return sameDay(dt, d) && dt.getHours() === hour;
        });
        return (
          <div key={d.toISOString() + hour} className="min-h-[72px] bg-card p-1"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => toast.success("Appointment rescheduled")}>
            {items.map((a) => (
              <div key={a.id} draggable onDragStart={() => {}} className="mb-1 cursor-grab rounded-md border border-primary/20 bg-primary-soft px-2 py-1 text-[11px] leading-tight text-accent-foreground shadow-sm active:cursor-grabbing">
                <div className="truncate font-semibold">{a.patientName}</div>
                <div className="truncate text-[10px] text-muted-foreground">{a.reason}</div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

function DayView({ cursor }: { cursor: Date }) {
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i);
  return (
    <div className="divide-y rounded-xl border">
      {hours.map((h) => {
        const items = appointments.filter((a) => { const dt = new Date(a.date); return sameDay(dt, cursor) && dt.getHours() === h; });
        return (
          <div key={h} className="grid grid-cols-[80px_1fr] gap-3 p-3"
            onDragOver={(e) => e.preventDefault()} onDrop={() => toast.success("Appointment rescheduled")}>
            <div className="text-xs text-muted-foreground">{h.toString().padStart(2, "0")}:00</div>
            <div className="flex flex-wrap gap-2">
              {items.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
              {items.map((a) => (
                <div key={a.id} draggable className="min-w-[180px] cursor-grab rounded-lg border border-primary/20 bg-primary-soft p-2 text-xs">
                  <div className="flex items-center justify-between"><span className="font-semibold">{a.patientName}</span><StatusBadge status={a.status} /></div>
                  <div className="text-[11px] text-muted-foreground">{a.reason} · {a.doctorName}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MonthView({ cursor }: { cursor: Date }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  const days = useMemo(() => Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; }), [start]);
  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border">
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="bg-card px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{d}</div>)}
      {days.map((d) => {
        const items = appointments.filter((a) => sameDay(new Date(a.date), d));
        const other = d.getMonth() !== cursor.getMonth();
        return (
          <div key={d.toISOString()} className={`min-h-[100px] bg-card p-2 ${other ? "opacity-40" : ""}`}>
            <div className={`text-[11px] font-semibold ${sameDay(d, new Date()) ? "text-primary" : "text-foreground"}`}>{d.getDate()}</div>
            <div className="mt-1 space-y-1">
              {items.slice(0, 2).map((a) => (
                <div key={a.id} className="truncate rounded bg-primary-soft px-1.5 py-0.5 text-[10px] text-accent-foreground">{new Date(a.date).getHours()}:00 {a.patientName.split(" ")[0]}</div>
              ))}
              {items.length > 2 && <div className="text-[10px] text-muted-foreground">+{items.length - 2} more</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
