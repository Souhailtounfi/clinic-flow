import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — Clinicab" },
      { name: "description", content: "Connectez-vous à votre espace Clinicab." },
      { property: "og:title", content: "Connexion — Clinicab" },
      { property: "og:description", content: "Accédez à votre système de cabinet marocain." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t, dir } = useI18n();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success(t("login.welcomeBack"));
      navigate({ to: "/dashboard" });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2" dir={dir}>
      <div className="relative flex min-h-screen items-center justify-center px-6 py-12 lg:min-h-full">
        <div className="absolute end-4 top-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-sm">
          <Link to="/login" className="mb-10 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold tracking-tight">{t("brand.name")}</div>
              <div className="text-[11px] text-muted-foreground">{t("brand.tagline")}</div>
            </div>
          </Link>
          <h1 className="text-[28px] font-bold tracking-tight">{t("login.welcome")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("login.subtitle")}</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("login.email")}</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="kaoutar@clinicab.ma" className="h-11 ps-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("login.password")}</Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => toast(t("login.reset"))}>{t("login.forgot")}</button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" defaultValue="••••••••" className="h-11 ps-9" required />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox defaultChecked /> {t("login.keep")}
            </label>

            <Button type="submit" className="h-11 w-full rounded-lg text-sm font-semibold" disabled={loading}>
              {loading ? t("login.signingIn") : (<>{t("login.signIn")} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" /></>)}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border bg-secondary/40 p-4 text-xs text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">{t("login.demoTitle")}</div>
            {t("login.demoBody")}
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-[oklch(0.5_0.19_262)] to-[oklch(0.35_0.16_260)] p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -end-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -start-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> {t("login.heroTag")}
          </div>
          <h2 className="mt-6 max-w-md text-3xl font-bold leading-tight tracking-tight">
            {t("login.heroTitle")}
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/80">
            {t("login.heroDesc")}
          </p>
        </div>
        <div className="relative grid gap-3">
          {[
            { icon: Stethoscope, title: t("login.feat1Title"), desc: t("login.feat1Desc") },
            { icon: ShieldCheck, title: t("login.feat2Title"), desc: t("login.feat2Desc") },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/20">
                <f.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-white/75">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
