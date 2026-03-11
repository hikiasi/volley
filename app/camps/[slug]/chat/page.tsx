import { ChevronLeft, Info, Send, Camera, MapPin, List, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChatPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex flex-col items-center justify-center border-b border-white/5 relative bg-[#0A0A0A]/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="flex items-center w-full justify-between">
           <Link href={`/camps/${params.slug}/location`} className="p-2 -ml-2">
             <ChevronLeft className="w-6 h-6" />
           </Link>
           <div className="text-center">
             <h1 className="text-sm font-bold uppercase">Чат участников</h1>
             <p className="text-[10px] text-white/40 uppercase font-bold">— Москва 12–14 окт</p>
           </div>
           <button className="p-2">
             <Info className="w-6 h-6" />
           </button>
        </div>

        <div className="mt-4 bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 rounded-full px-4 py-1.5 flex items-center gap-2 active:scale-95 transition-transform cursor-pointer">
           <span className="text-[10px] font-black uppercase text-[#FF2D2D]">Событие через 2 дня</span>
           <ChevronLeft className="w-3 h-3 rotate-180 text-[#FF2D2D]" />
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Memo Toast */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF2D2D] flex items-center justify-center">
                 <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-black uppercase tracking-tight">Памятка кэмпа</span>
           </div>
           <div className="flex gap-2">
              <Button variant="ghost" className="flex-1 h-10 bg-white/5 rounded-xl text-[10px] font-bold uppercase border border-white/5">Адрес</Button>
              <Button variant="ghost" className="flex-1 h-10 bg-white/5 rounded-xl text-[10px] font-bold uppercase border border-white/5">Регламент</Button>
              <Button variant="ghost" className="w-10 h-10 bg-white/5 rounded-xl p-0 border border-white/5"><List className="w-4 h-4" /></Button>
              <Button variant="ghost" className="flex-1 h-10 bg-white/5 rounded-xl text-[10px] font-bold uppercase border border-white/5">Фотоархив</Button>
           </div>
        </section>

        {/* Messages */}
        <div className="space-y-6">
           {/* Incoming Message */}
           <div className="flex gap-3 items-end">
              <Avatar className="w-10 h-10">
                 <AvatarImage src="https://github.com/shadcn.png" />
                 <AvatarFallback>А</AvatarFallback>
              </Avatar>
              <div className="max-w-[70%] space-y-1">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#10B981]">Алексей</span>
                    <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-[#10B981] text-[#10B981]">Shoshin</Badge>
                    <div className="flex gap-1">
                       <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                       <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                    </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-none">
                    <p className="text-sm">Доброе утро всем!</p>
                 </div>
                 <p className="text-[10px] text-white/20 text-right">09:32</p>
              </div>
           </div>

           {/* System / Instructor Message */}
           <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full border border-[#FF2D2D] flex items-center justify-center shrink-0">
                 <div className="w-6 h-6 rounded-full border border-[#FF2D2D]/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D2D]" />
                 </div>
              </div>
              <div className="flex-1 space-y-1">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#FF2D2D]">Инструктор Никита Н.</span>
                 </div>
                 <div className="bg-white/5 border border-[#FF2D2D]/30 p-3 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                       <MapPin className="w-3.5 h-3.5 text-[#FF2D2D]" />
                       <span className="text-xs font-bold">Олткет Power Jump</span>
                       <Badge className="bg-[#FF2D2D] text-[8px] h-4">HOT</Badge>
                    </div>
                    <p className="text-sm">Склитищеро. 14 окт.</p>
                    <div className="flex justify-between items-end mt-2">
                       <span className="text-[10px] text-white/30 italic font-medium">08:32</span>
                       <span className="text-[10px] text-white/30 italic font-medium">09:32</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Another Incoming Message */}
           <div className="flex gap-3 items-end">
              <Avatar className="w-10 h-10">
                 <AvatarImage src="https://github.com/shadcn.png" />
                 <AvatarFallback>И</AvatarFallback>
              </Avatar>
              <div className="max-w-[70%] space-y-1">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#FFA500]">Илы А.</span>
                    <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-[#FFA500] text-[#FFA500]">Shugyosha</Badge>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-none">
                    <p className="text-sm">Во сколько завтра стартуем?</p>
                 </div>
                 <p className="text-[10px] text-white/20 text-right">13:57</p>
              </div>
           </div>

           {/* Video Message Preview */}
           <div className="flex gap-3 items-end">
              <Avatar className="w-10 h-10">
                 <AvatarImage src="https://github.com/shadcn.png" />
                 <AvatarFallback>Е</AvatarFallback>
              </Avatar>
              <div className="max-w-[70%] space-y-1">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#10B981]">Екетерина Т.</span>
                    <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-[#10B981] text-[#10B981]">Jukuren</Badge>
                    <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                 </div>
                 <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 group">
                    <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=400" className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 group-active:scale-90 transition-transform">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                       </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold">0::07</div>
                 </div>
                 <p className="text-[10px] text-white/20 text-right">15:15</p>
              </div>
           </div>
        </div>
      </div>

      {/* Input Area */}
      <footer className="p-4 bg-[#0A0A0A] border-t border-white/5 safe-area-pb">
        <div className="flex items-center gap-2 mb-3 px-2">
           <Send className="w-4 h-4 text-white/20 rotate-45" />
           <p className="text-[10px] font-bold uppercase text-white/20">Соибетие</p>
           <div className="flex-1" />
           <p className="text-[10px] font-bold uppercase text-white/40">Записаться на трансфер</p>
        </div>
        <div className="flex gap-3">
           <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-white/40" />
           </div>
           <div className="flex-1 relative">
              <Input
                placeholder="Сообщение..."
                className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 pr-14 placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-white/30"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FF2D2D] flex items-center justify-center active:scale-90 transition-transform">
                 <Send className="w-4 h-4 text-white -mr-0.5" />
              </button>
           </div>
        </div>
      </footer>
    </div>
  );
}
