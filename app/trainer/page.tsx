import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Video, Clock } from "lucide-react";

export default function TrainerPage() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#FF2D2D]" />
              </div>
              <div>
                  <div className="text-xl font-black uppercase italic tracking-tighter">Мои ученики</div>
                  <div className="text-[10px] text-white/50 uppercase font-bold">12 активных атлетов</div>
              </div>
          </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/5 border-white/10 text-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Video className="w-5 h-5 text-[#FF2D2D] mb-2" />
                  <div className="text-2xl font-black">3</div>
                  <div className="text-[9px] font-black uppercase text-white/40 tracking-widest mt-1">Новых видео</div>
              </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-white">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="w-5 h-5 text-[#FF2D2D] mb-2" />
                  <div className="text-2xl font-black">1.5ч</div>
                  <div className="text-[9px] font-black uppercase text-white/40 tracking-widest mt-1">Среднее время ответа</div>
              </CardContent>
          </Card>
      </div>

      {/* Student List */}
      <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase text-[#FF2D2D] tracking-widest ml-1">Активность</h3>
          {[
              { name: "Иван К.", course: "Прыжок PRO", progress: 45, status: "video_sent", time: "2ч назад" },
              { name: "Мария С.", course: "Взрывная скорость", progress: 12, status: "resting", time: "1д назад" },
              { name: "Александр Б.", course: "Верх тела", progress: 88, status: "completed", time: "3ч назад" },
          ].map((student, i) => (
              <div key={i} className="glass-card p-4 flex items-center justify-between border-white/5">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                          {student.name.split(' ')[0][0]}
                      </div>
                      <div>
                          <div className="text-sm font-bold">{student.name}</div>
                          <div className="text-[10px] text-white/50">{student.course} · {student.progress}%</div>
                      </div>
                  </div>
                  <div className="text-right">
                      {student.status === 'video_sent' ? (
                          <Badge className="bg-[#FF2D2D] text-[8px] font-black uppercase px-2 py-0.5 animate-pulse">
                              Новое видео
                          </Badge>
                      ) : (
                          <div className="text-[9px] text-white/30 font-bold uppercase">{student.time}</div>
                      )}
                  </div>
              </div>
          ))}
      </div>

      <button className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-[0.98] transition-all">
          Посмотреть всех учеников
      </button>
    </div>
  );
}
