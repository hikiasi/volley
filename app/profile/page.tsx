import { ChevronLeft, Settings, Award, Calendar, PlayCircle, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

const MOCK_USER = {
  firstName: "Константин",
  username: "voley_king",
  ensoLevel: "Shugyosha",
  ensoPoints: 1250,
  nextLevelPoints: 2000,
  campsCount: 3,
  coursesCount: 2,
};

export default async function ProfilePage() {
  const user = MOCK_USER; // Should be fetched from session in real app

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
             <div className="w-full h-full rounded-[14px] bg-[#0A0A0A] flex items-center justify-center text-3xl">
               🏐
             </div>
           </div>
           <div>
             <h2 className="text-xl font-black uppercase italic italic">{user.firstName}</h2>
             <div className="text-xs text-white/40 font-medium">@{user.username}</div>
             <Badge className="mt-2 bg-[#FF2D2D] text-[9px] font-black uppercase px-2 py-0.5 border-none">
               {user.ensoLevel}
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
             <span className="text-[10px] font-black text-white/40 uppercase">Уровень 2</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold italic">
               <span>{user.ensoPoints} pts</span>
               <span className="text-white/30">{user.nextLevelPoints} pts</span>
            </div>
            <Progress value={(user.ensoPoints / user.nextLevelPoints) * 100} className="flex-col gap-0 h-auto">
              <ProgressTrack className="h-2 bg-white/5">
                <ProgressIndicator className="bg-gradient-to-r from-[#FF2D2D] to-[#FF8080]" />
              </ProgressTrack>
            </Progress>
          </div>
        </section>

        {/* Menu Grid */}
        <section className="grid grid-cols-2 gap-3">
           <div className="glass-card p-4 space-y-1">
              <div className="text-xl font-black italic">{user.campsCount}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase">Мои кэмпы</div>
           </div>
           <div className="glass-card p-4 space-y-1">
              <div className="text-xl font-black italic">{user.coursesCount}</div>
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
        </section>
      </div>
    </div>
  );
}
