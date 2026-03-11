import { getCourses } from "@/lib/courses";
import { CourseCard, CourseCardData } from "@/components/course-card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'jump', label: 'Прыжок' },
  { id: 'speed', label: 'Скорость' },
  { id: 'upper_body', label: 'Верх тела' },
  { id: 'free', label: 'Бесплатные' },
];

const MOCK_COURSES = [
  {
    id: '1',
    slug: 'jump-pro-6-weeks',
    title: 'Прыжок PRO',
    category: 'jump',
    expectedResult: '+8–12 см',
    level: 'intermediate',
    durationWeeks: 6,
    minutesPerDay: '45 мин',
    price: 490000,
    status: 'published',
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'speed-elite',
    title: 'Взрывная скорость',
    category: 'speed',
    expectedResult: '−0.2с на 30м',
    level: 'advanced',
    durationWeeks: 4,
    minutesPerDay: '30 мин',
    price: 350000,
    status: 'published',
  },
  {
    id: '3',
    slug: 'free-warmup',
    title: 'Базовая разминка',
    category: 'free',
    expectedResult: 'Без травм',
    level: 'beginner',
    durationWeeks: 1,
    minutesPerDay: '15 мин',
    price: 0,
    status: 'published',
  }
];

export default async function AthleticsPage() {
  let courses = [];
  try {
    courses = await getCourses();
    if (courses.length === 0) courses = MOCK_COURSES;
  } catch {
    courses = MOCK_COURSES;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-[430px]">
      <header className="flex items-center gap-4 mb-6">
        <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-black uppercase italic tracking-tight">Атлетизм</h1>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full bg-transparent p-0 h-auto gap-2 mb-6 overflow-x-auto no-scrollbar justify-start">
          {CATEGORIES.map(cat => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="px-4 py-2 rounded-full border border-white/10 data-[state=active]:bg-[#FF2D2D] data-[state=active]:border-[#FF2D2D] data-[state=active]:text-white text-xs font-bold transition-all h-9"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="mt-0">
            <div className="grid grid-cols-2 gap-3">
              {(cat.id === 'all' ? courses : courses.filter(c => c.category === cat.id)).map((course) => (
                <CourseCard key={course.id} course={course as unknown as CourseCardData} />
              ))}
              {(cat.id !== 'all' && courses.filter(c => c.category === cat.id).length === 0) && (
                <div className="col-span-2 py-12 text-center text-white/20 font-bold uppercase text-xs italic tracking-widest">
                  Курсов пока нет
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
