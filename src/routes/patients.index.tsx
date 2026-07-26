import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Filter, Trash2, Pencil, Download, Phone, Mail } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { patients } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/patients/")({
  head: () => ({
    meta: [
      { title: "Patients — Clinicab" },
      { name: "description", content: "Recherchez, filtrez et gérez vos dossiers patients." },
      { property: "og:title", content: "Patients — Clinicab" },
      { property: "og:description", content: "Tous les dossiers patients en un seul endroit." },
    ],
  }),
  component: PatientsPage,
});

function PatientsPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [city, setCity] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = patients.filter((p) => {
    const matchesQ = !q || `${p.firstName} ${p.lastName} ${p.phone} ${p.email}`.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = status === "all" || p.status === status;
    const matchesCity = city === "all" || p.city === city;
    return matchesQ && matchesStatus && matchesCity;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const cities = Array.from(new Set(patients.map((p) => p.city)));

  return (
    <AppShell
      title={t("pat.title")}
      subtitle={t("pat.subtitle", { n: patients.length })}
      actions={
        <>
          <Button variant="outline" className="rounded-lg"><Download className="mr-2 h-4 w-4" /> {t("common.export")}</Button>
          <NewPatientDialog />
        </>
      }
    >
      <Card className="rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("pat.searchPh")} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="h-10 pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-[170px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder={t("pat.filterStatus")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allStatuses")}</SelectItem>
              <SelectItem value="active">{t("status.active")}</SelectItem>
              <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={city} onValueChange={(v) => { setCity(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-[170px]"><SelectValue placeholder={t("pat.filterCity")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("pat.allCities")}</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                <TableHead className="hidden md:table-cell">{t("pat.contact")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("common.city")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("common.age")}</TableHead>
                <TableHead className="hidden xl:table-cell">{t("pat.lastVisit")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">{t("pat.noMatch")}</TableCell></TableRow>
              )}
              {rows.map((p) => (
                <TableRow key={p.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <Link to="/patients/$id" params={{ id: p.id }} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary-soft text-accent-foreground text-xs font-semibold">{p.firstName[0]}{p.lastName[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm font-medium">{p.firstName} {p.lastName}</div>
                        <div className="text-[11px] text-muted-foreground">{p.id} · {p.gender === "F" ? t("common.female") : t("common.male")}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3 text-muted-foreground" />{p.phone}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{p.email}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{p.city}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{p.age}</TableCell>
                  <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">{p.lastVisit}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toast(t("pat.editDemo"))}><Pencil className="h-4 w-4" /></Button>
                      <DeletePatient name={`${p.firstName} ${p.lastName}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <div>{t("common.showing")} {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} {t("common.of")} {filtered.length}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>{t("common.previous")}</Button>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>{t("common.next")}</Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}

function NewPatientDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg"><Plus className="mr-2 h-4 w-4" /> {t("pat.new")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("pat.new")}</DialogTitle>
          <DialogDescription>{t("pat.newDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>{t("pat.firstName")}</Label><Input placeholder="Youssef" /></div>
          <div className="space-y-1.5"><Label>{t("pat.lastName")}</Label><Input placeholder="El Amrani" /></div>
          <div className="space-y-1.5"><Label>{t("common.phone")}</Label><Input placeholder="+212 6…" /></div>
          <div className="space-y-1.5"><Label>{t("common.email")}</Label><Input placeholder="patient@mail.ma" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>{t("common.address")}</Label><Input placeholder="Street, city" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={() => { setOpen(false); toast.success(t("pat.created")); }}>{t("pat.createBtn")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeletePatient({ name }: { name: string }) {
  const { t } = useI18n();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("pat.deleteQ", { n: name })}</AlertDialogTitle>
          <AlertDialogDescription>{t("pat.deleteDesc")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => toast.success(t("pat.deleted", { n: name }))}>{t("common.delete")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
