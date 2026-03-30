"use client";

import Link from "next/link";
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { ChevronLeft, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CampCard } from "@/components/camp-card"; // Import the actual CampCard
import type { Camp } from '@prisma/client'; // Import the full type from Prisma

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

        <div className="grid grid-cols-1 gap-4">
          {filteredCamps.length > 0 ? (
            filteredCamps.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))
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
