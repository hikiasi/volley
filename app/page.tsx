import Link from "next/link";
import { getNearestUpcomingCamp } from "@/lib/camps";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  BookOpen,
  CalendarDays,
  CircleDot,
  BarChart3,
  MessagesSquare,
  Users,
  Bell,
  Shirt,
  User,
  Users2,
  ChevronRight,
} from "lucide-react";

// Helper for the main navigation grid
const navItems = [
  { icon: BookOpen, label: "Манифест", href: "/manifest" },
  { icon: CalendarDays, label: "Кэмпы", href: "/camps", badge: "3" },
  { icon: CircleDot, label: "Путь Энсо", href: "/profile" },
  { icon: BarChart3, label: "Атлетизм", href: "/courses" },
  { icon: MessagesSquare, label: "Консультации", href: "/consultations" },
  { icon: Users, label: "Офлайн", href: "/offline" },
  { icon: Bell, label: "Новости", href: "/news", badge: "2" },
  { icon: Shirt, label: "Мерч", href: "/merch", badge: "NEW" },
  { icon: User, label: "Профиль", href: "/profile" },
];

export default async function Home() {
  const nearestCamp = await getNearestUpcomingCamp();
  const occupancy = nearestCamp ? Math.round((nearestCamp.currentParticipants / nearestCamp.maxParticipants) * 100) : 0;

  return (
    <div className="p-4 flex flex-col items-center min-h-screen bg-v-dark text-white">
      {/* Header Section */}
      <header className="w-full flex flex-col items-center mt-4 mb-8">
        <div className="mb-2">
            <svg fill="none" height="60" viewBox="0 0 100 100" width="60" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10C35 10 21 18 14 31C7 44 7 59 14 72C21 85 35 93 50 93C62 93 74 88 82 79" stroke="#ff2d1b" strokeLinecap="round" strokeWidth="8"></path>
                <path d="M88 40C89 47 88 54 86 61" stroke="#ff2d1b" strokeLinecap="round" strokeWidth="8"></path>
            </svg>
        </div>
        <h1 className="text-4xl font-black tracking-widest text-v-accent uppercase">VOLLEYDZEN</h1>
        <p className="text-sm font-light tracking-tight mt-1">ты решаешь как играть и жить</p>
      </header>

      {/* Community Info Box */}
      <section className="w-full max-w-sm mb-6">
        <div className="bg-v-card rounded-2xl p-4 border border-zinc-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-v-green/10 flex items-center justify-center rounded-lg">
                <Users2 className="w-6 h-6 text-v-green" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Сообщество: <span className="font-bold">12 540</span> участников</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-v-accent"></span>
            <p className="text-xs text-v-text-muted">HOT – Скидка -10% на «Power Jump»</p>
          </div>
        </div>
      </section>

      {/* Grid Menu */}
      <main className="w-full max-w-sm grid grid-cols-3 gap-3 mb-8">
        {navItems.map((item, index) => (
          <Link href={item.href} key={index} className="grid-card bg-v-card rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-zinc-900 aspect-square relative hover:bg-zinc-900 transition-colors">
            {item.badge && (
                <div className="badge-top-right bg-v-green/20 text-v-green text-[10px] font-bold px-1.5 rounded-full">{item.badge}</div>
            )}
            <div className="w-12 h-12 flex items-center justify-center mb-2">
                <item.icon className="w-8 h-8 text-v-accent" strokeWidth={2} />
            </div>
            <span className="text-[10px] uppercase font-bold leading-tight">{item.label}</span>
          </Link>
        ))}
      </main>

      {/* Bottom Status Bar */}
      {nearestCamp && (
        <footer className="w-full max-w-sm">
            <div className="bg-v-card/50 rounded-2xl p-4 border border-zinc-900">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-v-accent flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full border border-v-accent"></div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xs font-medium text-white">Ближайший кэмп — {nearestCamp.city} • {format(new Date(nearestCamp.startDate), 'd-MM', { locale: ru })}</h3>
                            <span className="text-[10px] text-v-text-muted">заполнено {occupancy}%</span>
                        </div>
                    </div>
                    <Link href={`/camps/${nearestCamp.slug}`} className="bg-[#1a2e24] text-v-green text-xs font-bold py-2 px-4 rounded-xl hover:opacity-80 transition-opacity">
                        Предбронь
                    </Link>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${occupancy}%` }}></div>
                </div>
            </div>
        </footer>
      )}
    </div>
  );
}
