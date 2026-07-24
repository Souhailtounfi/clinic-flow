import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Medicab" },
      { name: "description", content: "Sign in to your Medicab clinic workspace." },
      { property: "og:title", content: "Sign in — Medicab" },
      { property: "og:description", content: "Access your Moroccan clinic OS." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Welcome back, Dr. Idrissi");
      navigate({ to: "/dashboard" });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:min-h-full">
        <div className="w-full max-w-sm">
          <Link to="/login" className="mb-10 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold tracking-tight">Medicab</div>
              <div className="text-[11px] text-muted-foreground">Clinic OS · Morocco</div>
            </div>
          </Link>
          <h1 className="text-[28px] font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your clinic workspace to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="kaoutar@medicab.ma" className="h-11 pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => toast("Password reset link sent to your email.")}>Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" defaultValue="••••••••" className="h-11 pl-9" required />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox defaultChecked /> Keep me signed in on this device
            </label>

            <Button type="submit" className="h-11 w-full rounded-lg text-sm font-semibold" disabled={loading}>
              {loading ? "Signing in…" : (<>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>)}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border bg-secondary/40 p-4 text-xs text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">Demo access</div>
            Any credentials work. This is a frontend prototype.
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-[oklch(0.5_0.19_262)] to-[oklch(0.35_0.16_260)] p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Built for Moroccan private practices
          </div>
          <h2 className="mt-6 max-w-md text-3xl font-bold leading-tight tracking-tight">
            The clinic OS your team will actually enjoy using.
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/80">
            Patients, appointments, prescriptions and revenue — beautifully unified for dentists, GPs, dermatologists, pediatricians and gynecologists.
          </p>
        </div>
        <div className="relative grid gap-3">
          {[
            { icon: Stethoscope, title: "Faster consultations", desc: "Full patient context in one glance." },
            { icon: ShieldCheck, title: "Private & secure", desc: "Role-based access with audit trails." },
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
