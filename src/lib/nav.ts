import { BookOpen, CalendarDays, ChartColumn, House, LifeBuoy, MapPin, Newspaper, Users, type LucideIcon } from "lucide-react";
import type { MessageKey } from "../i18n/id";

export interface NavItem {
  to: string;
  label: MessageKey;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { to: "/", label: "nav.home", icon: House },
  { to: "/profil", label: "nav.profile", icon: Users },
  { to: "/edukasi", label: "nav.education", icon: BookOpen },
  { to: "/fasilitas", label: "nav.facilities", icon: MapPin },
  { to: "/program", label: "nav.programs", icon: CalendarDays },
  { to: "/statistik", label: "nav.stats", icon: ChartColumn },
  { to: "/berita", label: "nav.news", icon: Newspaper },
  { to: "/bantuan", label: "nav.help", icon: LifeBuoy },
];
