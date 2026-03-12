import { TrendingUp, Users, Tent, GraduationCap, ArrowUpRight, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 bg-[#FF2D2D] rounded-full" />
                <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Dashboard</h1>
            </div>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest ml-5">Обзор основных показателей платформы</p>
        </div>
        <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4">
            <Activity className="w-5 h-5 text-[#FF2D2D]" />
            <div className="text-[10px] font-black uppercase tracking-widest text-white/50">System Status: <span className="text-green-500">Online</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
            { title: "Выручка", value: "1 240 500 ₽", trend: "+12%", icon: TrendingUp, detail: "за 30 дней" },
            { title: "Пользователи", value: "12 540", trend: "+5.2%", icon: Users, detail: "Активных TMA" },
            { title: "Кэмпы", value: "8", trend: "Full", icon: Tent, detail: "в этом году" },
            { title: "Курсы", value: "14", trend: "New", icon: GraduationCap, detail: "программ" },
        ].map((stat, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-8 space-y-4 hover:border-[#FF2D2D]/30 transition-all group">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#FF2D2D]/10 transition-colors">
                        <stat.icon className="w-6 h-6 text-[#FF2D2D]" />
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">{stat.title}</div>
                        <div className="text-[10px] font-black text-green-500 uppercase italic tracking-tighter">{stat.trend}</div>
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-black italic tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase mt-1">{stat.detail}</div>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Последние платежи</h3>
                <button className="text-[10px] font-black uppercase text-[#FF2D2D] hover:underline flex items-center gap-2">Все транзакции <ArrowUpRight className="w-3 h-3" /></button>
              </div>
              <div className="space-y-6">
                  {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center text-xl">👤</div>
                              <div>
                                  <div className="text-sm font-black uppercase italic">Иван Иванов</div>
                                  <div className="text-[11px] text-white/40 font-bold uppercase">Кэмп Москва · 12-14 окт</div>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="text-base font-black italic">34 800 ₽</div>
                              <div className="text-[9px] text-[#1DB954] font-black uppercase tracking-widest">Успешно</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Проверка видео</h3>
                <button className="text-[10px] font-black uppercase text-[#FF2D2D] hover:underline flex items-center gap-2">Открыть очередь <ArrowUpRight className="w-3 h-3" /></button>
              </div>
              <div className="space-y-6">
                  {[1,2,3,4].map(i => (
                      <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                              <div className="w-14 h-10 rounded-xl bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center text-lg">🎬</div>
                              <div>
                                  <div className="text-sm font-black uppercase italic">Петр Петров</div>
                                  <div className="text-[11px] text-white/40 font-bold uppercase">Прыжок PRO · День 14</div>
                              </div>
                          </div>
                          <button className="bg-[#FF2D2D] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-[#FF2D2D]/20">
                            Проверить
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
