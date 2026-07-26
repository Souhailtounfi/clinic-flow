import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Paperclip, Save, Pill } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { patients } from "@/lib/mock-data";

export const Route = createFileRoute("/consultations")({
  head: () => ({
    meta: [
      { title: "Consultation — Clinicab" },
      { name: "description", content: "Conduct a consultation with full patient context." },
    ],
  }),
  component: ConsultationPage,
});

function ConsultationPage() {
  const patient = patients[0];
  return (
    <AppShell
      title="Consultation in progress"
      subtitle={`${patient.firstName} ${patient.lastName} · started 8 min ago`}
      actions={
        <>
          <Button variant="outline" className="rounded-lg" onClick={() => toast("Saved as draft")}>Save draft</Button>
          <Button className="rounded-lg" onClick={() => toast.success("Consultation finished")}>Finish consultation</Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary-soft text-accent-foreground text-base font-semibold">{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback></Avatar>
              <div>
                <div className="text-sm font-bold">{patient.firstName} {patient.lastName}</div>
                <div className="text-xs text-muted-foreground">{patient.age} y/o · {patient.gender === "F" ? "Female" : "Male"}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <SummaryLine label="Blood type" value={patient.bloodType} />
              <SummaryLine label="Last visit" value={patient.lastVisit} />
              <SummaryLine label="Total visits" value={patient.totalVisits.toString()} />
            </div>
            <div className="mt-4">
              <div className="text-[11px] font-semibold uppercase text-muted-foreground">Allergies</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {patient.allergies.length === 0 ? <span className="text-xs text-muted-foreground">None</span> :
                  patient.allergies.map((a) => <Badge key={a} className="rounded-full bg-[oklch(0.95_0.05_27)] text-[oklch(0.45_0.18_27)] hover:bg-[oklch(0.95_0.05_27)]">{a}</Badge>)}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-[11px] font-semibold uppercase text-muted-foreground">History</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {patient.medicalHistory.length === 0 ? <span className="text-xs text-muted-foreground">None</span> :
                  patient.medicalHistory.map((a) => <Badge key={a} variant="secondary" className="rounded-full">{a}</Badge>)}
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full"><Link to="/patients/$id" params={{ id: patient.id }}>View full profile</Link></Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-2 text-sm font-semibold">Diagnosis</div>
              <Input placeholder="e.g. Acute pharyngitis" className="h-11" defaultValue="Acute pharyngitis" />
              <div className="mt-4 mb-2 text-sm font-semibold">Clinical notes</div>
              <Textarea rows={6} placeholder="Symptoms, examination, plan…" defaultValue="Patient reports 3-day sore throat, mild fever. Throat inflamed on exam. No lymphadenopathy. Recommend rest, hydration and prescribed treatment. Follow-up in 7 days if not improved." />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Label className="text-xs text-muted-foreground">Vitals</Label>
                <Input className="h-9 w-28" placeholder="BP 120/80" />
                <Input className="h-9 w-24" placeholder="HR 72" />
                <Input className="h-9 w-24" placeholder="Temp 37.2" />
                <Input className="h-9 w-24" placeholder="Weight" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Prescription</div>
                    <div className="text-xs text-muted-foreground">Write a new prescription for this visit</div>
                  </div>
                  <Button asChild className="rounded-lg"><Link to="/prescriptions"><Pill className="mr-2 h-4 w-4" /> Open editor</Link></Button>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Attachments</div>
                    <div className="text-xs text-muted-foreground">Upload files or lab results</div>
                  </div>
                  <Button variant="outline" className="rounded-lg" onClick={() => toast("Upload · demo only")}><Paperclip className="mr-2 h-4 w-4" /> Upload</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
