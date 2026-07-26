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

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users — Clinicab" },
      { name: "description", content: "Doctors, secretaries and role-based access." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const [q, setQ] = useState("");
  const rows = staff.filter((u) => !q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell title="Users & roles" subtitle="Doctors, secretaries and permissions" actions={<NewUser />}>
      <Card className="rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search team members…" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
        </div>
      </Card>
      <Card className="mt-4 overflow-hidden rounded-2xl border-border/60 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Specialty</TableHead>
                <TableHead className="hidden lg:table-cell">Last active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{u.active ? <Badge className="rounded-full bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)] hover:bg-[oklch(0.94_0.06_155)]">Active</Badge> : <Badge variant="secondary" className="rounded-full">Inactive</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.success("Reset link sent")}><KeyRound className="mr-1.5 h-4 w-4" /> Reset</Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => toast("User deactivated")}><Ban className="mr-1.5 h-4 w-4" /> Deactivate</Button>
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
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="rounded-lg"><UserPlus className="mr-2 h-4 w-4" /> Create user</Button></DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Create user</DialogTitle><DialogDescription>Add a doctor or secretary to your clinic.</DialogDescription></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Full name</Label><Input placeholder="Dr. Fatima Naciri" /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input placeholder="user@clinicab.ma" /></div>
          <div className="space-y-1.5"><Label>Role</Label>
            <Select defaultValue="Doctor"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
              </SelectContent></Select>
          </div>
          <div className="space-y-1.5"><Label>Specialty</Label><Input placeholder="Dermatology" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setOpen(false); toast.success("Invite sent"); }}>Send invite</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
