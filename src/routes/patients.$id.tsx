import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone, Mail, MapPin, Cake, Droplet, Pencil, FileText, Paperclip, Wallet } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { patients, consultations, prescriptions, payments, appointments } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/patients/$id")({
  loader: ({ params }) => {
    const p = patients.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { patient: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.patient.firstName} ${loaderData.patient.lastName} — Clinicab` : "Patient — Clinicab" },
      { name: "description", content: "Profil patient complet : historique, consultations, ordonnances et paiements." },
    ],
  }),
  component: PatientProfile,
  notFoundComponent: NotFoundView,
});

function NotFoundView() {
  const { t } = useI18n();
  return (
    <AppShell title={t("prof.notFound")}>
      <Link to="/patients" className="text-sm text-primary">{t("prof.back")}</Link>
    </AppShell>
  );
}

function PatientProfile() {
  const { patient } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const localeTag = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-MA" : "en-GB";
  const pConsults = consultations.filter((c) => c.patientId === patient.id).slice(0, 6);
  const pRx = prescriptions.filter((c) => c.patientId === patient.id).slice(0, 6);
  const pPayments = payments.filter((c) => c.patientId === patient.id).slice(0, 6);
  const pApts = appointments.filter((c) => c.patientId === patient.id).slice(0, 8);

  return (
    <AppShell
      title={`${patient.firstName} ${patient.lastName}`}
      subtitle={`${patient.id} · ${patient.age} · ${patient.gender === "F" ? t("common.female") : t("common.male")}`}
      actions={
        <>
          <Button variant="outline" asChild className="rounded-lg"><Link to="/patients"><ArrowLeft className="mr-2 h-4 w-4" /> {t("prof.allPatients")}</Link></Button>
          <Button className="rounded-lg"><Pencil className="mr-2 h-4 w-4" /> {t("prof.editProfile")}</Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14"><AvatarFallback className="bg-primary-soft text-accent-foreground text-lg font-semibold">{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback></Avatar>
              <div className="min-w-0">
                <div className="truncate text-base font-bold">{patient.firstName} {patient.lastName}</div>
                <div className="text-xs text-muted-foreground">{t("prof.since")} {patient.lastVisit.slice(0, 4)}</div>
                <div className="mt-1"><StatusBadge status={patient.status} /></div>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <InfoRow icon={Phone} label={t("common.phone")} value={patient.phone} />
              <InfoRow icon={Mail} label={t("common.email")} value={patient.email} />
              <InfoRow icon={MapPin} label={t("common.address")} value={patient.address} />
              <InfoRow icon={Cake} label={t("prof.birthDate")} value={patient.birthDate} />
              <InfoRow icon={Droplet} label={t("prof.bloodType")} value={patient.bloodType} />
            </div>
            {patient.outstandingMAD > 0 && (
              <div className="mt-5 rounded-xl border border-[oklch(0.9_0.06_27)] bg-[oklch(0.98_0.02_27)] p-3 text-xs">
                <div className="flex items-center gap-2 font-semibold text-[oklch(0.45_0.18_27)]"><Wallet className="h-4 w-4" /> {t("prof.outstanding")}</div>
                <div className="mt-0.5 text-muted-foreground">{patient.outstandingMAD} {t("prof.unpaidSuffix")}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardContent className="p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniStat label={t("prof.totalVisits")} value={patient.totalVisits.toString()} />
              <MiniStat label={t("pat.lastVisit")} value={patient.lastVisit} />
              <MiniStat label={t("prof.outstanding")} value={`${patient.outstandingMAD} MAD`} />
            </div>
            <div className="mt-5">
              <div className="text-sm font-semibold">{t("prof.medicalHistory")}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {patient.medicalHistory.length === 0 ? <span className="text-xs text-muted-foreground">{t("prof.noConditions")}</span>
                  : patient.medicalHistory.map((c: string) => <Badge key={c} variant="secondary" className="rounded-full">{c}</Badge>)}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-sm font-semibold">{t("prof.allergies")}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {patient.allergies.length === 0 ? <span className="text-xs text-muted-foreground">{t("prof.noAllergies")}</span>
                  : patient.allergies.map((c: string) => <Badge key={c} className="rounded-full bg-[oklch(0.95_0.05_27)] text-[oklch(0.45_0.18_27)] hover:bg-[oklch(0.95_0.05_27)]">{c}</Badge>)}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-sm font-semibold">{t("prof.notes")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{patient.notes || t("prof.noNotes")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="mt-6">
        <TabsList className="rounded-xl bg-secondary/60">
          <TabsTrigger value="timeline" className="rounded-lg">{t("prof.tab.timeline")}</TabsTrigger>
          <TabsTrigger value="consultations" className="rounded-lg">{t("prof.tab.consultations")}</TabsTrigger>
          <TabsTrigger value="prescriptions" className="rounded-lg">{t("prof.tab.prescriptions")}</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg">{t("prof.tab.payments")}</TabsTrigger>
          <TabsTrigger value="attachments" className="rounded-lg">{t("prof.tab.attachments")}</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5">
            <ol className="relative space-y-5 border-l pl-6">
              {pApts.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[26px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-background bg-primary" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium">{a.reason}</div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleString(localeTag, { dateStyle: "medium", timeStyle: "short" })} · {a.doctorName}</div>
                </li>
              ))}
            </ol>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="consultations">
          <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5 space-y-3">
            {pConsults.length === 0 ? <EmptyState label={t("prof.noConsults")} /> : pConsults.map((c) => (
              <div key={c.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between text-sm"><span className="font-semibold">{c.diagnosis}</span><span className="text-xs text-muted-foreground">{c.date}</span></div>
                <p className="mt-1 text-xs text-muted-foreground">{c.notes} — {c.doctor}</p>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5 space-y-3">
            {pRx.length === 0 ? <EmptyState label={t("prof.noRx")} /> : pRx.map((r) => (
              <div key={r.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between text-sm"><span className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {r.id}</span><span className="text-xs text-muted-foreground">{r.date}</span></div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {r.items.map((it, i) => <li key={i}>• {it.medicine} — {it.dosage}, {it.frequency}, {it.duration}</li>)}
                </ul>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5 space-y-2">
            {pPayments.length === 0 ? <EmptyState label={t("prof.noPayments")} /> : pPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                <div><div className="font-medium">{p.amount} MAD</div><div className="text-xs text-muted-foreground">{p.date} · {p.method}</div></div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card className="rounded-2xl border-border/60 shadow-sm"><CardContent className="p-5">
            <EmptyState icon={Paperclip} label={t("prof.noFiles")} action={t("prof.uploadFile")} />
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground"><Icon className="h-4 w-4" /></div>
      <div className="min-w-0"><div className="text-[11px] text-muted-foreground">{label}</div><div className="truncate text-sm font-medium">{value}</div></div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-bold">{value}</div>
    </div>
  );
}

function EmptyState({ label, icon: Icon = FileText, action }: { label: string; icon?: any; action?: string }) {
  return (
    <div className="grid place-items-center py-10 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-muted-foreground"><Icon className="h-5 w-5" /></div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
      {action && <Button size="sm" variant="outline" className="mt-3">{action}</Button>}
    </div>
  );
}
