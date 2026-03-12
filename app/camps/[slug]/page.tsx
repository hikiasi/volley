"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, MapPin, CheckCircle2, CreditCard, MessageCircle, FileText, UserCheck, Clock, Share2, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Camp, Trainer } from "@prisma/client";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

type CampWithTrainers = Camp & {
    trainers: { trainer: Trainer }[]
}

export default function CampDetailPage({ params }: { params: { slug: string } }) {
  const [camp, setCamp] = useState<CampWithTrainers | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "deposit" | "installment">("full");
  const [consents, setConsents] = useState({ pdp: false, waiver: false });

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
      const res = await fetch(`/api/camps/${params.slug}/pre-book`, {
        method: "POST"
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
    if (!consents.pdp || !consents.waiver) {
      alert("Пожалуйста, примите все обязательные согласия");
      return;
    }

    try {
        const res = await fetch(`/api/camps/${params.slug}/book`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentType,
            pdpConsent: consents.pdp,
            waiverConsent: consents.waiver
          })
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

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-black uppercase">Загрузка...</div>;
  if (!camp) return <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center text-white">
      <h1 className="text-xl font-black mb-4 uppercase">Кэмп не найден</h1>
      <Link href="/camps" className="bg-[#FF2D2D] text-white px-8 py-3 rounded-2xl font-black uppercase text-sm">В каталог</Link>
  </div>;

  const subNav = [
    { icon: MessageCircle, label: "Chat", href: `/camps/${params.slug}/chat` },
    { icon: MapPin, label: "Location", href: `/camps/${params.slug}/location` },
    { icon: FileText, label: "Memo", href: `/camps/${params.slug}/memo` },
    { icon: UserCheck, label: "Verify", href: `/camps/${params.slug}/verify` },
    { icon: Clock, label: "Waitlist", href: `/camps/${params.slug}/waitlist` },
  ];

  const occupancy = Math.round((camp.currentParticipants / camp.maxParticipants) * 100);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32">
      {/* Photo Gallery Placeholder */}
      <div className="relative h-[300px] w-full bg-white/5 overflow-hidden">
        {camp.coverImageUrl ? (
          <img src={camp.coverImageUrl} className="w-full h-full object-cover opacity-80" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 text-6xl">🏐</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/40" />

        <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
          <Link href="/camps" className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ChevronLeft className="w-6 h-6 text-white" />
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-4">
            <div className="flex gap-2 mb-3">
                <Badge className="bg-[#FF2D2D] text-[10px] font-black uppercase px-3 py-1 rounded-lg italic">
                    {camp.level}
                </Badge>
                {occupancy > 70 && <Badge className="bg-[#FF2D2D]/20 text-[#FF2D2D] text-[10px] font-black uppercase px-3 py-1 rounded-lg">Hot</Badge>}
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white leading-none uppercase drop-shadow-lg">
                {camp.city}
            </h1>
            <div className="text-xs font-bold text-white/60 mt-1 uppercase tracking-widest">
                {format(new Date(camp.startDate), 'd MMMM', { locale: ru })}
            </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-[#1A1A1A] rounded-2xl p-2 border border-white/5 shadow-2xl flex justify-between items-center">
          {subNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center w-16 h-16 rounded-xl hover:bg-white/5 transition-colors active:scale-95"
            >
              <item.icon className="w-5 h-5 text-[#FF2D2D] mb-1.5" />
              <span className="text-[9px] font-black uppercase text-white/40 tracking-tighter">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 mt-8 space-y-8">
        {/* Occupancy Progress */}
        <section className="space-y-3">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Заполненность</div>
                    <div className="text-sm font-black text-white italic uppercase">Заполнено {occupancy}%</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black uppercase text-[#FF2D2D] tracking-widest mb-1">Места</div>
                    <div className="text-sm font-black text-white italic uppercase">Осталось {camp.maxParticipants - camp.currentParticipants}</div>
                </div>
            </div>
            <Progress value={occupancy} className="h-3 bg-white/5 rounded-full overflow-hidden">
                <ProgressTrack className="h-full">
                    <ProgressIndicator className="bg-[#FF2D2D] rounded-full" />
                </ProgressTrack>
            </Progress>
        </section>

        {/* Pricing Info */}
        <section className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/5 space-y-5">
           <div className="flex justify-between items-center">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Полная стоимость</span>
                <span className="text-2xl font-black italic text-white mt-1">
                {(camp.basePrice / 100).toLocaleString('ru-RU')} ₽
                </span>
             </div>
             <Badge className="bg-[#1DB954] text-[10px] uppercase font-black italic rounded-lg px-2">Best Deal</Badge>
           </div>

           {camp.depositAmount && (
             <div className="pt-5 border-t border-white/5 flex justify-between items-center">
               <div className="flex flex-col">
                 <span className="text-[10px] font-black text-[#FF2D2D] uppercase tracking-widest">Предбронь</span>
                 <span className="text-base font-black italic text-white/70 mt-0.5">{(camp.depositAmount / 100).toLocaleString('ru-RU')} ₽</span>
               </div>
               <div className="text-[10px] font-bold text-white/30 italic uppercase text-right">
                 Гарантия места<br/>на 24 часа
               </div>
             </div>
           )}
        </section>

        {/* Accordions */}
        <Accordion className="w-full space-y-3">
          <AccordionItem value="included" className="border-none bg-[#1A1A1A] rounded-2xl px-5 border border-white/5">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-center gap-4 text-sm font-black uppercase italic tracking-tighter">
                <div className="w-8 h-8 rounded-lg bg-[#FF2D2D]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#FF2D2D]" />
                </div>
                Что входит
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <ul className="grid grid-cols-1 gap-3">
                {(camp.whatsIncluded as string[] || []).map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-white/60 font-bold uppercase tracking-tight">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D2D] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="trainers" className="border-none bg-[#1A1A1A] rounded-2xl px-5 border border-white/5">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-center gap-4 text-sm font-black uppercase italic tracking-tighter">
                <div className="w-8 h-8 rounded-lg bg-[#FF2D2D]/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#FF2D2D]" />
                </div>
                Тренеры
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="space-y-4">
                {camp.trainers?.map(({ trainer }, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden">
                        {trainer.photoUrl && <img src={trainer.photoUrl} className="w-full h-full object-cover" alt="" />}
                    </div>
                    <div>
                        <div className="text-sm font-black uppercase italic">{trainer.name}</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase">{trainer.specialization}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location" className="border-none bg-[#1A1A1A] rounded-2xl px-5 border border-white/5">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-center gap-4 text-sm font-black uppercase italic tracking-tighter">
                <div className="w-8 h-8 rounded-lg bg-[#FF2D2D]/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#FF2D2D]" />
                </div>
                Адрес и время
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 space-y-4">
               <div className="space-y-1">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Локация</div>
                    <div className="text-xs font-bold text-white/80 uppercase">{camp.venueName}</div>
                    <div className="text-[11px] text-white/50">{camp.address}</div>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/5 p-3 rounded-xl">
                        <div className="text-[9px] font-black text-[#FF2D2D] uppercase tracking-widest mb-1">Сбор</div>
                        <div className="text-base font-black italic">{camp.assemblyTime ? format(new Date(camp.assemblyTime), 'HH:mm') : '09:30'}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                        <div className="text-[9px] font-black text-[#FF2D2D] uppercase tracking-widest mb-1">Старт</div>
                        <div className="text-base font-black italic">{camp.startTime ? format(new Date(camp.startTime), 'HH:mm') : '10:00'}</div>
                    </div>
               </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent backdrop-blur-xl border-t border-white/5 safe-area-pb z-50">
        <div className="max-w-[430px] mx-auto flex gap-3">
          <button
            onClick={handlePreBook}
            className="flex-1 bg-[#1A1A1A] text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            Предбронь
          </button>
          <button
            onClick={() => setShowCheckout(true)}
            className="flex-[1.5] bg-[#FF2D2D] text-white h-14 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#FF2D2D]/20"
          >
            <CreditCard className="w-5 h-5" />
            Оплатить
          </button>
        </div>
      </div>

      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300 p-4 flex items-end sm:items-center">
          <div className="w-full max-w-[400px] mx-auto bg-[#0A0A0A] rounded-[32px] p-8 space-y-8 animate-in slide-in-from-bottom duration-500 border border-white/10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Оплата</h2>
              <button onClick={() => setShowCheckout(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-xs font-black">X</button>
            </div>

            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Способ оплаты</span>
               <div className="space-y-3">
                 <button
                    onClick={() => setPaymentType("full")}
                    className={`w-full p-5 rounded-2xl border transition-all flex justify-between items-center ${paymentType === 'full' ? 'bg-[#FF2D2D] border-[#FF2D2D] text-white shadow-lg shadow-[#FF2D2D]/20' : 'bg-white/5 border-white/5 text-white/60'}`}
                 >
                   <span className="text-xs font-black uppercase italic">Полная оплата</span>
                   <span className="text-base font-black italic">{(camp.basePrice / 100).toLocaleString()} ₽</span>
                 </button>

                 {camp.depositAmount && (
                    <button
                      onClick={() => setPaymentType("deposit")}
                      className={`w-full p-5 rounded-2xl border transition-all flex justify-between items-center ${paymentType === 'deposit' ? 'bg-[#FF2D2D] border-[#FF2D2D] text-white shadow-lg shadow-[#FF2D2D]/20' : 'bg-white/5 border-white/5 text-white/60'}`}
                    >
                      <span className="text-xs font-black uppercase italic">Депозит</span>
                      <span className="text-base font-black italic">{(camp.depositAmount / 100).toLocaleString()} ₽</span>
                    </button>
                 )}

                 <button
                    onClick={() => setPaymentType("installment")}
                    className={`w-full p-5 rounded-2xl border transition-all flex justify-between items-center ${paymentType === 'installment' ? 'bg-[#FF2D2D] border-[#FF2D2D] text-white shadow-lg shadow-[#FF2D2D]/20' : 'bg-white/5 border-white/5 text-white/60'}`}
                 >
                   <span className="text-xs font-black uppercase italic">Рассрочка Сплит</span>
                   <Badge className="bg-white text-[#FF2D2D] text-[9px] font-black">0%</Badge>
                 </button>
               </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consents.pdp}
                  onChange={e => setConsents({...consents, pdp: e.target.checked})}
                  className="mt-1 w-5 h-5 rounded-lg border-white/20 bg-white/5 accent-[#FF2D2D]"
                />
                <span className="text-[10px] text-white/40 leading-snug font-bold uppercase tracking-tight">Я согласен на обработку персональных данных</span>
              </label>
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consents.waiver}
                  onChange={e => setConsents({...consents, waiver: e.target.checked})}
                  className="mt-1 w-5 h-5 rounded-lg border-white/20 bg-white/5 accent-[#FF2D2D]"
                />
                <span className="text-[10px] text-white/40 leading-snug font-bold uppercase tracking-tight">Я принимаю условия оферты и вайвера</span>
              </label>
            </div>

            <button
              onClick={handlePay}
              disabled={!consents.pdp || !consents.waiver}
              className="w-full bg-[#FF2D2D] h-16 rounded-[20px] font-black uppercase text-sm tracking-widest disabled:opacity-20 shadow-2xl shadow-[#FF2D2D]/30 transition-all"
            >
              Оплатить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
