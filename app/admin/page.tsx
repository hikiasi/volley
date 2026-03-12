import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Tent, GraduationCap } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Dashboard</h1>
        <p className="text-white/50 text-sm">Обзор основных показателей платформы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase text-white/40 tracking-widest">Выручка</CardTitle>
            <TrendingUp className="w-4 h-4 text-[#FF2D2D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">1 240 500 ₽</div>
            <p className="text-[10px] text-green-500 font-bold mt-1">+12% за 30 дней</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase text-white/40 tracking-widest">Пользователи</CardTitle>
            <Users className="w-4 h-4 text-[#FF2D2D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">12 540</div>
            <p className="text-[10px] text-white/40 font-bold mt-1">Активных TMA пользователей</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase text-white/40 tracking-widest">Кэмпы</CardTitle>
            <Tent className="w-4 h-4 text-[#FF2D2D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">8</div>
            <p className="text-[10px] text-white/40 font-bold mt-1">Запланировано на этот год</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase text-white/40 tracking-widest">Курсы</CardTitle>
            <GraduationCap className="w-4 h-4 text-[#FF2D2D]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">14</div>
            <p className="text-[10px] text-white/40 font-bold mt-1">Активных программ тренировок</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase mb-4 tracking-widest">Последние платежи</h3>
              <div className="space-y-4">
                  {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10" />
                              <div>
                                  <div className="text-xs font-bold">Иван Иванов</div>
                                  <div className="text-[10px] text-white/40">Кэмп Москва · 12 окт</div>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="text-xs font-black">34 800 ₽</div>
                              <div className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Успешно</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase mb-4 tracking-widest">Очередь проверки видео</h3>
              <div className="space-y-4">
                  {[1,2,3].map(i => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/10 overflow-hidden" />
                              <div>
                                  <div className="text-xs font-bold">Петр Петров</div>
                                  <div className="text-[10px] text-white/40">Прыжок PRO · Неделя 2 · День 4</div>
                              </div>
                          </div>
                          <button className="text-[10px] font-black uppercase text-[#FF2D2D] hover:underline">Проверить</button>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
