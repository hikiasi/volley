import { ChevronLeft, FileText, Info, AlertCircle, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function MemoPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      <header className="p-4 flex items-center justify-between border-b border-white/5">
        <Link href={`/camps/${params.slug}/location`} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-sm font-bold uppercase">Памятка кэмпа</h1>
        <div className="w-10" />
      </header>

      <div className="p-6 space-y-8">
        <div className="flex items-center gap-4 p-4 bg-[#FF2D2D]/10 rounded-2xl border border-[#FF2D2D]/20">
          <Info className="w-6 h-6 text-[#FF2D2D]" />
          <p className="text-xs font-bold leading-tight">
            Пожалуйста, внимательно ознакомьтесь с правилами и рекомендациями перед началом кэмпа.
          </p>
        </div>

        <Accordion className="w-full space-y-4">
          <AccordionItem value="logistics" className="border-none bg-white/5 rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline py-5 text-sm font-black uppercase tracking-widest">
              Логистика и сбор
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-xs text-white/60 leading-relaxed space-y-4">
               <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-[#FF2D2D] shrink-0" />
                  <p>Сбор участников в фойе за 30 минут до начала первой тренировки.</p>
               </div>
               <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 text-[#FF2D2D] shrink-0" />
                  <p>Парковка на территории платная (150₽/час).</p>
               </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rules" className="border-none bg-white/5 rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline py-5 text-sm font-black uppercase tracking-widest">
              Правила поведения
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-xs text-white/60 leading-relaxed space-y-4">
               <p>• Соблюдайте спортивную дисциплину и уважайте тренеров и других участников.</p>
               <p>• Обязательно наличие сменной чистой обуви.</p>
               <p>• Использование магнезии разрешено только в специальных зонах.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contacts" className="border-none bg-white/5 rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline py-5 text-sm font-black uppercase tracking-widest">
              Экстренные контакты
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-xs text-white/60 leading-relaxed space-y-4">
               <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                  <span>Старший администратор</span>
                  <div className="flex gap-3">
                    <Phone className="w-4 h-4 text-[#10B981]" />
                    <span className="font-bold">+7 (999) 000-00-00</span>
                  </div>
               </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="space-y-4 pt-4">
           <h3 className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Документы</h3>
           <Link href="#" className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                 <FileText className="w-5 h-5 text-white/40" />
                 <span className="text-xs font-bold uppercase">Договор оферты</span>
              </div>
              <ChevronLeft className="w-4 h-4 rotate-180 text-white/20" />
           </Link>
           <Link href="#" className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                 <FileText className="w-5 h-5 text-white/40" />
                 <span className="text-xs font-bold uppercase">Согласие на обработку ПД</span>
              </div>
              <ChevronLeft className="w-4 h-4 rotate-180 text-white/20" />
           </Link>
        </section>
      </div>
    </div>
  );
}
