import { ChevronLeft, Quote } from "lucide-react";
import Link from "next/link";

export default function ManifestPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="p-4 flex items-center gap-4 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 border-b border-white/5">
        <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-black uppercase italic tracking-tighter">Манифест</h1>
      </header>

      <div className="p-6 space-y-8 pb-20">
        <section className="relative">
          <Quote className="absolute -top-4 -left-2 w-12 h-12 text-[#FF2D2D]/10 -z-10" />
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
            Ты решаешь <br />как играть и жить
          </h2>
          <p className="text-sm text-white/70 leading-relaxed font-medium">
            VOLLEYDZEN — это не просто тренировки. Это философия осознанного подхода к спорту и жизни. Мы верим, что каждый волейболист способен на большее, если у него есть правильные инструменты и сообщество.
          </p>
        </section>

        <section className="space-y-6">
           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF2D2D]/10 flex items-center justify-center shrink-0 border border-[#FF2D2D]/20">
                <span className="text-lg font-black text-[#FF2D2D]">01</span>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase mb-1 tracking-tight">Дисциплина — это свобода</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">Системный подход к тренировкам дает результат, который открывает новые возможности на площадке.</p>
              </div>
           </div>

           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF2D2D]/10 flex items-center justify-center shrink-0 border border-[#FF2D2D]/20">
                <span className="text-lg font-black text-[#FF2D2D]">02</span>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase mb-1 tracking-tight">Внимание к деталям</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">Техника прыжка, биомеханика удара, психология победителя — мы разбираем игру на атомы.</p>
              </div>
           </div>

           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF2D2D]/10 flex items-center justify-center shrink-0 border border-[#FF2D2D]/20">
                <span className="text-lg font-black text-[#FF2D2D]">03</span>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase mb-1 tracking-tight">Сила сообщества</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">Вместе мы растем быстрее. Обмен опытом и поддержка — основа VOLLEYDZEN.</p>
              </div>
           </div>
        </section>

        <section className="bg-white/5 p-6 rounded-3xl border border-white/5">
            <h3 className="text-lg font-black uppercase italic mb-3">Наш путь</h3>
            <p className="text-xs text-white/60 leading-relaxed italic">
              &quot;Путь Энсо — это символ бесконечного развития. Мы не останавливаемся на достигнутом, каждый день становясь лучшей версией себя.&quot;
            </p>
        </section>
      </div>
    </div>
  );
}
