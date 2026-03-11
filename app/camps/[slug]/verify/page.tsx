import { ChevronLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VerificationPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 flex flex-col items-center">
      <header className="w-full flex items-center justify-between mb-8">
        <Link href={`/camps/${params.slug}`} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-sm font-bold uppercase">Верификация контакта</h1>
        <div className="w-6" />
      </header>

      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full border-2 border-[#FF2D2D] flex items-center justify-center">
             <div className="w-16 h-16 rounded-full border border-[#FF2D2D]/30 flex items-center justify-center">
                <span className="text-3xl font-black text-[#FF2D2D]">C</span>
             </div>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter">VOLLEYDZEN</h2>
        </div>

        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="w-full bg-white/5 h-12 p-1 rounded-xl border border-white/5">
            <TabsTrigger value="phone" className="flex-1 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">Телефон</TabsTrigger>
            <TabsTrigger value="email" className="flex-1 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">Email</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Success Alert */}
        <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          <span className="text-xs font-bold text-[#10B981]">Код подтверждён — успешно</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-white/50">1. Введите код из SMS</label>
            <p className="text-xs text-white/70 font-medium">+7 ••••</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Input
                  key={i}
                  className="w-full h-14 bg-white/5 border-white/10 rounded-xl text-center text-lg font-black focus:border-[#FF2D2D] transition-colors"
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-[#10B981] font-bold">Отправлено на SMS. Повторная отправка через 00:45</p>
            <button className="text-[10px] font-bold uppercase text-white/30 text-left hover:text-white transition-colors">
              Выслать код ещё раз
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button className="w-full h-14 bg-[#FF2D2D] hover:bg-[#D72626] text-white font-black uppercase rounded-2xl">
            Подтвердить
          </Button>

          {/* Error Alert */}
          <div className="bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#FF2D2D]" />
            <span className="text-xs font-bold text-[#FF2D2D]">Неверный код. Осталось 2 попытки</span>
          </div>
        </div>

        <footer className="pt-8 space-y-6">
           <div className="flex justify-between text-[10px] font-bold uppercase text-white/40">
              <button>Использовать email</button>
              <button>Связаться с поддержкой</button>
           </div>
           <button className="w-full text-[10px] font-bold uppercase text-white/20">
             Политика конфиденциальности
           </button>
        </footer>
      </div>
    </div>
  );
}
