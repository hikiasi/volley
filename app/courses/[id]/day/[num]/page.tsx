"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Play, CheckCircle2, Info, Timer, History, Trophy } from "lucide-react";
import Link from "next/link";

type Exercise = {
  id: string;
  title: string;
  category: string;
  vimeoVideoId: string;
}

type DayExercise = {
  section: string;
  sets: number;
  reps: number;
  restSecs: number;
  exercise: Exercise;
}

type DayData = {
  title: string;
  week: { weekNumber: number; title: string };
  exercises: DayExercise[];
}

export default function TrainingDayPage({ params }: { params: { id: string; num: string } }) {
  const [day, setDay] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [rpe, setRpe] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDay() {
      try {
        // In real app, we fetch from /api/user/courses/:id/day/:num
        const res = await fetch(`/api/courses/${params.id}`);
        if (res.ok) {
          const course = await res.json();
          // Mocking the day selection from the course data for MVP
          const currentWeek = course.weeks[0];
          const currentDay = currentWeek.days[parseInt(params.num) - 1] || currentWeek.days[0];
          setDay({
            title: currentDay.title,
            week: { weekNumber: currentWeek.weekNumber, title: currentWeek.title },
            exercises: currentDay.exercises
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDay();
  }, [params.id, params.num]);

  const toggleExercise = (id: string) => {
    setCompletedExercises(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-black uppercase">Загрузка...</div>;
  if (!day) return <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white">День не найден</div>;

  const sections = ["warmup", "main", "plyometric", "cooldown"];
  const progress = Math.round((completedExercises.length / day.exercises.length) * 100);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-40">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href={`/courses/${params.id}`} className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 active:scale-90 transition-transform">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="text-[9px] font-black uppercase text-[#FF2D2D] tracking-widest italic">Неделя {day.week.weekNumber} · День {params.num}</div>
            <h1 className="text-sm font-black uppercase italic tracking-tighter leading-none mt-1">{day.title}</h1>
          </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] font-black italic text-white/40 uppercase">{progress}%</div>
            <div className="w-12 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-[#FF2D2D] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 space-y-10">
        {sections.map((section) => {
          const sectionExercises = day.exercises.filter(ex => ex.section === section);
          if (sectionExercises.length === 0) return null;

          return (
            <div key={section} className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">
                  {section === 'warmup' ? 'Разминка' : section === 'main' ? 'Основной блок' : section === 'plyometric' ? 'Плиометрика' : 'Заминка'}
                </h3>
                {sectionExercises.every(ex => completedExercises.includes(ex.exercise.id)) && (
                   <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                )}
              </div>

              <div className="space-y-3">
                {sectionExercises.map((ex) => (
                  <div
                    key={ex.exercise.id}
                    className={`bg-[#1A1A1A] rounded-2xl p-4 border transition-all flex items-center justify-between ${completedExercises.includes(ex.exercise.id) ? 'border-[#1DB954]/20 opacity-60' : 'border-white/5'}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                       <button
                        onClick={() => setActiveExercise(ex.exercise)}
                        className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group active:scale-95 transition-all shrink-0"
                       >
                         <Play className={`w-5 h-5 ${completedExercises.includes(ex.exercise.id) ? 'text-white/40' : 'text-[#FF2D2D]'}`} />
                       </button>
                       <div className="flex-1">
                         <h4 className="text-xs font-black uppercase italic tracking-tight">{ex.exercise.title}</h4>
                         <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1 text-[9px] font-bold text-white/30 uppercase">
                                <History className="w-3 h-3" />
                                {ex.sets}×{ex.reps}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-white/30 uppercase">
                                <Timer className="w-3 h-3" />
                                {ex.restSecs}с отдых
                            </div>
                         </div>
                       </div>
                    </div>

                    <button
                        onClick={() => toggleExercise(ex.exercise.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${completedExercises.includes(ex.exercise.id) ? 'bg-[#1DB954] text-black' : 'border-2 border-white/10 text-transparent'}`}
                    >
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* RPE Selector */}
        <section className="bg-[#1A1A1A] rounded-[32px] p-6 border border-white/5 space-y-6">
            <div className="text-center space-y-1">
                <h3 className="text-xs font-black uppercase italic tracking-widest">Оцени нагрузку (RPE)</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase">Насколько тяжело было сегодня?</p>
            </div>
            <div className="flex justify-between gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                    <button
                        key={val}
                        onClick={() => setRpe(val)}
                        className={`flex-1 aspect-square rounded-lg text-[10px] font-black transition-all flex items-center justify-center ${rpe === val ? 'bg-[#FF2D2D] text-white scale-110 shadow-lg shadow-[#FF2D2D]/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                        {val}
                    </button>
                ))}
            </div>
            <div className="flex justify-between px-1 text-[8px] font-black uppercase text-white/20 tracking-widest italic">
                <span>Легко</span>
                <span>Предел</span>
            </div>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent backdrop-blur-xl border-t border-white/5 safe-area-pb z-50">
        <div className="max-max-w-[430px] mx-auto">
          <button
            disabled={completedExercises.length < day.exercises.length || !rpe}
            className="w-full bg-[#FF2D2D] text-white h-16 rounded-[24px] font-black uppercase text-sm tracking-widest disabled:opacity-20 shadow-2xl shadow-[#FF2D2D]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Trophy className="w-5 h-5" />
            Завершить день
          </button>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {activeExercise && (
        <div className="fixed inset-0 z-[100] bg-black/95 animate-in fade-in duration-300 flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-lg">
                <button onClick={() => setActiveExercise(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="text-center flex-1 mx-4">
                    <div className="text-[9px] font-black uppercase text-[#FF2D2D] tracking-widest italic">Видео упражнения</div>
                    <div className="text-xs font-black uppercase italic tracking-tight truncate">{activeExercise.title}</div>
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full aspect-video bg-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/10">
                    <iframe
                      src={`https://player.vimeo.com/video/${activeExercise.vimeoVideoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={activeExercise.title}
                    />
                </div>
            </div>

            <div className="p-8 space-y-6 bg-[#1A1A1A] rounded-t-[40px] border-t border-white/10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-black uppercase italic tracking-widest text-[#FF2D2D]">
                        <Info className="w-4 h-4" />
                        Техника выполнения
                    </div>
                    <ul className="space-y-3">
                        {["Подсядьте на 1/4", "Отведите руки назад", "Взрывное выпрыгивание"].map((step, idx) => (
                            <li key={idx} className="flex gap-4 items-center">
                                <span className="text-xs font-black text-white/20 italic">0{idx+1}</span>
                                <span className="text-sm font-medium text-white/80">{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                  onClick={() => {
                    toggleExercise(activeExercise.id);
                    setActiveExercise(null);
                  }}
                  className="w-full bg-[#1DB954] text-white h-14 rounded-2xl font-black uppercase text-xs tracking-widest"
                >
                    Отметить выполнено
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
