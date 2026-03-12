"use client";

import { useEffect, useState } from "react";
import { CampCard } from "@/components/camp-card";
import { ChevronLeft, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Camp } from "@prisma/client";

const categories = [
  { id: "all", label: "Все" },
  { id: "nearest", label: "Ближайшие" },
  { id: "level", label: "Мой уровень" },
  { id: "moscow", label: "Москва" },
  { id: "spb", label: "СПб" },
  { id: "sochi", label: "Сочи" },
];

export default function CampsPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function fetchCamps() {
      setLoading(true);
      try {
        let url = "/api/camps?status=published";
        if (activeCategory === "moscow") url += "&city=Москва";
        if (activeCategory === "spb") url += "&city=Санкт-Петербург";
        if (activeCategory === "sochi") url += "&city=Сочи";

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setCamps(data);
        }
      } catch (err) {
        console.error("Failed to fetch camps:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCamps();
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-[430px] min-h-screen bg-[#0A0A0A]">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-90 transition-transform border border-white/5">
            <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Кэмпы</h1>
        </div>
        <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-90 transition-transform border border-white/5">
                <Search className="w-5 h-5 text-white/40" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-90 transition-transform border border-white/5">
                <Filter className="w-5 h-5 text-white/40" />
            </button>
        </div>
      </header>

      {/* Horizontal Filter Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs font-black uppercase italic tracking-tight transition-all border ${
              activeCategory === cat.id
                ? "bg-[#FF2D2D] border-[#FF2D2D] text-white shadow-lg shadow-[#FF2D2D]/20"
                : "bg-white/5 border-white/5 text-white/40 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-8 h-8 border-4 border-[#FF2D2D] border-t-transparent rounded-full animate-spin" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Загрузка...</span>
          </div>
        ) : camps.length > 0 ? (
          camps.map((camp) => (
            <CampCard key={camp.id} camp={camp as (Partial<Camp> & { id: string; slug: string; title: string; city: string; level: string; startDate: Date; basePrice: number; maxParticipants: number; currentParticipants: number })} />
          ))
        ) : (
          <div className="text-center py-20 glass-card border border-white/5 rounded-3xl bg-white/5">
            <div className="text-4xl mb-4">🏐</div>
            <h3 className="font-black uppercase italic text-white/60 mb-2">Кэмпов не найдено</h3>
            <p className="text-[10px] text-white/30 uppercase tracking-widest leading-loose">Следите за обновлениями в сообществе</p>
          </div>
        )}
      </div>
    </div>
  );
}
