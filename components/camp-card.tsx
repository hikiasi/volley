import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Camp } from "@prisma/client";

interface CampCardProps {
  camp: Partial<Camp> & { id: string; slug: string; title: string; city: string; level: string; startDate: Date; basePrice: number; maxParticipants: number; currentParticipants: number };
}

export function CampCard({ camp }: CampCardProps) {
  const fillPercentage = Math.round((camp.currentParticipants / camp.maxParticipants) * 100);
  const remainingSlots = camp.maxParticipants - camp.currentParticipants;

  return (
    <Link href={`/camps/${camp.slug}`}>
      <Card className="glass-card overflow-hidden active:scale-[0.98] transition-transform">
        <div className="relative aspect-[16/9] bg-white/5">
          {camp.coverImageUrl ? (
            <img
              src={camp.coverImageUrl}
              alt={camp.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10">
              <CalendarDays className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-[#FF2D2D] text-[10px] font-black uppercase">
              {camp.level}
            </Badge>
          </div>
          {camp.hotMessage && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="text-[10px] font-bold text-white leading-tight">
                {camp.hotMessage}
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-base leading-tight flex-1">{camp.title}</h3>
            <div className="text-right">
              <div className="text-xs font-black text-[#FF2D2D]">
                {(camp.basePrice / 100).toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/50 text-[11px] mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {camp.city}
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {format(new Date(camp.startDate), 'd MMMM', { locale: ru })}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-white/40">
              <span>Заполнено {fillPercentage}%</span>
              <span className={remainingSlots <= 5 ? "text-[#FF2D2D]" : ""}>
                Осталось {remainingSlots} мест
              </span>
            </div>
            <Progress value={fillPercentage} className="flex-col gap-0 h-auto">
              <ProgressTrack className="h-1.5 bg-white/5">
                <ProgressIndicator className="bg-[#FF2D2D]" />
              </ProgressTrack>
            </Progress>
          </div>
        </div>
      </Card>
    </Link>
  );
}
