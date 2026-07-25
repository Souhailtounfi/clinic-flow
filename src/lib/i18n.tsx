import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "ar" | "en";

type Dict = Record<string, string>;

const fr: Dict = {
  // Sidebar sections
  "nav.workspace": "Espace de travail",
  "nav.administration": "Administration",
  // Nav items
  "nav.dashboard": "Tableau de bord",
  "nav.patients": "Patients",
  "nav.appointments": "Rendez-vous",
  "nav.calendar": "Calendrier",
  "nav.waitingRoom": "Salle d'attente",
  "nav.consultations": "Consultations",
  "nav.prescriptions": "Ordonnances",
  "nav.payments": "Paiements",
  "nav.reports": "Rapports",
  "nav.notifications": "Notifications",
  "nav.settings": "Paramètres du cabinet",
  "nav.users": "Utilisateurs",
  "nav.auditLogs": "Journaux d'audit",
  "nav.superAdmin": "Super Admin",
  // Header
  "header.search": "Rechercher patients, rendez-vous, ordonnances…",
  "header.myAccount": "Mon compte",
  "header.clinicSettings": "Paramètres du cabinet",
  "header.team": "Équipe",
  "header.logout": "Se déconnecter",
  "header.language": "Langue",
  // Brand
  "brand.tagline": "Clinic OS · Maroc",
  "brand.role": "Cabinet Idrissi · Médecin",
  // Login
  "login.welcome": "Bienvenue",
  "login.subtitle": "Connectez-vous à l'espace de votre cabinet pour continuer.",
  "login.email": "E-mail",
  "login.password": "Mot de passe",
  "login.forgot": "Mot de passe oublié ?",
  "login.keep": "Rester connecté sur cet appareil",
  "login.signIn": "Se connecter",
  "login.signingIn": "Connexion…",
  "login.demoTitle": "Accès démo",
  "login.demoBody": "Tous les identifiants fonctionnent. Ceci est un prototype frontend.",
  "login.welcomeBack": "Bon retour, Dr. Idrissi",
  "login.reset": "Lien de réinitialisation envoyé à votre e-mail.",
  "login.heroTag": "Conçu pour les cabinets privés marocains",
  "login.heroTitle": "Le système de cabinet que votre équipe adorera utiliser.",
  "login.heroDesc": "Patients, rendez-vous, ordonnances et revenus — unifiés avec élégance pour dentistes, généralistes, dermatologues, pédiatres et gynécologues.",
  "login.feat1Title": "Consultations rapides",
  "login.feat1Desc": "Tout le contexte patient en un coup d'œil.",
  "login.feat2Title": "Privé et sécurisé",
  "login.feat2Desc": "Accès par rôle avec journaux d'audit.",
  // Dashboard
  "dash.greeting": "Bonjour, Kaoutar",
  "dash.subtitle": "Voici ce qui se passe dans votre cabinet aujourd'hui.",
  "dash.export": "Exporter",
  "dash.newAppointment": "Nouveau rendez-vous",
  "dash.todaysAppointments": "Rendez-vous du jour",
  "dash.patientsWaiting": "Patients en attente",
  "dash.presentToday": "Présents aujourd'hui",
  "dash.absentToday": "Absents aujourd'hui",
  "dash.revenueToday": "Revenus du jour",
  "dash.revenueMonth": "Revenus du mois",
  "dash.monthlyRevenue": "Revenus mensuels",
  "dash.last7": "7 derniers mois · MAD",
  "dash.viewReport": "Voir le rapport",
  "dash.attendance": "Taux de présence",
  "dash.presentVsAbsent": "Présents vs absents",
  "dash.appointmentsPerMonth": "Rendez-vous par mois",
  "dash.volumeTrend": "Tendance du volume",
  "dash.todaysNotifications": "Notifications du jour",
  "dash.viewAll": "Voir tout",
  "dash.upcoming": "Prochains rendez-vous",
  "dash.seeAll": "Tout voir",
  "dash.recentActivity": "Activité récente",
  "dash.live": "en direct",
};

const ar: Dict = {
  "nav.workspace": "مساحة العمل",
  "nav.administration": "الإدارة",
  "nav.dashboard": "لوحة التحكم",
  "nav.patients": "المرضى",
  "nav.appointments": "المواعيد",
  "nav.calendar": "التقويم",
  "nav.waitingRoom": "قاعة الانتظار",
  "nav.consultations": "الاستشارات",
  "nav.prescriptions": "الوصفات",
  "nav.payments": "المدفوعات",
  "nav.reports": "التقارير",
  "nav.notifications": "الإشعارات",
  "nav.settings": "إعدادات العيادة",
  "nav.users": "المستخدمون",
  "nav.auditLogs": "سجلات التدقيق",
  "nav.superAdmin": "المشرف العام",
  "header.search": "ابحث عن المرضى والمواعيد والوصفات…",
  "header.myAccount": "حسابي",
  "header.clinicSettings": "إعدادات العيادة",
  "header.team": "الفريق",
  "header.logout": "تسجيل الخروج",
  "header.language": "اللغة",
  "brand.tagline": "نظام العيادة · المغرب",
  "brand.role": "عيادة الإدريسي · طبيب",
  "login.welcome": "مرحباً بعودتك",
  "login.subtitle": "سجّل الدخول إلى مساحة عيادتك للمتابعة.",
  "login.email": "البريد الإلكتروني",
  "login.password": "كلمة المرور",
  "login.forgot": "هل نسيت كلمة المرور؟",
  "login.keep": "أبقني مسجّلاً في هذا الجهاز",
  "login.signIn": "تسجيل الدخول",
  "login.signingIn": "جارٍ تسجيل الدخول…",
  "login.demoTitle": "وصول تجريبي",
  "login.demoBody": "أي بيانات اعتماد صالحة. هذا نموذج أولي للواجهة فقط.",
  "login.welcomeBack": "مرحباً بعودتك، د. الإدريسي",
  "login.reset": "تم إرسال رابط إعادة التعيين إلى بريدك.",
  "login.heroTag": "مصمّم للعيادات الخاصة في المغرب",
  "login.heroTitle": "نظام العيادة الذي سيحب فريقك استخدامه.",
  "login.heroDesc": "المرضى والمواعيد والوصفات والإيرادات — موحّدة بأناقة لأطباء الأسنان والعامين والجلدية والأطفال والنساء.",
  "login.feat1Title": "استشارات أسرع",
  "login.feat1Desc": "كل سياق المريض بنظرة واحدة.",
  "login.feat2Title": "خاص وآمن",
  "login.feat2Desc": "وصول حسب الدور مع سجلات تدقيق.",
  "dash.greeting": "صباح الخير، كوثر",
  "dash.subtitle": "إليك ما يحدث في عيادتك اليوم.",
  "dash.export": "تصدير",
  "dash.newAppointment": "موعد جديد",
  "dash.todaysAppointments": "مواعيد اليوم",
  "dash.patientsWaiting": "مرضى في الانتظار",
  "dash.presentToday": "الحاضرون اليوم",
  "dash.absentToday": "الغائبون اليوم",
  "dash.revenueToday": "إيرادات اليوم",
  "dash.revenueMonth": "إيرادات الشهر",
  "dash.monthlyRevenue": "الإيرادات الشهرية",
  "dash.last7": "آخر 7 أشهر · درهم",
  "dash.viewReport": "عرض التقرير",
  "dash.attendance": "معدل الحضور",
  "dash.presentVsAbsent": "الحاضرون مقابل الغائبين",
  "dash.appointmentsPerMonth": "المواعيد شهرياً",
  "dash.volumeTrend": "اتجاه الحجم",
  "dash.todaysNotifications": "إشعارات اليوم",
  "dash.viewAll": "عرض الكل",
  "dash.upcoming": "المواعيد القادمة",
  "dash.seeAll": "عرض الكل",
  "dash.recentActivity": "النشاط الأخير",
  "dash.live": "مباشر",
};

const en: Dict = {
  "nav.workspace": "Workspace",
  "nav.administration": "Administration",
  "nav.dashboard": "Dashboard",
  "nav.patients": "Patients",
  "nav.appointments": "Appointments",
  "nav.calendar": "Calendar",
  "nav.waitingRoom": "Waiting Room",
  "nav.consultations": "Consultations",
  "nav.prescriptions": "Prescriptions",
  "nav.payments": "Payments",
  "nav.reports": "Reports",
  "nav.notifications": "Notifications",
  "nav.settings": "Clinic Settings",
  "nav.users": "Users",
  "nav.auditLogs": "Audit Logs",
  "nav.superAdmin": "Super Admin",
  "header.search": "Search patients, appointments, prescriptions…",
  "header.myAccount": "My account",
  "header.clinicSettings": "Clinic settings",
  "header.team": "Team",
  "header.logout": "Log out",
  "header.language": "Language",
  "brand.tagline": "Clinic OS · Morocco",
  "brand.role": "Cabinet Idrissi · Doctor",
  "login.welcome": "Welcome back",
  "login.subtitle": "Sign in to your clinic workspace to continue.",
  "login.email": "Email",
  "login.password": "Password",
  "login.forgot": "Forgot password?",
  "login.keep": "Keep me signed in on this device",
  "login.signIn": "Sign in",
  "login.signingIn": "Signing in…",
  "login.demoTitle": "Demo access",
  "login.demoBody": "Any credentials work. This is a frontend prototype.",
  "login.welcomeBack": "Welcome back, Dr. Idrissi",
  "login.reset": "Password reset link sent to your email.",
  "login.heroTag": "Built for Moroccan private practices",
  "login.heroTitle": "The clinic OS your team will actually enjoy using.",
  "login.heroDesc": "Patients, appointments, prescriptions and revenue — beautifully unified for dentists, GPs, dermatologists, pediatricians and gynecologists.",
  "login.feat1Title": "Faster consultations",
  "login.feat1Desc": "Full patient context in one glance.",
  "login.feat2Title": "Private & secure",
  "login.feat2Desc": "Role-based access with audit trails.",
  "dash.greeting": "Good morning, Kaoutar",
  "dash.subtitle": "Here's what's happening in your clinic today.",
  "dash.export": "Export",
  "dash.newAppointment": "New appointment",
  "dash.todaysAppointments": "Today's Appointments",
  "dash.patientsWaiting": "Patients Waiting",
  "dash.presentToday": "Present Today",
  "dash.absentToday": "Absent Today",
  "dash.revenueToday": "Revenue Today",
  "dash.revenueMonth": "Revenue This Month",
  "dash.monthlyRevenue": "Monthly revenue",
  "dash.last7": "Last 7 months · MAD",
  "dash.viewReport": "View report",
  "dash.attendance": "Attendance rate",
  "dash.presentVsAbsent": "Present vs absent",
  "dash.appointmentsPerMonth": "Appointments per month",
  "dash.volumeTrend": "Volume trend",
  "dash.todaysNotifications": "Today's notifications",
  "dash.viewAll": "View all",
  "dash.upcoming": "Upcoming appointments",
  "dash.seeAll": "See all",
  "dash.recentActivity": "Recent activity",
  "dash.live": "live",
};

const dicts: Record<Lang, Dict> = { fr, ar, en };

export const languages: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇲🇦" },
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string; dir: "ltr" | "rtl" };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("medicab.lang") as Lang | null;
      if (stored && dicts[stored]) setLangState(stored);
    } catch {}
  }, []);

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("medicab.lang", l); } catch {}
  };

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    dir,
    t: (key: string) => dicts[lang][key] ?? dicts.fr[key] ?? key,
  }), [lang, dir]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) {
    // Safe fallback if provider missing (e.g. SSR pre-hydrate)
    return { lang: "fr" as Lang, setLang: () => {}, dir: "ltr" as const, t: (k: string) => dicts.fr[k] ?? k };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
