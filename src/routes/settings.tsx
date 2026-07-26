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
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Paramètres du cabinet — Clinicab" },
      { name: "description", content: "Identité, horaires et préférences du cabinet." },
    ],
  }),
  component: SettingsPage,
});

const daysKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayLabels: Record<string, Record<string, string>> = {
  fr: { Mon: "Lun", Tue: "Mar", Wed: "Mer", Thu: "Jeu", Fri: "Ven", Sat: "Sam", Sun: "Dim" },
  ar: { Mon: "الإثنين", Tue: "الثلاثاء", Wed: "الأربعاء", Thu: "الخميس", Fri: "الجمعة", Sat: "السبت", Sun: "الأحد" },
  en: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
};

function SettingsPage() {
  const { t, lang } = useI18n();
  return (
    <AppShell
      title={t("set.title")}
      subtitle={t("set.subtitle")}
      actions={<Button className="rounded-lg" onClick={() => toast.success(t("set.saved"))}><Save className="mr-2 h-4 w-4" /> {t("common.saveChanges")}</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardContent className="space-y-4 p-5">
            <div className="text-sm font-semibold">{t("set.identity")}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>{t("set.clinicName")}</Label><Input defaultValue="Cabinet Dr. Idrissi" /></div>
              <div className="space-y-1.5"><Label>{t("common.phone")}</Label><Input defaultValue="+212 5 22 00 00 00" /></div>
              <div className="space-y-1.5"><Label>{t("common.email")}</Label><Input defaultValue="contact@cabinet-idrissi.ma" /></div>
              <div className="space-y-1.5"><Label>{t("common.city")}</Label><Input defaultValue="Casablanca" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>{t("common.address")}</Label><Textarea rows={2} defaultValue="12 Rue Ibnou Sina, Bourgogne, Casablanca 20050" /></div>
            </div>

            <div className="pt-2 text-sm font-semibold">{t("set.brandColors")}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>{t("set.primary")}</Label><div className="flex items-center gap-2"><Input type="color" defaultValue="#3457d5" className="h-10 w-14 p-1" /><Input defaultValue="#3457d5" /></div></div>
              <div className="space-y-1.5"><Label>{t("set.secondary")}</Label><div className="flex items-center gap-2"><Input type="color" defaultValue="#eaefff" className="h-10 w-14 p-1" /><Input defaultValue="#eaefff" /></div></div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="text-sm font-semibold">{t("set.logo")}</div>
            <div className="mt-3 grid place-items-center rounded-xl border-2 border-dashed p-8 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold">CI</div>
              <p className="mt-3 text-xs text-muted-foreground">{t("set.logoHint")}</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast(t("set.uploadDemo"))}><Upload className="mr-2 h-3.5 w-3.5" /> {t("set.uploadLogo")}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardContent className="p-5">
            <div className="text-sm font-semibold">{t("set.workingHours")}</div>
            <div className="mt-3 divide-y">
              {daysKeys.map((d) => (
                <div key={d} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                  <Switch defaultChecked={d !== "Sun"} />
                  <div className="w-24 font-medium">{dayLabels[lang]?.[d] ?? d}</div>
                  <Input type="time" defaultValue="09:00" className="h-9 w-28" />
                  <span className="text-muted-foreground">{t("set.to")}</span>
                  <Input type="time" defaultValue="18:00" className="h-9 w-28" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="text-sm font-semibold">{t("set.prefs")}</div>
            <div className="space-y-1.5"><Label>{t("set.defaultDuration")}</Label><Input defaultValue="30 min" /></div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><div><div className="font-medium">{t("set.sms")}</div><div className="text-xs text-muted-foreground">{t("set.sms.desc")}</div></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm"><div><div className="font-medium">{t("set.online")}</div><div className="text-xs text-muted-foreground">{t("set.online.desc")}</div></div><Switch /></div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
