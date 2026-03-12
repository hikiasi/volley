"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'jump', label: 'Прыжок' },
  { id: 'speed', label: 'Скорость' },
  { id: 'upper_body', label: 'Верх тела' },
  { id: 'free', label: 'Бесплатные' },
];

import { Course } from "@prisma/client";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-[430px] min-h-screen bg-[#0A0A0A]">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-90 transition-transform border border-white/5">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Атлетизм</h1>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full bg-transparent p-0 h-auto gap-2 mb-8 overflow-x-auto no-scrollbar justify-start flex-nowrap">
          {CATEGORIES.map(cat => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 data-[state=active]:bg-[#FF2D2D] data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest transition-all h-10 italic"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="mt-0 outline-none">
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5 animate-pulse" />
                ))
              ) : (
                (cat.id === 'all' ? courses : courses.filter(c => c.category === cat.id)).map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group bg-[#1A1A1A] rounded-[32px] overflow-hidden border border-white/5 flex flex-col active:scale-95 transition-all"
                  >
                    <div className="aspect-square relative bg-white/5 overflow-hidden">
                        {course.coverImageUrl ? (
                            <img src={course.coverImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl">🏐</div>
                        )}
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-black/60 backdrop-blur-md text-[8px] font-black uppercase tracking-tighter px-2 border-none">
                                {course.level}
                            </Badge>
                        </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                            <h3 className="text-xs font-black uppercase italic tracking-tight leading-tight line-clamp-2">
                                {course.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2">
                                <Trophy className="w-3 h-3 text-[#1DB954]" />
                                <span className="text-[10px] font-black text-[#1DB954] uppercase italic tracking-tighter">
                                    {course.expectedResult}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1 text-[9px] font-bold text-white/40 uppercase">
                                <Clock className="w-3 h-3" />
                                {course.durationWeeks}н
                            </div>
                            <div className="text-xs font-black italic text-[#FF2D2D]">
                                {course.price === 0 ? 'FREE' : `${(course.price / 100).toLocaleString()} ₽`}
                            </div>
                        </div>
                    </div>
                  </Link>
                ))
              )}

              {!loading && (cat.id !== 'all' && courses.filter(c => c.category === cat.id).length === 0) && (
                <div className="col-span-2 py-20 text-center flex flex-col items-center gap-4">
                  <div className="text-4xl opacity-20">🎯</div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">Курсов пока нет</div>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
