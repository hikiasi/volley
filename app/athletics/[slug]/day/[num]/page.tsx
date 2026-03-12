import { getCourseBySlug } from "@/lib/courses";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { WorkoutPlayer } from "@/components/workout-player";

export default async function WorkoutDayPage({ params }: { params: { slug: string, num: string } }) {
  const course = await getCourseBySlug(params.slug);

  const dayNum = parseInt(params.num as string) || 1;

  // Find the current day and its exercises from DB
  const currentWeek = course?.weeks.find(w => w.days.some(d => d.dayNumber === dayNum));
  const currentDay = currentWeek?.days.find(d => d.dayNumber === dayNum);

  type ExerciseItem = { id: string; title: string; videoUrl?: string; sets?: number; reps?: number; duration?: number; rest?: number; };
  type Section = { title: string; items: ExerciseItem[]; };

  let sections: Section[] = [
    {
      title: "РАЗМИНКА",
      items: [
        { id: "1", title: "МФР стопы", sets: 1, duration: 60, videoUrl: "https://rutube.ru/play/embed/8683515" },
        { id: "2", title: "Мобильность голеностопа", sets: 2, reps: 10 }
      ]
    },
    {
      title: "ОСНОВНОЙ БЛОК",
      items: [
        { id: "3", title: "Приседания со штангой", sets: 3, reps: 6, rest: 90, videoUrl: "https://rutube.ru/play/embed/8683515" }
      ]
    },
  ];

  if (currentDay && currentDay.exercises.length > 0) {
    const dbSections: Record<string, ExerciseItem[]> = {
      'warmup': [],
      'main': [],
      'plyometric': [],
      'cooldown': []
    };

    currentDay.exercises.forEach(de => {
      const section = de.section || 'main';
      if (dbSections[section]) {
        dbSections[section].push({
          id: de.id,
          title: de.exercise.title,
          videoUrl: de.exercise.vimeoVideoId ? `https://rutube.ru/play/embed/${de.exercise.vimeoVideoId}` : undefined,
          sets: de.sets || undefined,
          reps: de.reps || undefined,
          duration: de.durationSecs || undefined,
          rest: de.restSecs || undefined,
        });
      }
    });

    sections = [
      { title: "РАЗМИНКА", items: dbSections.warmup },
      { title: "ОСНОВНОЙ БЛОК", items: dbSections.main },
      { title: "ПЛИОМЕТРИКА", items: dbSections.plyometric },
      { title: "ЗАМИНКА", items: dbSections.cooldown },
    ].filter(s => s.items.length > 0);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-40">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href={`/athletics/${params.slug}`} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-[11px] font-black uppercase text-white/40 leading-none mb-1 line-clamp-1">{course?.title || "Тренировка"}</h1>
            <div className="text-xs font-bold text-white leading-none">День {dayNum} · База</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <div className="text-[10px] font-black text-[#FF2D2D] mb-1">04:12</div>
           <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-[#FF2D2D]" />
           </div>
        </div>
      </header>

      <WorkoutPlayer sections={sections} />
    </div>
  );
}
