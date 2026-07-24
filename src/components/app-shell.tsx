import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, CalendarDays, CalendarClock, Armchair, Stethoscope,
  Pill, Wallet, BarChart3, Bell, Settings, UserCog, ScrollText, LogOut,
  Search, Menu, ChevronDown, HeartPulse,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/waiting-room", label: "Waiting Room", icon: Armchair },
  { to: "/consultations", label: "Consultations", icon: Stethoscope },
  { to: "/prescriptions", label: "Prescriptions", icon: Pill },
  { to: "/payments", label: "Payments", icon: Wallet },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;

const adminNav = [
  { to: "/settings", label: "Clinic Settings", icon: Settings },
  { to: "/users", label: "Users", icon: UserCog },
  { to: "/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/admin", label: "Super Admin", icon: HeartPulse },
] as const;

function SidebarInner({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight">Medicab</div>
          <div className="text-[11px] text-muted-foreground">Clinic OS · Morocco</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Workspace</div>
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="px-2 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Administration</div>
        <ul className="space-y-0.5">
          {adminNav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary-soft text-accent-foreground font-semibold">KI</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">Dr. Kaoutar Idrissi</div>
            <div className="truncate text-[11px] text-muted-foreground">Cabinet Idrissi · Doctor</div>
          </div>
          <Link to="/login" className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children, title, subtitle, actions }: {
  children: ReactNode; title: string; subtitle?: string; actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block">
        <SidebarInner pathname={pathname} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SidebarInner pathname={pathname} onNavigate={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="relative hidden max-w-md flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search patients, appointments, prescriptions…" className="h-10 rounded-full border-border bg-secondary/50 pl-9" />
            </div>
            <div className="flex-1 md:hidden" />

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2 rounded-full px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary-soft text-accent-foreground text-xs font-semibold">KI</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline">Dr. Idrissi</span>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/settings">Clinic settings</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/users">Team</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/login">Log out</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    scheduled: "bg-secondary text-secondary-foreground",
    confirmed: "bg-primary-soft text-accent-foreground",
    present: "bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)]",
    absent: "bg-[oklch(0.95_0.05_27)] text-[oklch(0.45_0.18_27)]",
    cancelled: "bg-muted text-muted-foreground",
    rescheduled: "bg-[oklch(0.96_0.06_75)] text-[oklch(0.45_0.12_75)]",
    paid: "bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)]",
    unpaid: "bg-[oklch(0.95_0.05_27)] text-[oklch(0.45_0.18_27)]",
    active: "bg-[oklch(0.94_0.06_155)] text-[oklch(0.35_0.12_155)]",
    inactive: "bg-muted text-muted-foreground",
    waiting: "bg-[oklch(0.96_0.06_75)] text-[oklch(0.45_0.12_75)]",
    in_consultation: "bg-primary-soft text-accent-foreground",
    done: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="secondary" className={cn("rounded-full border-0 px-2.5 py-0.5 text-[11px] font-medium capitalize", map[status] ?? "bg-secondary")}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
