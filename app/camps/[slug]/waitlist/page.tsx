import { ChevronLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function WaitlistPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link href={`/camps/${params.slug}`} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xs font-bold uppercase text-white/50">Кэмпы — детали</h1>
        <button className="p-2">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </header>

      {/* Hero Mini */}
      <div className="px-4 mb-6">
        <div className="relative h-48 rounded-3xl overflow-hidden bg-white/5 border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=1000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-[#FF2D2D]/20 text-[#FF2D2D] border-none text-[10px] font-black uppercase px-3 py-1">
              Распродан
            </Badge>
          </div>
          <div className="absolute bottom-6 left-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Москва · 12-14 окт
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Waitlist Status Card */}
        <section className="glass-card p-6 border-[#FF2D2D]/20">
          <h3 className="text-sm font-black uppercase text-[#FF2D2D] text-center mb-6 tracking-widest">
            Лист ожидания
          </h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3 text-sm font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 shrink-0" />
              <span>Вы добавлены</span>
            </li>
            <li className="flex items-start gap-3 text-sm font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 shrink-0" />
              <span>Ваша позиция: <span className="text-[#FF2D2D]">12</span></span>
            </li>
            <li className="flex items-start gap-3 text-sm font-medium leading-tight">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 shrink-0" />
              <span>Ожидаемое время уведомления: <br /><span className="text-white/50 italic">при освобождении</span></span>
            </li>
            <li className="flex items-start gap-3 text-sm font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              <span>Автоуведомление включено</span>
            </li>
          </ul>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-12 border-white/10 bg-white/5 rounded-xl font-bold uppercase text-[10px]">
              Изменить кэмп
            </Button>
            <Button className="flex-1 h-12 bg-transparent border border-[#FF2D2D]/30 text-[#FF2D2D] rounded-xl font-bold uppercase text-[10px] hover:bg-[#FF2D2D]/10">
              Отменить заявку
            </Button>
          </div>
        </section>

        {/* Action Button */}
        <Button className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-xs">
          Перейти к другим кэмпам
        </Button>

        {/* Notification Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
          <span className="text-sm font-bold">Обновить уведомления</span>
          <Switch className="data-[state=checked]:bg-[#FF2D2D]" />
        </div>

        {/* Recommendations */}
        <section className="pt-4">
          <h4 className="text-[10px] font-black uppercase text-[#10B981] mb-4 tracking-widest">
            Рекомендовано
          </h4>
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
            <div className="w-16 h-12 rounded-lg bg-white/10 overflow-hidden shrink-0">
               <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=100" className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-black uppercase truncate">Москва · 12-14 окт</p>
               <div className="flex justify-between items-center mt-1">
                 <span className="text-[10px] text-white/40">Лист ожидания</span>
                 <span className="text-[10px] font-bold text-[#10B981]">72%</span>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
