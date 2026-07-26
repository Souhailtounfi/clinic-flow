export type PatientStatus = "active" | "inactive";
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "present"
  | "absent"
  | "cancelled"
  | "rescheduled";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  birthDate: string;
  age: number;
  phone: string;
  email: string;
  city: string;
  address: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  notes: string;
  lastVisit: string;
  totalVisits: number;
  status: PatientStatus;
  outstandingMAD: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string; // ISO
  duration: number; // minutes
  reason: string;
  status: AppointmentStatus;
  room?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  notes: string;
  doctor: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctor: string;
  items: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  method: "cash" | "card" | "transfer";
  status: "paid" | "unpaid";
  date: string;
  note?: string;
}

export interface WaitingEntry {
  id: string;
  patientId: string;
  patientName: string;
  arrivedAt: string;
  status: "waiting" | "in_consultation" | "done";
  reason: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "appointment" | "payment" | "system";
}

export interface Clinic {
  id: string;
  name: string;
  city: string;
  plan: "Starter" | "Pro" | "Enterprise";
  status: "active" | "inactive";
  doctors: number;
  patients: number;
  revenueMAD: number;
  since: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "Doctor" | "Secretary" | "Super Admin";
  specialty?: string;
  active: boolean;
  lastActive: string;
}

const firstNamesM = ["Youssef", "Mehdi", "Omar", "Anas", "Karim", "Rachid", "Hamza", "Yassine", "Adam", "Nabil"];
const firstNamesF = ["Salma", "Imane", "Fatima", "Sara", "Aya", "Nour", "Zineb", "Meryem", "Hind", "Khadija"];
const lastNames = ["El Amrani", "Bennani", "Cherkaoui", "Alaoui", "Tazi", "Idrissi", "Fassi", "Berrada", "Sbihi", "El Ghali", "Naciri", "Benjelloun"];
const cities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Agadir", "Meknès", "Oujda"];
const allergiesPool = ["Penicillin", "Latex", "Pollen", "Peanuts", "Aspirin", "Dust mites"];
const conditionsPool = ["Hypertension", "Type 2 Diabetes", "Asthma", "Migraine", "Eczema", "Hypothyroidism"];
const reasonsPool = [
  "Follow-up",
  "Consultation",
  "Cleaning",
  "Cavity filling",
  "Skin check",
  "Vaccination",
  "Pediatric check-up",
  "Prenatal visit",
  "Prescription renewal",
];

function seeded(i: number) {
  const x = Math.sin(i * 9973) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], i: number): T {
  return arr[Math.floor(seeded(i) * arr.length)];
}

export const patients: Patient[] = Array.from({ length: 48 }, (_, i) => {
  const gender: "M" | "F" = seeded(i + 1) > 0.5 ? "F" : "M";
  const first = gender === "F" ? pick(firstNamesF, i + 2) : pick(firstNamesM, i + 3);
  const last = pick(lastNames, i + 4);
  const age = 6 + Math.floor(seeded(i + 5) * 70);
  const birthYear = 2026 - age;
  return {
    id: `P-${(1000 + i).toString()}`,
    firstName: first,
    lastName: last,
    gender,
    birthDate: `${birthYear}-0${1 + (i % 9)}-1${i % 9}`,
    age,
    phone: `+212 6${(10 + i).toString().padStart(2, "0")} ${(100 + i * 3).toString().slice(0, 3)} ${(200 + i * 7).toString().slice(0, 3)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/\s/g, "")}@mail.ma`,
    city: pick(cities, i + 6),
    address: `${10 + i} Rue ${pick(lastNames, i + 8)}, ${pick(cities, i + 6)}`,
    bloodType: pick(["A+", "A-", "B+", "O+", "O-", "AB+"], i + 9),
    allergies: seeded(i + 10) > 0.6 ? [pick(allergiesPool, i + 11)] : [],
    medicalHistory: seeded(i + 12) > 0.5 ? [pick(conditionsPool, i + 13)] : [],
    notes: seeded(i + 14) > 0.7 ? "Patient prefers morning appointments." : "",
    lastVisit: `2026-0${1 + (i % 7)}-${10 + (i % 18)}`,
    totalVisits: 1 + Math.floor(seeded(i + 15) * 24),
    status: seeded(i + 16) > 0.15 ? "active" : "inactive",
    outstandingMAD: seeded(i + 17) > 0.7 ? Math.floor(seeded(i + 18) * 800) : 0,
  };
});

const statuses: AppointmentStatus[] = ["scheduled", "confirmed", "present", "absent", "cancelled", "rescheduled"];

export const appointments: Appointment[] = Array.from({ length: 60 }, (_, i) => {
  const p = patients[i % patients.length];
  const today = new Date();
  const offset = (i % 14) - 3;
  const day = new Date(today);
  day.setDate(today.getDate() + offset);
  const hour = 8 + (i % 9);
  const minute = (i % 4) * 15;
  day.setHours(hour, minute, 0, 0);
  return {
    id: `A-${2000 + i}`,
    patientId: p.id,
    patientName: `${p.firstName} ${p.lastName}`,
    doctorName: pick(["Dr. Kaoutar Idrissi", "Dr. Réda Benali", "Dr. Salma Cherkaoui"], i),
    date: day.toISOString(),
    duration: [15, 20, 30, 45][i % 4],
    reason: pick(reasonsPool, i),
    status: offset < 0 ? pick(["present", "absent", "cancelled"] as AppointmentStatus[], i) : statuses[i % statuses.length],
    room: `Room ${1 + (i % 3)}`,
  };
});

export const consultations: Consultation[] = Array.from({ length: 24 }, (_, i) => {
  const p = patients[i % patients.length];
  return {
    id: `C-${3000 + i}`,
    patientId: p.id,
    date: `2026-0${1 + (i % 7)}-${5 + (i % 22)}`,
    diagnosis: pick(["Acute pharyngitis", "Seasonal allergic rhinitis", "Dental caries", "Atopic dermatitis", "Migraine"], i),
    notes: "Patient reports mild symptoms. Prescribed treatment, follow-up in two weeks.",
    doctor: pick(["Dr. Kaoutar Idrissi", "Dr. Réda Benali"], i),
  };
});

export const prescriptions: Prescription[] = Array.from({ length: 18 }, (_, i) => {
  const p = patients[i % patients.length];
  return {
    id: `RX-${4000 + i}`,
    patientId: p.id,
    patientName: `${p.firstName} ${p.lastName}`,
    date: `2026-0${1 + (i % 7)}-${5 + (i % 22)}`,
    doctor: "Dr. Kaoutar Idrissi",
    items: [
      { medicine: "Amoxicillin 500mg", dosage: "1 tablet", frequency: "3x/day", duration: "7 days", instructions: "After meals" },
      { medicine: "Paracetamol 1g", dosage: "1 tablet", frequency: "if needed", duration: "5 days" },
    ],
  };
});

export const payments: Payment[] = Array.from({ length: 30 }, (_, i) => {
  const p = patients[i % patients.length];
  return {
    id: `PMT-${5000 + i}`,
    patientId: p.id,
    patientName: `${p.firstName} ${p.lastName}`,
    amount: [200, 300, 350, 400, 500, 600, 800][i % 7],
    method: pick(["cash", "card", "transfer"] as const, i),
    status: seeded(i + 30) > 0.25 ? "paid" : "unpaid",
    date: `2026-0${1 + (i % 7)}-${5 + (i % 22)}`,
  };
});

export const waitingRoom: WaitingEntry[] = Array.from({ length: 6 }, (_, i) => {
  const p = patients[i];
  const arr = new Date();
  arr.setMinutes(arr.getMinutes() - (5 + i * 7));
  return {
    id: `W-${i}`,
    patientId: p.id,
    patientName: `${p.firstName} ${p.lastName}`,
    arrivedAt: arr.toISOString(),
    status: i === 0 ? "in_consultation" : "waiting",
    reason: pick(reasonsPool, i),
  };
});

export const notifications: NotificationItem[] = [
  { id: "n1", title: "Appointment reminder", body: "Salma El Amrani at 10:30 today.", time: "8m ago", read: false, kind: "appointment" },
  { id: "n2", title: "Payment received", body: "Omar Bennani paid 400 MAD.", time: "1h ago", read: false, kind: "payment" },
  { id: "n3", title: "New patient registered", body: "Youssef Alaoui was added by Sara.", time: "3h ago", read: true, kind: "system" },
  { id: "n4", title: "Appointment cancelled", body: "Nour Tazi cancelled tomorrow's slot.", time: "Yesterday", read: true, kind: "appointment" },
  { id: "n5", title: "End-of-day report ready", body: "Yesterday's revenue: 4,850 MAD.", time: "Yesterday", read: true, kind: "system" },
];

export const clinics: Clinic[] = [
  { id: "cl1", name: "Cabinet Dr. Idrissi", city: "Casablanca", plan: "Pro", status: "active", doctors: 2, patients: 812, revenueMAD: 128400, since: "2024-04-12" },
  { id: "cl2", name: "Clinique Atlas Dentaire", city: "Rabat", plan: "Enterprise", status: "active", doctors: 6, patients: 3120, revenueMAD: 542100, since: "2023-09-01" },
  { id: "cl3", name: "Cabinet Pédiatrique Nour", city: "Marrakech", plan: "Starter", status: "active", doctors: 1, patients: 214, revenueMAD: 32400, since: "2025-06-20" },
  { id: "cl4", name: "Dermato Tanger", city: "Tanger", plan: "Pro", status: "inactive", doctors: 1, patients: 402, revenueMAD: 41800, since: "2025-01-10" },
  { id: "cl5", name: "Clinique Al Amal", city: "Fès", plan: "Pro", status: "active", doctors: 3, patients: 1084, revenueMAD: 187600, since: "2024-11-02" },
];

export const staff: StaffUser[] = [
  { id: "u1", name: "Dr. Kaoutar Idrissi", email: "kaoutar@clinicab.ma", role: "Doctor", specialty: "General Practice", active: true, lastActive: "2 min ago" },
  { id: "u2", name: "Dr. Réda Benali", email: "reda@clinicab.ma", role: "Doctor", specialty: "Dermatology", active: true, lastActive: "18 min ago" },
  { id: "u3", name: "Sara Bennani", email: "sara@clinicab.ma", role: "Secretary", active: true, lastActive: "5 min ago" },
  { id: "u4", name: "Imane Tazi", email: "imane@clinicab.ma", role: "Secretary", active: true, lastActive: "1 h ago" },
  { id: "u5", name: "Admin", email: "admin@clinicab.ma", role: "Super Admin", active: true, lastActive: "just now" },
];

export const revenueByMonth = [
  { month: "Jan", revenue: 84000, appointments: 210 },
  { month: "Feb", revenue: 92500, appointments: 232 },
  { month: "Mar", revenue: 101300, appointments: 258 },
  { month: "Apr", revenue: 88400, appointments: 221 },
  { month: "May", revenue: 112900, appointments: 287 },
  { month: "Jun", revenue: 128400, appointments: 312 },
  { month: "Jul", revenue: 134800, appointments: 328 },
];

export const attendanceByMonth = [
  { month: "Jan", present: 88, absent: 12 },
  { month: "Feb", present: 91, absent: 9 },
  { month: "Mar", present: 87, absent: 13 },
  { month: "Apr", present: 92, absent: 8 },
  { month: "May", present: 90, absent: 10 },
  { month: "Jun", present: 94, absent: 6 },
  { month: "Jul", present: 93, absent: 7 },
];

export const auditLogs = Array.from({ length: 18 }, (_, i) => ({
  id: `L-${i}`,
  who: pick(["Dr. Kaoutar Idrissi", "Sara Bennani", "Imane Tazi", "Dr. Réda Benali"], i),
  action: pick(["Updated patient", "Created appointment", "Deleted prescription", "Marked payment paid", "Logged in", "Changed clinic settings"], i + 1),
  target: `P-${1000 + (i % 20)}`,
  when: `2026-07-${10 + (i % 18)} ${9 + (i % 8)}:${(i * 7) % 60}`.padEnd(16, "0"),
}));

export const medicineDb = [
  "Amoxicillin 500mg", "Paracetamol 1g", "Ibuprofen 400mg", "Omeprazole 20mg",
  "Metformin 850mg", "Atorvastatin 20mg", "Salbutamol inhaler", "Cetirizine 10mg",
  "Loratadine 10mg", "Azithromycin 500mg", "Prednisolone 20mg", "Doxycycline 100mg",
  "Vitamin D3 1000UI", "Ferrous sulfate 200mg", "Amlodipine 5mg", "Losartan 50mg",
];

export const favoriteMedicines = ["Amoxicillin 500mg", "Paracetamol 1g", "Ibuprofen 400mg", "Cetirizine 10mg"];
