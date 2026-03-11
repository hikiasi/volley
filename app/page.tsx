import {
  History,
  CalendarDays,
  CircleDot,
  TrendingUp,
  MessageSquare,
  Users2,
  Newspaper,
  ShoppingBag,
  UserCircle
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

const navItems = [
  { icon: History, label: "Манифест", href: "/manifest" },
  { icon: CalendarDays, label: "Календарь кэмпов", href: "/camps", badge: "3" },
  { icon: CircleDot, label: "Путь Энсо", href: "/enso" },
  { icon: TrendingUp, label: "Атлетизм", href: "/athletics" },
  { icon: MessageSquare, label: "Консультации", href: "/consultations" },
  { icon: Users2, label: "Офлайн тренировки", href: "/offline" },
  { icon: Newspaper, label: "Новости и рассылки", href: "/news", badge: "2" },
  { icon: ShoppingBag, label: "Мерч", href: "/merch", badge: "NEW" },
  { icon: UserCircle, label: "Профиль", href: "/profile" },
];

export default function Home() {
  return (
    <div className="container mx-auto px-3 py-4 max-w-[430px]">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full border-2 border-[#FF2D2D]" />
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#FF2D2D]">VOLLEYDZEN</div>
            <div className="text-[10px] text-white/50 -mt-1 font-medium">ты решаешь как играть и жить</div>
          </div>
        </div>
        <div className="text-[11px] text-white/50 mono font-medium">12 540</div>
      </header>

      {/* Community Banner (Home B) */}
      <div className="glass-card p-3 mb-3 flex items-center justify-between border-white/10">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Users2 className="w-4 h-4 text-white/70" />
          <span>Сообщество: <span className="mono">12 540</span> участников</span>
        </div>
        <Badge variant="destructive" className="bg-[#FF2D2D] text-[9px] font-black h-5 uppercase px-1.5 animate-pulse">
          HOT
        </Badge>
      </div>

      {/* 3x3 Grid Navigation */}
      <div className="tiles mb-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="tile flex flex-col items-center justify-center aspect-square"
          >
            <item.icon className="w-6 h-6 mb-2 text-white/90" strokeWidth={1.5} />
            <span className="text-[10px] font-bold text-white/80 text-center leading-tight">{item.label}</span>
            {item.badge && (
              <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                item.badge === 'NEW' ? 'bg-[#1DB954]' : 'bg-[#FF2D2D]'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Promo/Camp Widget */}
      <div className="glass-card p-4 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-xl">
            ⭕
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold leading-tight">Москва · 12–14 окт</div>
            <div className="text-[11px] text-white/50 mt-0.5">Ближайший кэмп · заполнено 72%</div>
          </div>
          <Link
            href="/camps/1"
            className="bg-[#FF2D2D] text-white px-4 py-2 rounded-xl font-bold text-xs active:scale-95 transition-transform"
          >
            Предбронь
          </Link>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-white/40">
            <span>Прогресс мест</span>
            <span className="text-[#FF2D2D]">Осталось 7 мест</span>
          </div>
          <Progress value={72} className="flex-col gap-0 h-auto">
            <ProgressTrack className="h-1.5 bg-white/5">
                <ProgressIndicator className="bg-[#FF2D2D]" />
            </ProgressTrack>
          </Progress>
        </div>

        <div className="hr my-3 opacity-50" />

        <div className="flex items-center justify-between">
          <div className="text-[10px] text-white/60 max-w-[180px]">
            🔥 Спец-кэмп «Power Jump» · −10% до 12.10
          </div>
          <div className="flex gap-2">
             <button className="text-[11px] font-bold text-white/40 uppercase hover:text-white transition-colors">Подробнее</button>
             <button className="text-[11px] font-black text-[#FF2D2D] uppercase hover:opacity-80 transition-opacity">Оплатить</button>
          </div>
        </div>
      </div>
    </div>
  );
}
