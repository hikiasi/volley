import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Course } from "@prisma/client";

export type CourseCardData = Partial<Course> & { id: string; slug: string; title: string; category: string; expectedResult?: string | null; price: number; durationWeeks: number; minutesPerDay?: string | null };

interface CourseCardProps {
  course: CourseCardData;
  isPurchased?: boolean;
}

export function CourseCard({ course, isPurchased = false }: CourseCardProps) {
  return (
    <Card className="glass-card overflow-hidden active:scale-[0.98] transition-transform flex flex-col h-full">
      <div className="relative aspect-video bg-white/5">
        {course.coverImageUrl ? (
          <img
            src={course.coverImageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/5 text-4xl font-black italic uppercase">
            {course.category}
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className="bg-white/10 backdrop-blur-md text-[8px] font-black uppercase border-none">
            {course.category}
          </Badge>
          {course.isFeatured && (
            <Badge className="bg-[#FF2D2D] text-[8px] font-black uppercase border-none">
              NEW
            </Badge>
          )}
        </div>
        {course.expectedResult && (
          <div className="absolute bottom-2 left-2">
             <div className="text-[10px] font-black text-[#1DB954] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
               {course.expectedResult}
             </div>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-[13px] leading-tight mb-1 line-clamp-1">{course.title}</h3>
        <div className="text-[10px] text-white/40 mb-3 flex items-center gap-2 font-medium">
          <span>{course.durationWeeks} недель</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
          <span>{course.minutesPerDay}</span>
        </div>

        <div className="mt-auto flex gap-2">
          {isPurchased ? (
            <Link
              href={`/athletics/${course.slug}`}
              className="flex-1 bg-white text-black h-8 rounded-lg font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              Продолжить
            </Link>
          ) : (
            <>
              <Link
                href={`/athletics/${course.slug}?trial=true`}
                className="flex-1 bg-white/5 border border-white/10 text-white h-8 rounded-lg font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                Пробный
              </Link>
              <Link
                href={`/athletics/${course.slug}`}
                className="w-8 h-8 bg-[#FF2D2D] rounded-lg flex items-center justify-center active:scale-95 transition-transform shrink-0"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
