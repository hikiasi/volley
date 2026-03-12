import { ChevronLeft, Bell, Calendar, Flame } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const MOCK_NEWS = [
  {
    id: 1,
    title: "Новый кэмп в Сочи!",
    description: "Открываем запись на весенний кэмп. Солнце, море и волейбол — идеальное комбо.",
    tag: "Кэмпы",
    date: "Сегодня, 12:40",
    image: "https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400"
  },
  {
    id: 2,
    title: "Обновление курса «Прыжок PRO»",
    description: "Добавили 3 новых упражнения на взрывную силу голеностопа. Проверь свой личный кабинет.",
    tag: "Курсы",
    date: "Вчера, 18:15",
    isHot: true
  },
  {
    id: 3,
    title: "Прямой эфир с тренером",
    description: "Обсудим типичные ошибки в технике нападающего удара. Ссылка в нашем Telegram канале.",
    tag: "Событие",
    date: "12 окт",
    image: "https://images.unsplash.com/photo-1628779238951-be2c9f2a59f4?q=80&w=400"
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-10">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 border-b border-white/5">
        <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-black uppercase italic tracking-tighter">Новости</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FF2D2D] rounded-full border-2 border-[#0A0A0A]" />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {MOCK_NEWS.map((item) => (
          <article key={item.id} className="glass-card overflow-hidden border-white/5">
            {item.image && (
              <div className="h-48 w-full overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover" alt="" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-[9px] font-black uppercase border-[#FF2D2D]/30 text-[#FF2D2D]">
                    {item.tag}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                </div>
              </div>

              <h2 className="text-lg font-black leading-tight mb-2 uppercase">
                  {item.isHot && <Flame className="w-4 h-4 text-[#FF2D2D] inline mr-1 -mt-1" />}
                  {item.title}
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                  {item.description}
              </p>

              <div className="mt-4 flex justify-end">
                <button className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#FF2D2D] transition-colors">
                    Читать далее
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
