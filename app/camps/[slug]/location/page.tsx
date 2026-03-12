"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, MapPin, Phone, MessageCircle, Copy, ExternalLink, Calendar, Car, Train, Footprints } from "lucide-react";
import Link from "next/link";
import { Camp } from "@prisma/client";

export default function CampLocationPage({ params }: { params: { slug: string } }) {
  const [camp, setCamp] = useState<Camp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();
      tg.BackButton.onClick(() => window.history.back());
    }

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

  const copyAddress = () => {
    if (camp?.address) {
      navigator.clipboard.writeText(camp.address);
      alert("Адрес скопирован!");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-bold uppercase">Загрузка...</div>;
  if (!camp) return <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center text-white">
      <h1 className="text-xl font-black mb-4 uppercase">Кэмп не найден</h1>
  </div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-10">
      <header className="p-4 flex items-center gap-4 border-b border-white/5 bg-black/20 sticky top-0 z-50 backdrop-blur-md">
        <Link href={`/camps/${params.slug}`} className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xs font-black uppercase text-white/40 tracking-widest">Локация и контакты</h1>
          <p className="text-sm font-bold truncate max-w-[200px]">{camp.city} · {camp.title}</p>
        </div>
      </header>

      {/* Map Embed Placeholder */}
      <div className="w-full aspect-video bg-white/5 relative overflow-hidden flex items-center justify-center">
        {camp.lat && camp.lng ? (
          <div className="text-center p-6">
            <MapPin className="w-10 h-10 text-[#FF2D2D] mx-auto mb-3" />
            <p className="text-xs text-white/40 font-medium">Интеграция Yandex Maps API</p>
            <p className="text-[10px] text-white/20 mt-1">{camp.lat.toString()}, {camp.lng.toString()}</p>
          </div>
        ) : (
          <div className="text-white/20 text-xs font-black uppercase tracking-widest">Карта недоступна</div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Address Card */}
        <div className="glass-card p-4 space-y-4">
           <div className="flex justify-between items-start gap-4">
             <div className="space-y-1">
               <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Адрес площадки</span>
               <p className="text-sm font-bold leading-snug">{camp.address || "Адрес уточняется"}</p>
               <p className="text-[11px] text-white/50 font-medium italic">{camp.venueName}</p>
             </div>
             <button onClick={copyAddress} className="p-2.5 rounded-xl bg-white/5 border border-white/5 active:bg-white/10">
               <Copy className="w-4 h-4 text-white/60" />
             </button>
           </div>

           <div className="flex gap-2">
             <a
               href={camp.yandexMapsUrl || `https://yandex.ru/maps/?text=${encodeURIComponent(camp.address || '')}`}
               target="_blank"
               className="flex-1 bg-white/10 h-12 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase active:scale-95 transition-transform"
             >
               <ExternalLink className="w-3.5 h-3.5" />
               Яндекс Карты
             </a>
           </div>
        </div>

        {/* Travel Time */}
        <div className="flex justify-between gap-3">
          <div className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5">
            <Car className="w-5 h-5 text-white/40" />
            <span className="text-[10px] font-black uppercase">25 мин</span>
          </div>
          <div className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5">
            <Train className="w-5 h-5 text-[#FF2D2D]" />
            <span className="text-[10px] font-black uppercase">40 мин</span>
          </div>
          <div className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5">
            <Footprints className="w-5 h-5 text-white/40" />
            <span className="text-[10px] font-black uppercase">15 мин</span>
          </div>
        </div>

        {/* Organizer Contacts */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Контакты организатора</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${camp.organizerPhone}`} className="glass-card p-4 flex flex-col gap-3 active:scale-95 transition-transform">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[11px] font-bold">Позвонить</span>
            </a>
            <a href={camp.organizerTelegram || "#"} className="glass-card p-4 flex flex-col gap-3 active:scale-95 transition-transform">
              <div className="w-8 h-8 rounded-lg bg-[#0088cc]/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#0088cc]" />
              </div>
              <span className="text-[11px] font-bold">Написать</span>
            </a>
          </div>
        </div>

        {/* Important Info */}
        <div className="glass-card p-4 space-y-4">
           <div className="flex items-center gap-3 text-[11px] font-black uppercase">
             <Calendar className="w-4 h-4 text-[#FF2D2D]" />
             Тайминг сбора
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-white/5 rounded-xl">
               <span className="text-[10px] text-white/30 block mb-1">Время сбора</span>
               <span className="text-lg font-black italic">09:30</span>
             </div>
             <div className="p-3 bg-white/5 rounded-xl border border-[#FF2D2D]/20">
               <span className="text-[10px] text-white/30 block mb-1">Начало кэмпа</span>
               <span className="text-lg font-black italic">10:00</span>
             </div>
           </div>
        </div>

        {camp.hotMessage && (
          <div className="p-4 bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 rounded-2xl">
             <p className="text-xs font-bold text-[#FF2D2D] text-center leading-tight uppercase">
               ⚠️ {camp.hotMessage}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
