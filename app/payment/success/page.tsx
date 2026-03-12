"use client";

import { useEffect } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-[#1DB954]/20 flex items-center justify-center border border-[#1DB954]/30">
                <CheckCircle2 className="w-12 h-12 text-[#1DB954]" />
            </div>
            <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-black" />
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Оплата прошла!</h1>
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                Ты в деле. Твой кэмп и программы тренировок уже доступны в личном кабинете.
            </p>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/30 tracking-widest">
                <span>Статус</span>
                <span className="text-[#1DB954]">Подтверждено</span>
            </div>
            <div className="flex justify-between items-center text-xs font-black uppercase italic">
                <span>Квитанция</span>
                <span className="text-white/60">Отправлена в Telegram</span>
            </div>
        </div>

        <div className="space-y-3">
            <Link
                href="/profile"
                className="w-full bg-white text-black h-16 rounded-[24px] font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl shadow-white/10"
            >
                В личный кабинет
                <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
                href="/"
                className="w-full bg-transparent text-white/40 h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center active:opacity-60 transition-all"
            >
                На главную
            </Link>
        </div>
      </div>
    </div>
  );
}
