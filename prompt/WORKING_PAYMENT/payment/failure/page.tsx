"use client";

import { useEffect } from "react";
import { XCircle, RefreshCcw, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] text-center space-y-8 animate-in slide-in-from-bottom duration-500">
        <div className="w-24 h-24 rounded-full bg-[#FF2D2D]/20 flex items-center justify-center border border-[#FF2D2D]/30 mx-auto">
            <XCircle className="w-12 h-12 text-[#FF2D2D]" />
        </div>

        <div className="space-y-3">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Ошибка оплаты</h1>
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                Транзакция была отклонена банком или отменена. Попробуйте еще раз или используйте другой метод.
            </p>
        </div>

        <div className="space-y-3">
            <button
                onClick={() => window.history.back()}
                className="w-full bg-[#FF2D2D] text-white h-16 rounded-[24px] font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl shadow-[#FF2D2D]/20"
            >
                Повторить попытку
                <RefreshCcw className="w-5 h-5" />
            </button>
            <a
                href="https://t.me/volleydzen_support"
                target="_blank"
                className="w-full bg-white/5 border border-white/5 text-white/60 h-16 rounded-[24px] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:bg-white/10 transition-all"
            >
                <MessageCircle className="w-5 h-5" />
                Написать в поддержку
            </a>
        </div>

        <Link
            href="/"
            className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic hover:text-white transition-colors"
        >
            Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
