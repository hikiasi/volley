"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Calendar, MapPin, Info, CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Camp } from "@prisma/client";

export default function CampDetailPage({ params }: { params: { slug: string } }) {
  const [camp, setCamp] = useState<Camp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCamp() {
      try {
        const res = await fetch(`/api/camps/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setCamp(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCamp();
  }, [params.slug]);

  const handlePreBook = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/camps/${params.slug}/pre-book`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Место забронировано на 24 часа! Мы отправили уведомление в Telegram.");
      } else {
        const err = await res.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch {
        alert("Произошла ошибка при бронировании");
    }
  };

  const handlePay = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/camps/${params.slug}/book`, {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ paymentType: "full" })
        });
        if (res.ok) {
          const { paymentUrl } = await res.json();
          window.location.href = paymentUrl;
        } else {
          const err = await res.json();
          alert(`Ошибка: ${err.error}`);
        }
      } catch {
          alert("Произошла ошибка при создании платежа");
      }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-bold uppercase">Загрузка...</div>;
  if (!camp) return <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center text-white">
      <h1 className="text-xl font-black mb-4 uppercase">Кэмп не найден</h1>
      <Link href="/camps" className="bg-[#FF2D2D] text-white px-8 py-3 rounded-2xl font-black uppercase text-sm">В каталог</Link>
  </div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32">
      {/* Hero Header */}
      <div className="relative h-64 bg-white/5">
        {camp.coverImageUrl && (
          <img src={camp.coverImageUrl} className="w-full h-full object-cover opacity-60" alt="" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />

        <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
          <Link href="/camps" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <Badge className="bg-[#FF2D2D] text-[10px] font-black uppercase px-3 py-1">
            {camp.level}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-2">
            {camp.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-white/70 font-medium">
             <div className="flex items-center gap-1.5">
               <MapPin className="w-3.5 h-3.5 text-[#FF2D2D]" />
               {camp.city}
             </div>
             <div className="flex items-center gap-1.5">
               <Calendar className="w-3.5 h-3.5 text-[#FF2D2D]" />
               {camp.startDate && format(new Date(camp.startDate), 'd MMMM', { locale: ru })}
             </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        {/* Description */}
        <section>
           <p className="text-sm text-white/70 leading-relaxed font-medium">
             {camp.description}
           </p>
        </section>

        {/* Pricing Info */}
        <section className="glass-card p-4 space-y-4">
           <div className="flex justify-between items-center">
             <span className="text-xs font-bold text-white/50 uppercase">Полная стоимость</span>
             <span className="text-xl font-black text-white">
               {(camp.basePrice / 100).toLocaleString('ru-RU')} ₽
             </span>
           </div>
           {camp.depositAmount && (
             <div className="flex justify-between items-center border-t border-white/5 pt-4">
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-white/50 uppercase">Депозит</span>
                 <span className="text-[10px] text-white/30 italic">для бронирования места</span>
               </div>
               <span className="text-lg font-black text-[#FF2D2D]">{(camp.depositAmount / 100).toLocaleString('ru-RU')} ₽</span>
             </div>
           )}
        </section>

        {/* Accordions */}
        <Accordion className="w-full space-y-2">
          <AccordionItem value="included" className="border-none bg-white/5 rounded-2xl px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-sm font-bold uppercase">
                <CheckCircle2 className="w-5 h-5 text-[#FF2D2D]" />
                Что включено
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-2.5">
                {(camp.whatsIncluded as string[] || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/60 font-medium leading-tight">
                    <div className="w-1 h-1 rounded-full bg-[#FF2D2D] mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bring" className="border-none bg-white/5 rounded-2xl px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-sm font-bold uppercase">
                <Info className="w-5 h-5 text-[#FF2D2D]" />
                Что взять с собой
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
               <ul className="space-y-2.5">
                {(camp.whatToBring as string[] || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/60 font-medium leading-tight">
                    <div className="w-1 h-1 rounded-full bg-[#FF2D2D] mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent backdrop-blur-lg border-t border-white/5 safe-area-pb">
        <div className="max-w-[430px] mx-auto flex gap-3">
          <button
            onClick={handlePreBook}
            className="flex-1 bg-white/10 text-white h-14 rounded-2xl font-black uppercase text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/5"
          >
            Предбронь
          </button>
          <button
            onClick={handlePay}
            className="flex-[1.5] bg-[#FF2D2D] text-white h-14 rounded-2xl font-black uppercase text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Оплатить
          </button>
        </div>
      </div>
    </div>
  );
}
