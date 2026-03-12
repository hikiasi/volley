import { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, Users, Video, GraduationCap, MessageSquare } from "lucide-react";

export default function TrainerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Mobile Header */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-sm font-black uppercase italic tracking-tighter">Кабинет тренера</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FF2D2D]/20 border border-[#FF2D2D]/30 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#FF2D2D]" />
        </div>
      </header>

      <main className="container mx-auto max-w-[430px]">
        {children}
      </main>

      {/* Bottom Nav for Trainer */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-6 safe-area-pb z-50">
        <Link href="/trainer" className="flex flex-col items-center gap-1 group">
          <Users className="w-5 h-5 text-white group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-bold uppercase text-white/50 group-data-[active=true]:text-white">Ученики</span>
        </Link>
        <Link href="/trainer/reviews" className="flex flex-col items-center gap-1 group relative">
          <Video className="w-5 h-5 text-white group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-bold uppercase text-white/50">Видео</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF2D2D] rounded-full text-[8px] font-black flex items-center justify-center">3</div>
        </Link>
        <Link href="/trainer/courses" className="flex flex-col items-center gap-1 group">
          <GraduationCap className="w-5 h-5 text-white group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-bold uppercase text-white/50">Мои курсы</span>
        </Link>
        <Link href="/trainer/messages" className="flex flex-col items-center gap-1 group">
          <MessageSquare className="w-5 h-5 text-white group-active:scale-90 transition-transform" />
          <span className="text-[10px] font-bold uppercase text-white/50">Чат</span>
        </Link>
      </nav>
    </div>
  );
}
