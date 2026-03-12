import { prisma } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminCampsPage() {
  const camps = await prisma.camp.findMany({
    orderBy: { startDate: 'asc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Кэмпы</h1>
          <p className="text-white/50 text-sm">Управление спортивными лагерями</p>
        </div>
        <Button className="bg-[#FF2D2D] hover:bg-[#FF2D2D]/90 text-white font-black uppercase text-xs rounded-xl h-10 px-6">
          <Plus className="w-4 h-4 mr-2" />
          Создать кэмп
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Кэмп</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Город</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Даты</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Участники</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white/40 tracking-widest">Статус</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase text-white/40 tracking-widest">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {camps.map((camp) => (
              <TableRow key={camp.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-bold">{camp.title}</TableCell>
                <TableCell className="text-white/60">{camp.city}</TableCell>
                <TableCell className="text-white/60 text-xs">
                  {new Date(camp.startDate).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF2D2D]"
                        style={{ width: `${(camp.currentParticipants / camp.maxParticipants) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold">{camp.currentParticipants}/{camp.maxParticipants}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[9px] font-black uppercase border-white/20">
                    {camp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase hover:bg-[#FF2D2D]/10 hover:text-[#FF2D2D]">
                    Изменить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {camps.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-white/20 font-bold uppercase italic text-xs tracking-widest">
                        Нет созданных кэмпов
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
