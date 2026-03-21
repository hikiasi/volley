"use client";

import Link from "next/link";
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, Filter, Search, MapPin, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Define the type for a single camp object
type Camp = {
  id: string;
  slug: string;
  title: string;
  city: string;
  coverImageUrl?: string | null;
  startDate: string; // Dates will be passed as strings
  basePrice: number;
  maxParticipants: number;
  currentParticipants: number;
};

// Define the props for the CampList component
type CampListProps = {
  initialCamps: Camp[];
  cities: string[];
  activeCity?: string;
};

export function CampList({ initialCamps, cities, activeCity }: CampListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCamps = initialCamps.filter(camp =>
    camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camp.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cityFilters = [
    { id: "all", label: "Все", city: undefined },
    ...cities.map(city => ({ id: city, label: city, city: city }))
  ];

  return (
    <div className="min-h-screen bg-v-dark text-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-full bg-v-card flex items-center justify-center active:scale-90 transition-transform border border-zinc-800">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Кэмпы</h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-v-card flex items-center justify-center active:scale-90 transition-transform border border-zinc-800">
              <Filter className="w-5 h-5 text-v-text-muted" />
            </button>
          </div>
        </header>

        <div className="relative mb-6">
            <Input 
                type="text"
                placeholder="Поиск по названию или городу..."
                className="h-12 bg-v-card border-zinc-800 rounded-lg pl-10 pr-4 focus:ring-v-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-v-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4">
          {cityFilters.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === 'all' ? '/camps' : `?city=${cat.city}`}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all border",
                (activeCity === cat.city || (cat.id === 'all' && !activeCity))
                  ? "bg-v-accent border-v-accent text-white"
                  : "bg-v-card border-zinc-800 text-v-text-muted hover:text-white"
              )}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="space-y-4">
          {filteredCamps.length > 0 ? (
            filteredCamps.map((camp) => {
              const fillPercentage = Math.round((camp.currentParticipants / camp.maxParticipants) * 100);
              return (
                <Link href={`/camps/${camp.slug}`} key={camp.id} className="block bg-v-card rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors overflow-hidden">
                  <div className="w-full h-32 bg-zinc-900">
                    <img src={camp.coverImageUrl || `https://source.unsplash.com/random/400x225?volleyball,${camp.id}`} alt={camp.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold mb-1">{camp.title}</h3>
                      <span className="text-sm font-bold text-v-accent">{(camp.basePrice / 100).toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex items-center gap-4 text-v-text-muted text-xs mb-3">
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {camp.city}</div>
                        <div className="flex items-center gap-1.5"><CalendarDays className="w-3 h-3" /> {format(new Date(camp.startDate), 'd MMMM', { locale: ru })}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-v-text-muted">
                          <span>Заполнено {fillPercentage}%</span>
                          <span>Осталось {camp.maxParticipants - camp.currentParticipants}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5">
                          <div className="bg-v-green h-1.5 rounded-full" style={{width: `${fillPercentage}%`}}></div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="text-center py-20 bg-v-card rounded-2xl border border-zinc-800">
              <div className="text-4xl mb-4">🏐</div>
              <h3 className="font-bold text-white/80 mb-2">Кэмпов не найдено</h3>
              <p className="text-sm text-v-text-muted">Попробуйте изменить фильтры или поисковый запрос.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
