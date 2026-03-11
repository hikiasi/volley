"use client"

import { Timer, RotateCcw, Play, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Section {
  title: string;
  items: string[];
}

export function WorkoutPlayer({ sections }: { sections: Section[] }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [rpe, setRpe] = useState<number>(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

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
                      onClick={() => setActiveVideo("https://rutube.ru/play/embed/8683515")}
                      className="w-8 h-8 rounded-lg bg-[#FF2D2D]/10 flex items-center justify-center text-[#FF2D2D] active:scale-90 transition-transform"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <div>
                      <div className={`text-xs font-bold mb-0.5 transition-opacity ${completed[id] ? 'opacity-30 line-through' : ''}`}>
                        {item}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-white/30 font-medium">
                        <div className="flex items-center gap-1"><RotateCcw className="w-2.5 h-2.5" /> 3 подхода</div>
                        <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <div className="flex items-center gap-1"><Timer className="w-2.5 h-2.5" /> 60с отдых</div>
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

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
           <div className="w-full max-w-xl aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl">
              <iframe
                src={activeVideo}
                allow="clipboard-write; autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full border-none"
              />
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white text-xl font-bold"
              >
                ×
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
            className={`w-full h-14 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 transition-all ${
              rpe > 0 ? 'bg-[#1DB954] text-white shadow-[0_0_20px_rgba(29,185,84,0.3)]' : 'bg-white/5 text-white/20'
            }`}
           >
             Завершить тренировку
             <CheckCircle2 className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
}
