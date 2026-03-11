import { getCourseBySlug } from "@/lib/courses";
import { ChevronLeft, Star, Info, CheckCircle2, Play, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const MOCK_COURSE = {
  id: "1",
  slug: 'jump-pro-6-weeks',
  title: 'Прыжок PRO',
  category: 'jump',
  expectedResult: '+8–12 см',
  level: 'intermediate',
  durationWeeks: 6,
  minutesPerDay: '45 мин',
  price: 490000,
  description: "Самая эффективная программа для увеличения вертикального прыжка. За 6 недель мы проработаем взрывную силу, технику и мобильность.",
  requirements: "Без острых болей в коленях и спине",
  suitableFor: ["Тем, кто хочет забивать сверху", "Волейболистам всех уровней"],
  notSuitableFor: ["Людям с травмами в острой фазе"],
  rating: 4.8,
  reviewsCount: 352,
  coverImageUrl: null as string | null,
  weeks: [
    {
      weekNumber: 1,
      title: "Фундамент и техника",
      days: [
        { dayNumber: 1, title: "Тестирование и база", exercises: [{}, {}, {}] }
      ]
    },
    { weekNumber: 2, title: "Взрывная сила", days: [] }
  ],
  trainer: {
    name: "Алексей Спиридонов",
    bio: "Мастер спорта международного класса, топовый тренер по ОФП.",
    photoUrl: null as string | null,
  }
};

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  let course;
  try {
    const fetchedCourse = await getCourseBySlug(params.slug);
    course = fetchedCourse || MOCK_COURSE;
  } catch {
    course = MOCK_COURSE;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-40">
      {/* Header */}
      <div className="relative h-72 bg-white/5">
        {(course.coverImageUrl && (
          <img src={course.coverImageUrl} className="w-full h-full object-cover opacity-60" alt="" />
        )) || (
            <div className="w-full h-full flex items-center justify-center text-white/5 text-6xl font-black italic uppercase">
                {course.category}
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />

        <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
          <Link href="/athletics" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-[11px] font-bold">{String(course.rating || 4.9)}</span>
            <span className="text-[10px] text-white/40">({course.reviewsCount || 120})</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-4">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">
            {course.title}
          </h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#1DB954] text-[10px] font-black uppercase border-none">
              {course.expectedResult}
            </Badge>
            <span className="text-xs text-white/50 font-medium">· {course.durationWeeks} недель тренировок</span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        {/* About */}
        <section>
           <h2 className="text-lg font-black uppercase italic mb-3">О программе</h2>
           <p className="text-sm text-white/70 leading-relaxed">
             {course.description}
           </p>
           {course.requirements && (
             <div className="mt-4 flex gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
               <Info className="w-5 h-5 text-[#FF2D2D] shrink-0" />
               <div className="text-xs text-white/60">
                 <span className="font-bold text-white block mb-0.5">Требования:</span>
                 {course.requirements}
               </div>
             </div>
           )}
        </section>

        {/* Suitable for */}
        <section className="grid grid-cols-2 gap-4">
           <div>
             <h3 className="text-[10px] font-black uppercase text-white/40 mb-3 tracking-wider">Кому подойдёт</h3>
             <ul className="space-y-2">
               {(course.suitableFor as string[] || []).map((item, i) => (
                 <li key={i} className="flex gap-2 text-[11px] text-white/80 font-medium">
                   <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                   {item}
                 </li>
               ))}
             </ul>
           </div>
           <div>
             <h3 className="text-[10px] font-black uppercase text-white/40 mb-3 tracking-wider">Кому не подойдёт</h3>
             <ul className="space-y-2">
               {(course.notSuitableFor as string[] || []).map((item, i) => (
                 <li key={i} className="flex gap-2 text-[11px] text-white/80 font-medium opacity-50">
                   <div className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center text-[10px] shrink-0">×</div>
                   {item}
                 </li>
               ))}
             </ul>
           </div>
        </section>

        {/* Trainer Card */}
        {course.trainer && (
          <section className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 shrink-0 overflow-hidden">
               {course.trainer.photoUrl && <img src={course.trainer.photoUrl} className="w-full h-full object-cover" alt={course.trainer.name} />}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-[#FF2D2D] mb-1">Тренер</div>
              <div className="font-bold text-sm mb-1">{course.trainer.name}</div>
              <p className="text-[11px] text-white/50 leading-tight">{course.trainer.bio}</p>
            </div>
          </section>
        )}

        {/* Content Accordion */}
        <section>
          <h2 className="text-lg font-black uppercase italic mb-4">Что внутри</h2>
          <Accordion className="w-full space-y-2">
             {((course.weeks as unknown as { weekNumber: number; title: string; days: { dayNumber: number; title: string }[] }[]) || []).map((week, i) => (
               <AccordionItem key={i} value={`week-${i}`} className="border-none bg-white/5 rounded-2xl px-4">
                 <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black">
                        {week.weekNumber}
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black text-white/40 uppercase">Неделя {week.weekNumber}</div>
                        <div className="text-xs font-bold">{week.title}</div>
                      </div>
                    </div>
                 </AccordionTrigger>
                 <AccordionContent className="pb-4 border-t border-white/5 pt-4">
                    <div className="space-y-2">
                      {week.days?.map((day, j) => (
                        <div key={j} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="text-[10px] font-black text-[#FF2D2D]">ДЕНЬ {day.dayNumber}</div>
                             <div className="text-xs font-medium text-white/70">{day.title}</div>
                          </div>
                          {day.dayNumber === 1 ? (
                             <Badge className="bg-[#1DB954] text-[8px] font-black uppercase border-none">FREE</Badge>
                          ) : (
                             <Lock className="w-3 h-3 text-white/20" />
                          )}
                        </div>
                      ))}
                    </div>
                 </AccordionContent>
               </AccordionItem>
             ))}
          </Accordion>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent backdrop-blur-lg border-t border-white/5 safe-area-pb">
        <div className="max-w-[430px] mx-auto space-y-3">
           <div className="flex items-center justify-between px-2">
              <div>
                <div className="text-[10px] font-black text-white/40 uppercase">Полный доступ</div>
                <div className="text-lg font-black">{(course.price / 100).toLocaleString('ru-RU')} ₽</div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-bold text-[#1DB954]">7 дней — возврат</div>
                 <div className="text-[10px] text-white/40 italic">доступ навсегда</div>
              </div>
           </div>
           <div className="flex gap-2">
              <Link
                href={`/athletics/${course.slug}/day/1`}
                className="flex-1 bg-white text-black h-14 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Play className="w-4 h-4 fill-current" />
                Пробный день
              </Link>
              <button className="flex-1 bg-[#FF2D2D] text-white h-14 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,45,45,0.3)]">
                Купить сейчас
                <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
