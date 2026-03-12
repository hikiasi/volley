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
  Compass,
  TrendingUp,
  MessageCircle,
  Users,
  Bell,
  ShoppingBag,
  User
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

const navItems = [
  { icon: History, label: "Манифест", href: "/manifest" },
  { icon: CalendarDays, label: "Кэмпы", href: "/camps", badge: "3" },
  { icon: Compass, label: "Путь Энсо", href: "/profile" },
  { icon: TrendingUp, label: "Атлетизм", href: "/courses" },
  { icon: MessageCircle, label: "Консультации", href: "/consultations" },
  { icon: Users, label: "Офлайн", href: "/offline" },
  { icon: Bell, label: "Новости", href: "/news", badge: "2" },
  { icon: ShoppingBag, label: "Мерч", href: "/merch", badge: "NEW" },
  { icon: User, label: "Профиль", href: "/profile" },
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
        const res = await fetch("/api/camps?status=published&limit=1");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLatestCamp(data[0]);
          } else if (data && !Array.isArray(data) && data.id) {
            setLatestCamp(data);
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
    <div className="container mx-auto px-4 py-6 max-w-[430px]">
      <header className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-[#FF2D2D] flex items-center justify-center">
             <div className="w-5 h-5 rounded-full bg-[#FF2D2D]" />
          </div>
          <div>
            <div className="text-xl font-black italic tracking-tighter text-white leading-none">VOLLEYDZEN</div>
            <div className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-0.5">ты решаешь как играть и жить</div>
          </div>
        </div>
      </header>

      {/* Community Banner */}
      <div className="bg-[#1A1A1A] rounded-2xl p-4 mb-4 flex items-center justify-between border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <Users className="w-5 h-5 text-white/70" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-tight text-white">Сообщество</div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider"><span className="text-[#FF2D2D]">12 540</span> участников</div>
          </div>
        </div>
        <Badge variant="destructive" className="bg-[#FF2D2D] text-[9px] font-black h-6 uppercase px-2 animate-pulse rounded-lg">
          HOT
        </Badge>
      </div>

      {/* 3x3 Grid Navigation */}
      <div className="tiles mb-6">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="tile flex flex-col items-center justify-center aspect-square relative"
          >
            <item.icon className="w-6 h-6 mb-2 text-white/90" strokeWidth={1.5} />
            <span className="text-[10px] font-bold text-white/80 text-center leading-tight uppercase tracking-tighter">{item.label}</span>
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

      {/* Latest Camp Banner */}
      {latestCamp ? (
        <div className="bg-[#1A1A1A] rounded-[24px] p-5 relative overflow-hidden border border-white/5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner">
              {latestCamp.city === 'Москва' ? '🗼' : latestCamp.city === 'Сочи' ? '🌴' : '🏐'}
            </div>
            <div className="flex-1">
              <div className="text-base font-black italic uppercase italic tracking-tighter text-white leading-tight">
                {latestCamp.city} · {format(new Date(latestCamp.startDate), 'd MMM', { locale: ru })}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5 uppercase font-bold tracking-wider">Ближайший кэмп · заполнено {Math.round((latestCamp.currentParticipants / latestCamp.maxParticipants) * 100)}%</div>
            </div>
            <Link
              href={`/camps/${latestCamp.slug}`}
              className="bg-[#FF2D2D] text-white px-4 py-2.5 rounded-xl font-black uppercase text-[10px] active:scale-95 transition-transform shadow-lg shadow-[#FF2D2D]/20"
            >
              Предбронь
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">
              <span>Прогресс мест</span>
              <span className={latestCamp.maxParticipants - latestCamp.currentParticipants <= 5 ? "text-[#FF2D2D]" : ""}>
                Осталось {latestCamp.maxParticipants - latestCamp.currentParticipants} мест
              </span>
            </div>
            <Progress value={(latestCamp.currentParticipants / latestCamp.maxParticipants) * 100} className="flex-col gap-0 h-auto">
              <ProgressTrack className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <ProgressIndicator className="bg-[#FF2D2D] rounded-full" />
              </ProgressTrack>
            </Progress>
          </div>

          {latestCamp.hotMessage && (
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="text-[10px] font-bold text-white/40 uppercase leading-relaxed max-w-[200px]">
                🔥 {latestCamp.hotMessage}
              </div>
              <Link href={`/camps/${latestCamp.slug}`} className="text-[10px] font-black text-[#FF2D2D] uppercase tracking-tighter border-b border-[#FF2D2D]/30 pb-0.5">
                Подробнее
              </Link>
            </div>
          )}
        </div>
      ) : loadingCamp ? (
        <div className="bg-[#1A1A1A] rounded-3xl p-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#FF2D2D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#1A1A1A] rounded-3xl p-8 text-center border border-dashed border-white/10">
          <div className="text-3xl mb-3 opacity-50">🏐</div>
          <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Новые кэмпы скоро появятся</div>
        </div>
      )}
    </div>
  );
}
