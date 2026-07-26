import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, KeyRound, Ban, Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { staff } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Utilisateurs — Clinicab" },
      { name: "description", content: "Médecins, secrétaires et accès par rôle." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const rows = staff.filter((u) => !q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell title={t("usr.title")} subtitle={t("usr.subtitle")} actions={<NewUser />}>
      <Card className="rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("usr.searchPh")} value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
        </div>
      </Card>
      <Card className="mt-4 overflow-hidden rounded-2xl border-border/60 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead>{t("usr.fullName")}</TableHead>
                <TableHead>{t("usr.role")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("usr.specialty")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("usr.lastActive")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((u) => (
                <TableRow key={u.id} className="hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary-soft text-accent-foreground text-xs font-semibold">{u.name.split(" ").map(x => x[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                      <div><div className="text-sm font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="rounded-full">{u.role}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{u.specialty ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{u.lastActive}</TableCell>
                  <TableCell>{u.active ? <Badge className="rounded-full bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)] hover:bg-[oklch(0.94_0.06_155)]">{t("status.active")}</Badge> : <Badge variant="secondary" className="rounded-full">{t("status.inactive")}</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.success(t("usr.resetSent"))}><KeyRound className="mr-1.5 h-4 w-4" /> {t("usr.reset")}</Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => toast(t("usr.deactivated"))}><Ban className="mr-1.5 h-4 w-4" /> {t("usr.deactivate")}</Button>
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

function NewUser() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="rounded-lg"><UserPlus className="mr-2 h-4 w-4" /> {t("usr.create")}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{t("usr.create")}</DialogTitle><DialogDescription>{t("usr.createDesc")}</DialogDescription></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>{t("usr.fullName")}</Label><Input placeholder="Dr. Fatima Naciri" /></div>
          <div className="space-y-1.5"><Label>{t("common.email")}</Label><Input placeholder="user@clinicab.ma" /></div>
          <div className="space-y-1.5"><Label>{t("usr.role")}</Label>
            <Select defaultValue="Doctor"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
              </SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label>{t("usr.specialty")}</Label><Input placeholder="Dermatology" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button><Button onClick={() => { setOpen(false); toast.success(t("usr.inviteSent")); }}>{t("usr.sendInvite")}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
