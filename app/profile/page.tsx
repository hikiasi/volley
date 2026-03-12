"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Settings, Award, Calendar, PlayCircle, CreditCard, ChevronRight, LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

interface ProfileUser {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  email?: string;
  photoUrl?: string;
  role?: "user" | "trainer" | "admin";
  ensoPoints?: number;
  ensoLevel?: { name: string };
  bookings?: unknown[];
  userCourses?: unknown[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token"); // or from cookies
        const res = await fetch("/api/user/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-bold">Загрузка...</div>;
  if (!user) return <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center">
    <h1 className="text-xl font-black mb-4 uppercase">Вы не авторизованы</h1>
    <Link href="/" className="bg-[#FF2D2D] text-white px-8 py-3 rounded-2xl font-black uppercase text-sm">На главную</Link>
  </div>;

  const ensoPoints = user.ensoPoints || 0;
  const nextLevelPoints = 2000; // Mock

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 border-b border-white/5">
        <Link href="/" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-black uppercase italic tracking-widest">Профиль</h1>
        <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <Settings className="w-4 h-4" />
        </button>
      </header>

      <div className="p-4 space-y-6">
        {/* User Card */}
        <section className="flex items-center gap-4">
           <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF2D2D] to-[#800000] p-1">
             <div className="w-full h-full rounded-[14px] bg-[#0A0A0A] flex items-center justify-center text-3xl overflow-hidden">
               {user.photoUrl ? <img src={user.photoUrl} className="w-full h-full object-cover" alt="Avatar" /> : "🏐"}
             </div>
           </div>
           <div>
             <h2 className="text-xl font-black uppercase italic italic">{user.firstName} {user.lastName}</h2>
             <div className="text-xs text-white/40 font-medium">{user.username ? `@${user.username}` : user.email}</div>
             <Badge className="mt-2 bg-[#FF2D2D] text-[9px] font-black uppercase px-2 py-0.5 border-none">
               {user.ensoLevel?.name || "Shoshin"}
             </Badge>
           </div>
        </section>

        {/* Enso Progress */}
        <section className="glass-card p-4 space-y-3">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2">
               <Award className="w-4 h-4 text-[#FF2D2D]" />
               <span className="text-[10px] font-black uppercase tracking-wider">Путь Энсо</span>
             </div>
             <span className="text-[10px] font-black text-white/40 uppercase">Уровень 1</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold italic">
               <span>{ensoPoints} pts</span>
               <span className="text-white/30">{nextLevelPoints} pts</span>
            </div>
            <Progress value={(ensoPoints / nextLevelPoints) * 100} className="flex-col gap-0 h-auto">
              <ProgressTrack className="h-2 bg-white/5">
                <ProgressIndicator className="bg-gradient-to-r from-[#FF2D2D] to-[#FF8080]" />
              </ProgressTrack>
            </Progress>
          </div>
        </section>

        {/* Menu Grid */}
        <section className="grid grid-cols-2 gap-3">
           <div className="glass-card p-4 space-y-1">
              <div className="text-xl font-black italic">{user.bookings?.length || 0}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase">Мои кэмпы</div>
           </div>
           <div className="glass-card p-4 space-y-1">
              <div className="text-xl font-black italic">{user.userCourses?.length || 0}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase">Мои курсы</div>
           </div>
        </section>

        {/* List Actions */}
        <section className="space-y-2">
           {[
             { icon: Calendar, label: "Мои бронирования", href: "/profile/bookings" },
             { icon: PlayCircle, label: "Моё обучение", href: "/profile/courses" },
             { icon: CreditCard, label: "История оплат", href: "/profile/payments" },
           ].map((item, i) => (
             <Link key={i} href={item.href} className="flex items-center justify-between p-4 glass-card active:scale-[0.98] transition-transform">
               <div className="flex items-center gap-3">
                 <item.icon className="w-5 h-5 text-white/60" />
                 <span className="text-xs font-bold uppercase">{item.label}</span>
               </div>
               <ChevronRight className="w-4 h-4 text-white/20" />
             </Link>
           ))}

           {user.role === "admin" && (
             <Link href="/admin" className="flex items-center justify-between p-4 glass-card active:scale-[0.98] transition-all bg-blue-500/5 border-blue-500/10">
               <div className="flex items-center gap-3">
                 <Shield className="w-5 h-5 text-blue-400" />
                 <span className="text-xs font-black uppercase text-blue-400 tracking-wider">Панель управления</span>
               </div>
               <ChevronRight className="w-4 h-4 text-blue-400/20" />
             </Link>
           )}

           <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 glass-card active:scale-[0.98] transition-all bg-red-500/5 border-red-500/10"
           >
             <div className="flex items-center gap-3">
               <LogOut className="w-5 h-5 text-[#FF2D2D]" />
               <span className="text-xs font-black uppercase text-[#FF2D2D] tracking-wider">Выйти из аккаунта</span>
             </div>
           </button>
        </section>

        {/* 152-FZ Footer */}
        <div className="text-center pt-4">
           <p className="text-[9px] text-white/20 font-medium leading-relaxed px-10">
             Все ваши данные хранятся на защищенных серверах на территории РФ в соответствии с 152-ФЗ.
           </p>
        </div>
      </div>
    </div>
  );
}
