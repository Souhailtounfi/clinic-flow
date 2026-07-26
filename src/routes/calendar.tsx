import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, GripVertical } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { appointments as seedAppointments, type Appointment } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendrier — Clinicab" },
      { name: "description", content: "Vues jour, semaine et mois de votre planning." },
    ],
  }),
  component: CalendarPage,
});

type View = "day" | "week" | "month";

function CalendarPage() {
  const { t, lang } = useI18n();
  const [view, setView] = useState<View>("week");
  const [cursor, setCursor] = useState(() => new Date());
  const [events, setEvents] = useState<Appointment[]>(seedAppointments);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropKey, setDropKey] = useState<string | null>(null);
  const localeTag = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-MA" : "en-GB";

  const moveTo = (id: string, target: Date) => {
    setEvents((evts) =>
      evts.map((a) => {
        if (a.id !== id) return a;
        const d = new Date(a.date);
        const nd = new Date(target);
        // Preserve minutes if week/day drop (hour granularity), else keep original time
        nd.setMinutes(d.getMinutes(), 0, 0);
        return { ...a, date: nd.toISOString() };
      }),
    );
    toast.success(t("apt.rescheduled"));
  };

  const onCardDragStart = (id: string) => (e: React.DragEvent) => {
    setDragId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onCellDragOver = (key: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropKey !== key) setDropKey(key);
  };
  const onCellDragLeave = () => setDropKey(null);
  const onCellDrop = (target: Date) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    setDragId(null);
    setDropKey(null);
    if (id) moveTo(id, target);
  };

  const dragCtx = { onCardDragStart, onCellDragOver, onCellDragLeave, onCellDrop, dropKey, dragId };

  return (
    <AppShell
      title={t("cal.title")}
      subtitle={t("cal.subtitle")}
      actions={
        <>
          <div className="flex items-center rounded-lg border bg-card p-0.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shift(cursor, view, -1, setCursor)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="h-8 rounded-md px-2 text-xs font-medium" onClick={() => setCursor(new Date())}>{t("common.today")}</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shift(cursor, view, 1, setCursor)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <TabsList className="rounded-lg">
              <TabsTrigger value="day">{t("cal.day")}</TabsTrigger>
              <TabsTrigger value="week">{t("cal.week")}</TabsTrigger>
              <TabsTrigger value="month">{t("cal.month")}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="rounded-lg"><Plus className="mr-2 h-4 w-4" /> {t("cal.new")}</Button>
        </>
      }
    >
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-3 sm:p-5">
          <div className="mb-3 text-sm font-semibold capitalize">
            {cursor.toLocaleDateString(localeTag, { month: "long", year: "numeric", day: view === "day" ? "2-digit" : undefined, weekday: view === "day" ? "long" : undefined })}
          </div>
          {view === "week" && <WeekView cursor={cursor} events={events} localeTag={localeTag} drag={dragCtx} />}
          {view === "day" && <DayView cursor={cursor} events={events} drag={dragCtx} />}
          {view === "month" && <MonthView cursor={cursor} events={events} drag={dragCtx} tMore={t("cal.more")} />}
        </CardContent>
      </Card>
    </AppShell>
  );
}

type DragCtx = {
  onCardDragStart: (id: string) => (e: React.DragEvent) => void;
  onCellDragOver: (key: string) => (e: React.DragEvent) => void;
  onCellDragLeave: () => void;
  onCellDrop: (target: Date) => (e: React.DragEvent) => void;
  dropKey: string | null;
  dragId: string | null;
};

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

function EventChip({ a, onDragStart, dragging }: { a: Appointment; onDragStart: (e: React.DragEvent) => void; dragging: boolean }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        "group mb-1 flex cursor-grab items-start gap-1 rounded-md border border-primary/25 bg-primary-soft px-1.5 py-1 text-[11px] leading-tight text-accent-foreground shadow-sm transition active:cursor-grabbing",
        dragging && "opacity-40",
      )}
      title={`${a.patientName} · ${a.reason}`}
    >
      <GripVertical className="mt-0.5 h-3 w-3 shrink-0 text-primary/60 opacity-0 group-hover:opacity-100" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{a.patientName}</div>
        <div className="truncate text-[10px] text-muted-foreground">{a.reason}</div>
      </div>
    </div>
  );
}

function WeekView({ cursor, events, localeTag, drag }: { cursor: Date; events: Appointment[]; localeTag: string; drag: DragCtx }) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i);
  return (
    <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] gap-px overflow-x-auto rounded-xl border bg-border">
      <div className="bg-card" />
      {days.map((d) => (
        <div key={d.toISOString()} className={`bg-card px-2 py-2 text-center text-xs ${sameDay(d, new Date()) ? "font-bold text-primary" : "text-muted-foreground"}`}>
          <div className="uppercase tracking-wide">{d.toLocaleDateString(localeTag, { weekday: "short" })}</div>
          <div className="text-sm font-semibold text-foreground">{d.getDate()}</div>
        </div>
      ))}
      {hours.map((h) => (
        <FragmentRow key={h} hour={h} days={days} events={events} drag={drag} />
      ))}
    </div>
  );
}

function FragmentRow({ hour, days, events, drag }: { hour: number; days: Date[]; events: Appointment[]; drag: DragCtx }) {
  return (
    <>
      <div className="bg-card px-2 py-6 text-right text-[11px] text-muted-foreground">{hour.toString().padStart(2, "0")}:00</div>
      {days.map((d) => {
        const target = new Date(d); target.setHours(hour, 0, 0, 0);
        const key = `${d.toDateString()}-${hour}`;
        const items = events.filter((a) => { const dt = new Date(a.date); return sameDay(dt, d) && dt.getHours() === hour; });
        return (
          <div
            key={key}
            className={cn("min-h-[72px] bg-card p-1 transition-colors", drag.dropKey === key && "bg-primary/10 ring-2 ring-inset ring-primary/40")}
            onDragOver={drag.onCellDragOver(key)}
            onDragLeave={drag.onCellDragLeave}
            onDrop={drag.onCellDrop(target)}
          >
            {items.map((a) => (
              <EventChip key={a.id} a={a} onDragStart={drag.onCardDragStart(a.id)} dragging={drag.dragId === a.id} />
            ))}
          </div>
        );
      })}
    </>
  );
}

function DayView({ cursor, events, drag }: { cursor: Date; events: Appointment[]; drag: DragCtx }) {
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i);
  return (
    <div className="divide-y rounded-xl border">
      {hours.map((h) => {
        const target = new Date(cursor); target.setHours(h, 0, 0, 0);
        const key = `${cursor.toDateString()}-${h}`;
        const items = events.filter((a) => { const dt = new Date(a.date); return sameDay(dt, cursor) && dt.getHours() === h; });
        return (
          <div
            key={h}
            className={cn("grid grid-cols-[80px_1fr] gap-3 p-3 transition-colors", drag.dropKey === key && "bg-primary/10")}
            onDragOver={drag.onCellDragOver(key)}
            onDragLeave={drag.onCellDragLeave}
            onDrop={drag.onCellDrop(target)}
          >
            <div className="text-xs text-muted-foreground">{h.toString().padStart(2, "0")}:00</div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {items.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
              {items.map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={drag.onCardDragStart(a.id)}
                  className={cn(
                    "min-w-[180px] cursor-grab rounded-lg border border-primary/25 bg-primary-soft p-2 text-xs active:cursor-grabbing",
                    drag.dragId === a.id && "opacity-40",
                  )}
                >
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

function MonthView({ cursor, events, drag, tMore }: { cursor: Date; events: Appointment[]; drag: DragCtx; tMore: string }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  const days = useMemo(() => Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; }), [start]);
  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border">
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="bg-card px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{d}</div>)}
      {days.map((d) => {
        const items = events.filter((a) => sameDay(new Date(a.date), d));
        const other = d.getMonth() !== cursor.getMonth();
        const key = `m-${d.toDateString()}`;
        const target = new Date(d); target.setHours(9, 0, 0, 0);
        return (
          <div
            key={d.toISOString()}
            className={cn("min-h-[100px] bg-card p-2 transition-colors", other && "opacity-40", drag.dropKey === key && "bg-primary/10 ring-2 ring-inset ring-primary/40")}
            onDragOver={drag.onCellDragOver(key)}
            onDragLeave={drag.onCellDragLeave}
            onDrop={drag.onCellDrop(target)}
          >
            <div className={`text-[11px] font-semibold ${sameDay(d, new Date()) ? "text-primary" : "text-foreground"}`}>{d.getDate()}</div>
            <div className="mt-1 space-y-1">
              {items.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={drag.onCardDragStart(a.id)}
                  className={cn(
                    "truncate cursor-grab rounded bg-primary-soft px-1.5 py-0.5 text-[10px] text-accent-foreground active:cursor-grabbing",
                    drag.dragId === a.id && "opacity-40",
                  )}
                >
                  {new Date(a.date).getHours()}:00 {a.patientName.split(" ")[0]}
                </div>
              ))}
              {items.length > 3 && <div className="text-[10px] text-muted-foreground">+{items.length - 3} {tMore}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
