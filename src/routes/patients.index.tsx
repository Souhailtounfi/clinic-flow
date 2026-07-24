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

export const Route = createFileRoute("/patients/")({
  head: () => ({
    meta: [
      { title: "Patients — Medicab" },
      { name: "description", content: "Search, filter and manage your patient records." },
      { property: "og:title", content: "Patients — Medicab" },
      { property: "og:description", content: "All patient records in one place." },
    ],
  }),
  component: PatientsPage,
});

function PatientsPage() {
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
      title="Patients"
      subtitle={`${patients.length} patients in your clinic`}
      actions={
        <>
          <Button variant="outline" className="rounded-lg"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <NewPatientDialog />
        </>
      }
    >
      <Card className="rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, phone, email…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="h-10 pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-[150px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={city} onValueChange={(v) => { setCity(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-[160px]"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
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
                <TableHead>Patient</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">City</TableHead>
                <TableHead className="hidden lg:table-cell">Age</TableHead>
                <TableHead className="hidden xl:table-cell">Last visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No patients match your filters.</TableCell></TableRow>
              )}
              {rows.map((p) => (
                <TableRow key={p.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <Link to="/patients/$id" params={{ id: p.id }} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary-soft text-accent-foreground text-xs font-semibold">{p.firstName[0]}{p.lastName[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm font-medium">{p.firstName} {p.lastName}</div>
                        <div className="text-[11px] text-muted-foreground">{p.id} · {p.gender === "F" ? "Female" : "Male"}</div>
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
                      <Button size="icon" variant="ghost" onClick={() => toast("Edit patient · demo only")}><Pencil className="h-4 w-4" /></Button>
                      <DeletePatient name={`${p.firstName} ${p.lastName}`} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <div>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}

function NewPatientDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg"><Plus className="mr-2 h-4 w-4" /> New patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New patient</DialogTitle>
          <DialogDescription>Add a patient record to your clinic.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>First name</Label><Input placeholder="Youssef" /></div>
          <div className="space-y-1.5"><Label>Last name</Label><Input placeholder="El Amrani" /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input placeholder="+212 6…" /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input placeholder="patient@mail.ma" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Input placeholder="Street, city" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { setOpen(false); toast.success("Patient created"); }}>Create patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeletePatient({ name }: { name: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>This will permanently remove the patient and their records. This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => toast.success(`${name} deleted`)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
