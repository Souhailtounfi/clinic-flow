import { createFileRoute } from "@tanstack/react-router";
import { Upload, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Clinic Settings — Clinicab" },
      { name: "description", content: "Configure clinic identity, hours and preferences." },
    ],
  }),
  component: SettingsPage,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function SettingsPage() {
  return (
    <AppShell
      title="Clinic settings"
      subtitle="Brand, working hours and preferences"
      actions={<Button className="rounded-lg" onClick={() => toast.success("Settings saved")}><Save className="mr-2 h-4 w-4" /> Save changes</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-semibold">Clinic identity</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Clinic name</Label><Input defaultValue="Cabinet Dr. Idrissi" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+212 5 22 00 00 00" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="contact@cabinet-idrissi.ma" /></div>
              <div className="space-y-1.5"><Label>City</Label><Input defaultValue="Casablanca" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Textarea rows={2} defaultValue="12 Rue Ibnou Sina, Bourgogne, Casablanca 20050" /></div>
            </div>

            <div className="pt-2 text-sm font-semibold">Brand colors</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Primary color</Label><div className="flex items-center gap-2"><Input type="color" defaultValue="#3457d5" className="h-10 w-14 p-1" /><Input defaultValue="#3457d5" /></div></div>
              <div className="space-y-1.5"><Label>Secondary color</Label><div className="flex items-center gap-2"><Input type="color" defaultValue="#eaefff" className="h-10 w-14 p-1" /><Input defaultValue="#eaefff" /></div></div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="text-sm font-semibold">Logo</div>
            <div className="mt-3 grid place-items-center rounded-xl border-2 border-dashed p-8 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold">CI</div>
              <p className="mt-3 text-xs text-muted-foreground">PNG, SVG. Max 2 MB.</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast("Upload · demo only")}><Upload className="mr-2 h-3.5 w-3.5" /> Upload logo</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardContent className="p-5">
            <div className="text-sm font-semibold">Working hours</div>
            <div className="mt-3 divide-y">
              {days.map((d) => (
                <div key={d} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                  <Switch defaultChecked={d !== "Sun"} />
                  <div className="w-16 font-medium">{d}</div>
                  <Input type="time" defaultValue="09:00" className="h-9 w-28" />
                  <span className="text-muted-foreground">to</span>
                  <Input type="time" defaultValue="18:00" className="h-9 w-28" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="text-sm font-semibold">Preferences</div>
            <div className="space-y-1.5"><Label>Default consultation duration</Label><Input defaultValue="30 min" /></div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><div><div className="font-medium">SMS reminders</div><div className="text-xs text-muted-foreground">24h before appointment</div></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><div><div className="font-medium">Online booking</div><div className="text-xs text-muted-foreground">Allow patients to book</div></div><Switch /></div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
