import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Star, Printer, Download, HeartPulse, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { medicineDb, favoriteMedicines, patients, prescriptions } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/prescriptions")({
  head: () => ({
    meta: [
      { title: "Ordonnances — Clinicab" },
      { name: "description", content: "Éditeur d'ordonnance avec recherche de médicaments et export PDF." },
    ],
  }),
  component: PrescriptionsPage,
});

interface Item { medicine: string; dosage: string; frequency: string; duration: string; instructions?: string; }

function PrescriptionsPage() {
  const { t, lang } = useI18n();
  const localeTag = lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-MA" : "en-GB";
  const [items, setItems] = useState<Item[]>([
    { medicine: "Amoxicillin 500mg", dosage: "1 tablet", frequency: "3x/day", duration: "7 days", instructions: "After meals" },
    { medicine: "Paracetamol 1g", dosage: "1 tablet", frequency: "if needed", duration: "5 days" },
  ]);
  const [q, setQ] = useState("");
  const patient = patients[0];

  const suggestions = q ? medicineDb.filter((m) => m.toLowerCase().includes(q.toLowerCase())).slice(0, 5) : [];

  const addMedicine = (m: string) => {
    setItems((it) => [...it, { medicine: m, dosage: "1 tablet", frequency: "2x/day", duration: "5 days" }]);
    setQ("");
    toast.success(t("rx.added", { m }));
  };

  return (
    <AppShell
      title={t("rx.title")}
      subtitle={`${patient.firstName} ${patient.lastName} · ${new Date().toLocaleDateString(localeTag, { dateStyle: "medium" })}`}
      actions={
        <>
          <Button variant="outline" className="rounded-lg" onClick={() => toast(t("rx.preparing"))}><Printer className="mr-2 h-4 w-4" /> {t("rx.printBtn")}</Button>
          <Button className="rounded-lg" onClick={() => toast.success(t("rx.pdfDownloaded"))}><Download className="mr-2 h-4 w-4" /> {t("rx.pdfBtn")}</Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm font-semibold">{t("rx.addMedicine")}</div>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder={t("rx.searchPh")} value={q} onChange={(e) => setQ(e.target.value)} className="h-11 pl-9" />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover p-1 shadow-lg">
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => addMedicine(s)} className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary">
                        <span>{s}</span><Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">{t("rx.favorites")}</div>
                <div className="flex flex-wrap gap-1.5">
                  {favoriteMedicines.map((m) => (
                    <button key={m} onClick={() => addMedicine(m)} className="inline-flex items-center gap-1 rounded-full border bg-secondary/60 px-2.5 py-1 text-xs font-medium hover:bg-secondary">
                      <Star className="h-3 w-3 text-primary" /> {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">{t("rx.recent")}</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Cetirizine 10mg", "Omeprazole 20mg", "Ibuprofen 400mg"].map((m) => (
                    <button key={m} onClick={() => addMedicine(m)} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs hover:bg-secondary">
                      <Plus className="h-3 w-3" /> {m}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 text-sm font-semibold">{t("rx.medicines")} ({items.length})</div>
              <div className="space-y-3">
                {items.map((it, i) => (
                  <div key={i} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">{it.medicine}</div>
                      <Button size="icon" variant="ghost" onClick={() => setItems(items.filter((_, x) => x !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-4">
                      <Field label={t("rx.dosage")} value={it.dosage} onChange={(v) => update(i, "dosage", v)} />
                      <Field label={t("rx.frequency")} value={it.frequency} onChange={(v) => update(i, "frequency", v)} />
                      <Field label={t("rx.duration")} value={it.duration} onChange={(v) => update(i, "duration", v)} />
                      <Field label={t("rx.instructions")} value={it.instructions ?? ""} onChange={(v) => update(i, "instructions", v)} />
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">{t("rx.noItems")}</div>}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><HeartPulse className="h-4 w-4" /></div>
                <div>
                  <div className="text-sm font-bold">Cabinet Dr. Idrissi</div>
                  <div className="text-[10px] text-muted-foreground">Casablanca · +212 5 22 00 00 00</div>
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full">{t("common.preview")}</Badge>
            </div>
            <div className="text-[11px] font-semibold uppercase text-muted-foreground">{t("rx.docLabel")}</div>
            <div className="text-sm font-medium">Dr. Kaoutar Idrissi</div>
            <div className="text-[11px] text-muted-foreground">General Practice · INPE 12345</div>
            <div className="mt-4 text-[11px] font-semibold uppercase text-muted-foreground">{t("rx.patientLabel")}</div>
            <div className="text-sm font-medium">{patient.firstName} {patient.lastName}</div>
            <div className="text-[11px] text-muted-foreground">{patient.age} · {patient.gender === "F" ? t("common.female") : t("common.male")}</div>

            <div className="mt-5 border-t pt-4">
              <div className="text-[11px] font-semibold uppercase text-muted-foreground">{t("rx.prescription")}</div>
              <ol className="mt-2 space-y-2">
                {items.map((it, i) => (
                  <li key={i} className="text-sm">
                    <div className="font-semibold">{i + 1}. {it.medicine}</div>
                    <div className="text-xs text-muted-foreground">{it.dosage} · {it.frequency} · {it.duration}{it.instructions ? ` · ${it.instructions}` : ""}</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 border-t pt-4 text-right">
              <div className="text-[11px] text-muted-foreground">{t("rx.signature")}</div>
              <div className="mt-6 inline-block border-b border-dashed px-8 pb-1 font-serif italic text-muted-foreground">Dr. K. Idrissi</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-5">
          <div className="mb-3 text-sm font-semibold">{t("rx.history")}</div>
          <div className="divide-y">
            {prescriptions.slice(0, 6).map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-accent-foreground"><HeartPulse className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{r.patientName}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.items.map((i) => i.medicine).join(", ")}</div>
                </div>
                <div className="text-xs text-muted-foreground">{r.date}</div>
                <Button size="sm" variant="outline">{t("rx.reuse")}</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );

  function update(i: number, key: keyof Item, value: string) {
    setItems((it) => it.map((x, j) => (j === i ? { ...x, [key]: value } : x)));
  }
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-9" />
    </div>
  );
}
