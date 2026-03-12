"use client"

import { Timer, RotateCcw, Play, CheckCircle2, Info, AlertTriangle, ShieldCheck, Video, Send } from "lucide-react";
import { useState } from "react";
import { VimeoPlayer } from "@/components/tma/VimeoPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExerciseItem {
  id: string;
  title: string;
  videoUrl?: string;
  sets?: number;
  reps?: number;
  duration?: number;
  rest?: number;
  technique?: string;
}

interface Section {
  title: string;
  items: ExerciseItem[];
}

export function WorkoutPlayer({ sections }: { sections: Section[] }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [rpe, setRpe] = useState<number>(0);
  const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);
  const [showFinish, setShowFinish] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const toggleExercise = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4 space-y-6">
      {sections.map((section, idx) => (
        <section key={idx} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black tracking-widest text-white/40 uppercase">{section.title}</h2>
          </div>
          <div className="space-y-2">
            {section.items.map((item, j) => {
              const id = `${idx}-${j}`;
              return (
                <div key={j} className="glass-card p-3 flex items-center justify-between group transition-colors">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => item.videoUrl && setActiveExercise(item)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-transform ${
                        item.videoUrl ? 'bg-[#FF2D2D]/10 text-[#FF2D2D]' : 'bg-white/5 text-white/20 opacity-50'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <div onClick={() => item.videoUrl && setActiveExercise(item)} className="cursor-pointer">
                      <div className={`text-xs font-bold mb-0.5 transition-opacity ${completed[id] ? 'opacity-30 line-through' : ''}`}>
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-white/30 font-medium">
                        {item.sets && (
                          <div className="flex items-center gap-1"><RotateCcw className="w-2.5 h-2.5" /> {item.sets} подходов</div>
                        )}
                        {item.reps && (
                          <>
                            <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                            <div className="flex items-center gap-1">× {item.reps}</div>
                          </>
                        )}
                        {item.duration && (
                          <>
                            <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                            <div className="flex items-center gap-1"><Timer className="w-2.5 h-2.5" /> {item.duration}с</div>
                          </>
                        )}
                        {item.rest && (
                          <>
                            <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                            <div className="flex items-center gap-1"><Timer className="w-2.5 h-2.5" /> {item.rest}с отдых</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExercise(id)}
                    className={`w-6 h-6 rounded-md border transition-all flex items-center justify-center ${
                      completed[id] ? 'bg-[#1DB954] border-[#1DB954]' : 'border-white/10'
                    }`}
                  >
                    {completed[id] && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Video Modal - Sections 8.10 */}
      {activeExercise && activeExercise.videoUrl && (
        <div className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col animate-in slide-in-from-bottom duration-300">
           <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#FF2D2D]" />
                <h3 className="text-xs font-black uppercase italic tracking-tighter">{activeExercise.title}</h3>
              </div>
              <button
                onClick={() => setActiveExercise(null)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-xs font-bold uppercase"
              >
                Закрыть
              </button>
           </div>

           <div className="p-4 bg-black">
              <VimeoPlayer
                videoId={activeExercise.videoUrl.split('/').pop() || ""}
              />
           </div>

           <div className="flex-1 overflow-y-auto px-4 py-6">
              <Tabs defaultValue="technique" className="w-full">
                <TabsList className="w-full bg-white/5 border border-white/5 rounded-xl h-12 p-1 mb-6">
                  <TabsTrigger value="technique" className="flex-1 rounded-lg text-[10px] font-black uppercase flex gap-2">
                    <Info className="w-3 h-3" /> Техника
                  </TabsTrigger>
                  <TabsTrigger value="mistakes" className="flex-1 rounded-lg text-[10px] font-black uppercase flex gap-2">
                    <AlertTriangle className="w-3 h-3" /> Ошибки
                  </TabsTrigger>
                  <TabsTrigger value="safety" className="flex-1 rounded-lg text-[10px] font-black uppercase flex gap-2">
                    <ShieldCheck className="w-3 h-3" /> Безопасность
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="technique" className="mt-0 space-y-4 animate-in fade-in duration-300">
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Шаги выполнения</div>
                      {[1,2,3].map(i => (
                        <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                           <span className="text-xl font-black italic text-[#FF2D2D] opacity-40">0{i}</span>
                           <p className="text-xs text-white/70 font-medium leading-relaxed">Инструкция по выполнению шага {i} для упражнения {activeExercise.title}. Держите спину прямо.</p>
                        </div>
                      ))}
                   </div>
                </TabsContent>
                {/* Other content follows similar pattern */}
              </Tabs>
           </div>

           <div className="p-4 pb-10 bg-gradient-to-t from-black to-transparent">
              <button
                onClick={() => {
                  toggleExercise(activeExercise.id);
                  setActiveExercise(null);
                }}
                className="w-full h-14 bg-[#1DB954] text-white rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2"
              >
                Отметить выполнено
                <CheckCircle2 className="w-5 h-5" />
              </button>
           </div>
        </div>
      )}

      {/* RPE & Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent pt-10 border-t border-white/5">
        <div className="max-w-[430px] mx-auto space-y-4">
           <div className="space-y-2">
             <div className="flex justify-between items-center px-1">
               <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Нагрузка (RPE)</span>
               <span className="text-xs font-black text-[#FF2D2D]">{rpe > 0 ? `${rpe} / 10` : 'Выбери сложность'}</span>
             </div>
             <div className="flex justify-between gap-1">
               {[1,2,3,4,5,6,7,8,9,10].map(n => (
                 <button
                  key={n}
                  onClick={() => setRpe(n)}
                  className={`flex-1 h-8 rounded-md text-[10px] font-black transition-all ${
                    rpe === n ? 'bg-[#FF2D2D] text-white scale-110 shadow-lg' : 'bg-white/5 text-white/30'
                  }`}
                 >
                   {n}
                 </button>
               ))}
             </div>
           </div>

           <button
            disabled={rpe === 0}
            onClick={() => setShowFinish(true)}
            className={`w-full h-14 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 transition-all ${
              rpe > 0 ? 'bg-[#1DB954] text-white shadow-[0_0_20px_rgba(29,185,84,0.3)]' : 'bg-white/5 text-white/20'
            }`}
           >
             Завершить тренировку
             <CheckCircle2 className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Finish Session Modal - Section 2.4 / 8.9 */}
      {showFinish && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 p-4 flex items-center">
           <div className="w-full max-w-[430px] mx-auto glass-card p-6 space-y-6">
              <div className="text-center space-y-2">
                 <div className="w-16 h-16 rounded-full bg-[#1DB954]/20 flex items-center justify-center mx-auto mb-4 border border-[#1DB954]/30">
                    <ShieldCheck className="w-8 h-8 text-[#1DB954]" />
                 </div>
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter">Тренировка окончена!</h2>
                 <p className="text-xs text-white/50 font-medium">Отличная работа. Твой RPE: <span className="text-[#FF2D2D] font-black">{rpe}</span></p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30 tracking-widest px-1">
                       <Video className="w-3 h-3" /> Отправить видео тренеру
                    </div>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="Ссылка на видео (Telegram/Drive)"
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-medium focus:outline-none focus:border-[#FF2D2D]/50 transition-colors"
                      />
                    </div>
                    <p className="text-[9px] text-white/30 italic px-1 leading-tight">Куратор проверит технику и даст обратную связь в течение 24 часов.</p>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button
                  onClick={() => setShowFinish(false)}
                  className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase"
                 >
                   Назад
                 </button>
                 <button
                  className="flex-[2] h-14 bg-[#FF2D2D] text-white rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,45,45,0.3)]"
                 >
                   {videoUrl ? 'Отправить и выйти' : 'Просто выйти'}
                   <Send className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
