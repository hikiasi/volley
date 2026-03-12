"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Camp } from "@prisma/client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
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
  const { user, loading: authLoading } = useAuth();
  const [latestCamp, setLatestCamp] = useState<Camp | null>(null);
  const [loadingCamp, setLoadingCamp] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchLatestCamp() {
      try {
        const res = await fetch("/api/camps?status=published");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setLatestCamp(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest camp:", err);
      } finally {
        setLoadingCamp(false);
      }
    }
    fetchLatestCamp();
  }, []);

  if (authLoading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-bold uppercase">Загрузка...</div>;
  if (!user) return null;

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
      {latestCamp ? (
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-xl">
              {latestCamp.city === 'Москва' ? '🗼' : latestCamp.city === 'Сочи' ? '🌴' : '🏐'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold leading-tight">{latestCamp.city} · {format(new Date(latestCamp.startDate), 'd MMM', { locale: ru })}</div>
              <div className="text-[11px] text-white/50 mt-0.5">Ближайший кэмп · заполнено {Math.round((latestCamp.currentParticipants / latestCamp.maxParticipants) * 100)}%</div>
            </div>
            <Link
              href={`/camps/${latestCamp.slug}`}
              className="bg-[#FF2D2D] text-white px-4 py-2 rounded-xl font-bold text-xs active:scale-95 transition-transform"
            >
              Предбронь
            </Link>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-white/40">
              <span>Прогресс мест</span>
              <span className={latestCamp.maxParticipants - latestCamp.currentParticipants <= 5 ? "text-[#FF2D2D]" : ""}>
                Осталось {latestCamp.maxParticipants - latestCamp.currentParticipants} мест
              </span>
            </div>
            <Progress value={(latestCamp.currentParticipants / latestCamp.maxParticipants) * 100} className="flex-col gap-0 h-auto">
              <ProgressTrack className="h-1.5 bg-white/5">
                  <ProgressIndicator className="bg-[#FF2D2D]" />
              </ProgressTrack>
            </Progress>
          </div>

          {latestCamp.hotMessage && (
            <>
              <div className="hr my-3 opacity-50" />
              <div className="flex items-center justify-between">
                <div className="text-[10px] text-white/60 max-w-[180px]">
                  🔥 {latestCamp.hotMessage}
                </div>
                <div className="flex gap-2">
                   <Link href={`/camps/${latestCamp.slug}`} className="text-[11px] font-bold text-white/40 uppercase hover:text-white transition-colors">Подробнее</Link>
                   <Link href={`/camps/${latestCamp.slug}/book`} className="text-[11px] font-black text-[#FF2D2D] uppercase hover:opacity-80 transition-opacity">Оплатить</Link>
                </div>
              </div>
            </>
          )}
        </div>
      ) : loadingCamp ? (
        <div className="glass-card p-8 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#FF2D2D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-card p-6 text-center border-dashed border-white/10">
          <div className="text-2xl mb-2">🏐</div>
          <div className="text-xs font-bold text-white/40 uppercase">Новые кэмпы скоро появятся</div>
        </div>
      )}
    </div>
  );
}
