import { ChevronLeft, MoreHorizontal, Copy, Calendar, MessageSquare, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function LocationPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link href={`/camps/${params.slug}`} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-sm font-bold uppercase">Адрес и карта</h1>
        <button className="p-2">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </header>

      <div className="px-4 space-y-6">
        {/* Title & Times */}
        <section>
          <h2 className="text-xl font-black uppercase text-[#FF2D2D] mb-4">
            Кэмп Москва · 12–14 окт
          </h2>
          <div className="flex gap-2">
             <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold text-[#10B981]">25 мин</div>
             <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold text-[#10B981]">18 мин</div>
             <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold text-[#10B981]">12 мин</div>
          </div>
        </section>

        {/* Map Preview */}
        <div className="relative h-48 rounded-3xl overflow-hidden bg-white/5 border border-white/10">
          <div className="absolute inset-0 bg-[#1A1A1A] flex flex-col items-center justify-center p-6 text-center">
             <div className="w-12 h-12 rounded-full bg-[#FF2D2D] flex items-center justify-center mb-3">
                <div className="w-8 h-8 rounded-full border-2 border-black/20" />
             </div>
             <p className="text-sm font-black uppercase tracking-tight">Волейбол Арена</p>
          </div>
          {/* Real map would be integrated here */}
        </div>

        {/* Address Info */}
        <section className="flex gap-4">
          <div className="flex-1">
             <p className="text-sm font-medium leading-relaxed mb-4">
               Ул. Летчика Бабушкина, 23, стр.1, Москва
             </p>
             <div className="flex gap-2">
                <Button variant="outline" className="h-10 bg-white/5 border-white/10 rounded-xl text-[10px] font-bold uppercase gap-2">
                  <Copy className="w-3.5 h-3.5" /> Копировать адрес
                </Button>
                <Button variant="outline" className="h-10 bg-white/5 border-white/10 rounded-xl text-[10px] font-bold uppercase gap-2 text-[#10B981]">
                   Открыть в Maps
                </Button>
             </div>
          </div>
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
             <img src="https://images.unsplash.com/photo-1592660503155-7599a37f06a6?q=80&w=200" className="w-full h-full object-cover" alt="Venue" />
          </div>
        </section>

        {/* What to Bring Checklist */}
        <section className="bg-white/5 rounded-3xl p-6 border border-white/10">
           <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                 <h3 className="text-sm font-black uppercase tracking-widest">Что взять</h3>
                 <p className="text-[10px] text-white/30 font-bold uppercase">2 сбо <span className="inline-block w-3 h-3 rounded-full bg-white/10 ml-1" /> <span className="inline-block w-3 h-3 rounded-full bg-white/10 ml-0.5" /></p>
              </div>
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-white/10">
                 <img src="https://images.unsplash.com/photo-1592660503155-7599a37f06a6?q=80&w=200" className="w-full h-full object-cover opacity-50" alt="" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-y-4">
              <div className="space-y-4">
                {[
                  { id: 'water', label: 'Вода' },
                  { id: 'uniform', label: 'Форма' },
                  { id: 'shoes', label: 'Кроссовки' },
                  { id: 'towel', label: 'Полотенце' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Checkbox id={item.id} className="border-white/20 data-[state=checked]:bg-[#FF2D2D] data-[state=checked]:border-[#FF2D2D]" />
                    <label htmlFor={item.id} className="text-xs font-medium text-white/70">{item.label}</label>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pl-4 border-l border-white/5">
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white/30 uppercase">Сбор 09:30</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase">Начало 10:00</p>
                 </div>
                 <div className="flex flex-col gap-2 pt-2">
                    <p className="text-[10px] font-bold text-white/30 uppercase">Контакт ор</p>
                    <div className="flex gap-3">
                       <MessageSquare className="w-4 h-4 text-white/40" />
                       <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                          <span className="text-[8px]">📞</span>
                       </div>
                       <div className="w-4 h-4 border border-white/40 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-white/40 rounded-sm" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Action List */}
        <section className="space-y-3">
          <Button variant="outline" className="w-full h-14 bg-white/5 border-white/10 rounded-2xl justify-between px-6 font-bold text-xs uppercase">
             <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-white/40" />
                Добавить в календарь .ics
             </div>
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-14 bg-white/5 border-white/10 rounded-2xl justify-start gap-4 px-6 font-bold text-xs uppercase">
               <MessageSquare className="w-5 h-5 text-white/40" />
               Чат участников
            </Button>
            <Button variant="outline" className="flex-1 h-14 bg-white/5 border-white/10 rounded-2xl justify-start gap-4 px-6 font-bold text-xs uppercase">
               <BookOpen className="w-5 h-5 text-white/40" />
               Памятка
            </Button>
          </div>
        </section>

        {/* Warning Toast */}
        <div className="bg-[#FFA500]/10 border border-[#FFA500]/20 rounded-xl p-4 flex items-center gap-3">
           <AlertCircle className="w-5 h-5 text-[#FFA500]" />
           <span className="text-xs font-bold text-[#FFA500]">Hot бр: Парковка платная</span>
        </div>
      </div>
    </div>
  );
}
