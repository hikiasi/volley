import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Курсы</h1>
          <p className="text-white/50 text-sm">Управление программами тренировок</p>
        </div>
        <Button className="bg-[#FF2D2D] hover:bg-[#FF2D2D]/90 text-white font-black uppercase text-xs rounded-xl h-10 px-6">
          <Plus className="w-4 h-4 mr-2" />
          Добавить курс
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Курс</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Категория</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Длительность</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Цена</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Статус</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase text-white/40 tracking-widest">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white/20" />
                        </div>
                        <span className="font-bold">{course.title}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="text-[9px] font-black uppercase border-[#FF2D2D]/30 text-[#FF2D2D]">
                        {course.category}
                    </Badge>
                </TableCell>
                <TableCell className="text-white/60 text-xs">{course.durationWeeks} недель</TableCell>
                <TableCell className="font-bold">{(course.price / 100).toLocaleString('ru-RU')} ₽</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[9px] font-black uppercase border-white/20">
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase hover:bg-[#FF2D2D]/10 hover:text-[#FF2D2D]">
                    Редактор
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-white/20 font-bold uppercase italic text-xs tracking-widest">
                        Библиотека курсов пуста
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
