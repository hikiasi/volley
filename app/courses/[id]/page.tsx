"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, CheckCircle2, XCircle, Play, CreditCard, Users, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Course, Trainer, CourseWeek, CourseDay } from "@prisma/client";

type CourseWithRelations = Course & {
    trainer: Trainer | null,
    weeks: (CourseWeek & { days: CourseDay[] })[]
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-black uppercase">Загрузка...</div>;
  if (!course) return <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center text-white">
      <h1 className="text-xl font-black mb-4 uppercase">Курс не найден</h1>
      <Link href="/courses" className="bg-[#FF2D2D] text-white px-8 py-3 rounded-2xl font-black uppercase text-sm">В каталог</Link>
  </div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32">
      {/* Hero Section */}
      <div className="relative aspect-video w-full bg-white/5 overflow-hidden">
        {course.coverImageUrl ? (
          <img src={course.coverImageUrl} className="w-full h-full object-cover opacity-60" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 text-8xl">🏐</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

        <div className="absolute top-6 left-4">
          <Link href="/courses" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
            <ChevronLeft className="w-6 h-6 text-white" />
          </Link>
        </div>

        <div className="absolute bottom-6 left-4 right-4">
            <div className="flex gap-2 mb-3">
                <Badge className="bg-[#1DB954] text-[10px] font-black uppercase px-3 py-1 rounded-lg italic">
                    {course.expectedResult}
                </Badge>
                <Badge className="bg-white/10 text-white/70 text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                    {course.level}
                </Badge>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white leading-none uppercase">
                {course.title}
            </h1>
        </div>
      </div>

      <div className="px-4 mt-8 space-y-10">
        {/* Quick Meta */}
        <section className="flex justify-between gap-2">
            {[
                { label: "Длительность", value: `${course.durationWeeks} недель` },
                { label: "В день", value: course.minutesPerDay },
                { label: "Доступ", value: "Навсегда" }
            ].map((m, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5 text-center">
                    <div className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">{m.label}</div>
                    <div className="text-[11px] font-bold text-white uppercase italic">{m.value}</div>
                </div>
            ))}
        </section>

        {/* Description & Requirements */}
        <section className="space-y-6">
            <div className="space-y-3">
                <h3 className="text-xs font-black uppercase italic tracking-widest text-[#FF2D2D]">О программе</h3>
                <p className="text-sm text-white/60 leading-relaxed font-medium">{course.description}</p>
            </div>

            {course.requirements && (
                <div className="bg-[#FF2D2D]/5 rounded-2xl p-4 border border-[#FF2D2D]/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-[#FF2D2D]" />
                        <span className="text-[10px] font-black uppercase text-[#FF2D2D]">Важно перед стартом</span>
                    </div>
                    <p className="text-xs text-white/70 font-medium leading-relaxed">{course.requirements}</p>
                </div>
            )}
        </section>

        {/* Benefits Grid */}
        <section className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-[#1DB954] tracking-widest px-1">Кому подойдет</h4>
                <div className="space-y-2">
                    {((course.suitableFor as string[]) || []).map((item, i) => (
                        <div key={i} className="flex gap-2 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0 mt-0.5" />
                            <span className="text-[10px] font-bold text-white/70 leading-tight">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-[#FF2D2D] tracking-widest px-1">Противопоказания</h4>
                <div className="space-y-2">
                    {((course.notSuitableFor as string[]) || []).map((item, i) => (
                        <div key={i} className="flex gap-2 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                            <XCircle className="w-3.5 h-3.5 text-[#FF2D2D] shrink-0 mt-0.5" />
                            <span className="text-[10px] font-bold text-white/70 leading-tight">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Curriculum Preview */}
        <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black uppercase italic tracking-widest text-white/40">Программа обучения</h3>
                <Badge className="bg-white/5 text-white/40 text-[9px] font-black">{course.weeks.length} недель</Badge>
            </div>
            <Accordion className="space-y-2">
                {course.weeks.map((week) => (
                    <AccordionItem key={week.id} value={week.id} className="border-none bg-white/5 rounded-2xl px-4">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black italic text-[#FF2D2D] w-5 text-right">0{week.weekNumber}</span>
                                <div className="text-left">
                                    <div className="text-[11px] font-black uppercase italic tracking-tighter">{week.title}</div>
                                    <div className="text-[9px] text-white/30 font-bold uppercase">{week.days.length} тренировок</div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 space-y-2">
                            {week.days.map((day) => (
                                <div key={day.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        <span className="text-[10px] font-bold text-white/60 uppercase">{day.title}</span>
                                    </div>
                                    {day.isFree && <Badge className="bg-[#1DB954] text-[8px] h-4">Free</Badge>}
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>

        {/* Trainer Card */}
        {course.trainer && (
            <section className="bg-[#1A1A1A] rounded-[32px] p-6 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Users className="w-20 h-20" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-white/5 overflow-hidden border border-white/10">
                        {course.trainer.photoUrl && <img src={course.trainer.photoUrl} className="w-full h-full object-cover" alt="" />}
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-[#FF2D2D] uppercase tracking-widest mb-0.5">Твой тренер</div>
                        <div className="text-base font-black italic uppercase italic tracking-tighter">{course.trainer.name}</div>
                    </div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{course.trainer.bio}</p>
                <Link href={`/trainers/${course.trainer.id}`} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-[#FF2D2D] group-hover:gap-3 transition-all">
                    Подробнее о тренере <ArrowRight className="w-3 h-3" />
                </Link>
            </section>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent backdrop-blur-xl border-t border-white/5 safe-area-pb z-50">
        <div className="max-w-[430px] mx-auto flex gap-3">
          <Link
            href={`/courses/${course.slug}/day/1`}
            className="flex-1 bg-white/10 text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <Play className="w-4 h-4 text-[#FF2D2D]" />
            Пробный день
          </Link>
          <button
            onClick={() => setShowCheckout(true)}
            className="flex-[1.5] bg-[#FF2D2D] text-white h-14 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#FF2D2D]/20"
          >
            <CreditCard className="w-5 h-5" />
            Купить курс
          </button>
        </div>
      </div>

      {/* Checkout Modal Placeholder */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300 p-4 flex items-end sm:items-center">
            <div className="w-full max-w-[400px] mx-auto bg-[#0A0A0A] rounded-[32px] p-8 space-y-8 border border-white/10">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Покупка курса</h2>
                    <button onClick={() => setShowCheckout(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-xs font-black italic">X</button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Итого</span>
                            <span className="text-xl font-black italic">{(course.price / 100).toLocaleString()} ₽</span>
                        </div>
                        <Badge className="bg-[#1DB954] text-[9px] font-black italic rounded-lg">Best Deal</Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Уровни коучинга</div>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { id: "lite", label: "Review Lite", price: "+1 500 ₽" },
                                { id: "pro", label: "Review Pro", price: "+3 000 ₽" }
                            ].map(tier => (
                                <button key={tier.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-white/60 hover:border-[#FF2D2D]/30 transition-all">
                                    <span className="text-[11px] font-black uppercase italic">{tier.label}</span>
                                    <span className="text-[10px] font-black text-[#FF2D2D] italic">{tier.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button className="w-full bg-[#FF2D2D] h-16 rounded-[20px] font-black uppercase text-sm tracking-widest shadow-2xl shadow-[#FF2D2D]/30 active:scale-95 transition-all">
                    Оформить доступ
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
