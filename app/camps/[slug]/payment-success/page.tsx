import { CheckCircle2, Calendar, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center pt-12 space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full border-2 border-[#FF2D2D] flex items-center justify-center">
             <div className="w-20 h-20 rounded-full border border-[#FF2D2D]/30 flex items-center justify-center">
                <span className="text-4xl font-black text-[#FF2D2D]">C</span>
             </div>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">VOLLEYDZEN</h2>
        </div>

        {/* Success Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3">
             <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
             <h1 className="text-3xl font-black uppercase leading-tight">Оплата прошла успешно</h1>
          </div>
        </div>

        {/* Receipt Card */}
        <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-sm font-black uppercase">Москва · 12–14 окт <span className="text-white/30 ml-2">3 дня</span></span>
              <span className="text-xs font-bold text-white/50">29 900 ₽</span>
           </div>
           <div className="flex justify-between items-center text-[10px] font-bold uppercase text-white/30">
              <span>Заказ #45691</span>
              <span>Telegram Pay</span>
           </div>
           <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs font-black uppercase text-white/40">Оплачено</span>
              <span className="text-xl font-black">29 900 ₽</span>
           </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-4 gap-3 w-full">
           {[
             { icon: Calendar, label: 'В календарь в профиль', color: 'bg-[#FF2D2D]/10 text-[#FF2D2D]', status: 'inactive' },
             { icon: CheckCircle2, label: 'Чат участников', color: 'bg-[#10B981]/10 text-[#10B981]', status: 'active' },
             { icon: BookOpen, label: 'Памятка', color: 'bg-white/5 text-white/40', status: 'inactive' },
             { icon: FileText, label: 'Квитанция PDF', color: 'bg-white/5 text-white/40', status: 'inactive' },
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 ${item.color}`}>
                   <item.icon className="w-6 h-6" />
                </div>
                <span className={`text-[8px] font-bold uppercase text-center leading-tight ${item.status === 'active' ? 'text-[#10B981]' : 'text-white/30'}`}>
                  {item.label}
                </span>
             </div>
           ))}
        </div>

        {/* Info Items */}
        <div className="w-full space-y-3">
           <div className="flex items-center gap-3 px-2">
              <div className="w-5 h-5 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-white/40" />
              </div>
              <span className="text-[10px] font-bold uppercase text-white/40">Добавлен в профиль</span>
           </div>
           <div className="flex items-start gap-3 px-2">
              <FileText className="w-5 h-5 text-white/20 shrink-0" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase text-white/40">Письмо с чеком отправлено на email</span>
                 <span className="text-[10px] font-bold text-white/60">example@com</span>
              </div>
           </div>
        </div>

        {/* Next Steps Checklist */}
        <section className="w-full space-y-4 pt-4 text-left">
           <h3 className="text-sm font-black uppercase tracking-widest px-2">Что дальше?</h3>
           <div className="space-y-3">
              {[
                { label: 'Добавь в календарь', checked: false },
                { label: 'Вступи в чат', checked: false },
                { label: 'Памятка', checked: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-5 h-5 border-2 border-white/10 rounded flex items-center justify-center" />
                   <span className="text-xs font-bold uppercase text-white/60">{item.label}</span>
                </div>
              ))}
           </div>
        </section>

        <Button className="w-full h-14 bg-[#FF2D2D] hover:bg-[#D72626] text-white font-black uppercase rounded-2xl mt-4">
           Посмотреть программу кампа
        </Button>
      </div>
    </div>
  );
}
