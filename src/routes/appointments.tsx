import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Filter, Search } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { appointments } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Rendez-vous — Clinicab" },
      { name: "description", content: "Gérez tous les rendez-vous du cabinet." },
    ],
  }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const localeTag = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-MA" : "en-GB";

  const rows = appointments
    .filter((a) => (status === "all" || a.status === status) && (!q || a.patientName.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppShell
      title={t("apt.title")}
      subtitle={t("apt.subtitle", { n: appointments.length })}
      actions={<NewAppointment />}
    >
      <Card className="rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("apt.searchPh")} value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-[190px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allStatuses")}</SelectItem>
              <SelectItem value="scheduled">{t("status.scheduled")}</SelectItem>
              <SelectItem value="confirmed">{t("status.confirmed")}</SelectItem>
              <SelectItem value="present">{t("status.present")}</SelectItem>
              <SelectItem value="absent">{t("status.absent")}</SelectItem>
              <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
              <SelectItem value="rescheduled">{t("status.rescheduled")}</SelectItem>
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
                <TableHead>{t("common.date")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("common.reason")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("common.doctor")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("common.room")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 25).map((a) => (
                <TableRow key={a.id} className="hover:bg-secondary/30">
                  <TableCell className="font-medium">{a.patientName}</TableCell>
                  <TableCell className="text-sm">
                    <div>{new Date(a.date).toLocaleDateString(localeTag, { day: "2-digit", month: "short" })}</div>
                    <div className="text-[11px] text-muted-foreground">{new Date(a.date).toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit" })}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{a.reason}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{a.doctorName}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{a.room}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  );
}

function NewAppointment() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="rounded-lg"><Plus className="mr-2 h-4 w-4" /> {t("apt.new")}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("apt.new")}</DialogTitle>
          <DialogDescription>{t("apt.newDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2"><Label>{t("common.patient")}</Label><Input placeholder={t("apt.searchOrSelect")} /></div>
          <div className="space-y-1.5"><Label>{t("common.date")}</Label><Input type="date" /></div>
          <div className="space-y-1.5"><Label>{t("common.time")}</Label><Input type="time" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>{t("common.reason")}</Label><Input placeholder={t("apt.reasonPh")} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={() => { setOpen(false); toast.success(t("apt.scheduled")); }}>{t("apt.schedule")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
