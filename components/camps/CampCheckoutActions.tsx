"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import type { Camp } from "@prisma/client";
import { useLayout } from "@/app/contexts/LayoutContext";
import { useRouter } from "next/navigation";

export function CampCheckoutActions({ camp, isPreBooked }: { camp: Camp, isPreBooked: boolean }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
  const [consents, setConsents] = useState({ pdp: false, waiver: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsBottomNavVisible } = useLayout();
  const router = useRouter();

  const now = new Date();
  const isEarlyBirdActive = camp.earlyBirdPrice && camp.earlyBirdCutoff && now < new Date(camp.earlyBirdCutoff);
  const currentPrice = isEarlyBirdActive ? camp.earlyBirdPrice : camp.basePrice;

  useEffect(() => {
    setIsBottomNavVisible(!showCheckout);
  }, [showCheckout, setIsBottomNavVisible]);

  const handleAction = async (apiEndpoint: string, options: RequestInit, successCallback: (data: any) => void) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(apiEndpoint, { ...options, credentials: 'include' });
      
      if (res.ok) {
        const data = await res.json();
        successCallback(data);
      } else {
        if (res.status === 409) {
            const errorData = await res.json();
            if (errorData.code === "PROFILE_INCOMPLETE") {
                // Silently redirect to profile edit page for user to complete their info
                router.push('/profile/edit?reason=incomplete');
                return; // Stop further execution
            }
        }
        let errorMessage = 'Произошла ошибка на сервере.';
        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          console.error("Could not parse error response as JSON:", e);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Неизвестная ошибка";
      console.error(`Action error at ${apiEndpoint}:`, error);
      alert(`Ошибка: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreBook = () => {
    handleAction(
      `/api/camps/${camp.slug}/pre-book`,
      { method: "POST" },
      () => {
        alert("Заявка на предбронь или запись в лист ожидания отправлена!");
        router.push(`/camps/${camp.slug}/waitlist`);
      }
    );
  };

  const handlePay = () => {
    handleAction(
      `/api/camps/${camp.slug}/book`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentType,
          pdpConsent: consents.pdp,
          waiverConsent: consents.waiver,
        }),
      },
      (data) => {
        if (data.confirmationUrl) {
          window.location.href = data.confirmationUrl;
        } else {
          throw new Error("Не удалось получить ссылку на оплату.");
        }
      }
    );
  };

  const isCampFull = camp.currentParticipants >= camp.maxParticipants;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-v-dark/80 backdrop-blur-xl border-t border-zinc-800 z-50">
        <div className={`max-w-[430px] mx-auto flex ${isPreBooked ? 'justify-center' : 'gap-3'}`}>
          {!isPreBooked && (
            <button
              onClick={handlePreBook}
              disabled={isSubmitting}
              className="flex-1 bg-[#1A1A1A] text-white h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
            >
              {isCampFull ? 'В лист ожидания' : 'Предбронь'}
            </button>
          )}
          <button
            onClick={() => setShowCheckout(true)}
            disabled={isSubmitting || (isCampFull && !isPreBooked)}
            className="flex-[1.5] bg-v-accent text-white h-14 rounded-2xl font-bold uppercase text-xs tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            Оплатить
          </button>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg animate-in fade-in duration-300 p-4 flex items-end">
          <div className="w-full max-w-[430px] mx-auto bg-[#0A0A0A] rounded-t-3xl p-6 space-y-6 animate-in slide-in-from-bottom duration-500 border-t border-white/10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold uppercase italic tracking-tighter">Оплата</h2>
              <button onClick={() => setShowCheckout(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-xs font-bold">✕</button>
            </div>
            <div className="space-y-3">
               <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest ml-1">Способ оплаты</span>
                 <div className="space-y-2">
                 <button
                    onClick={() => setPaymentType("full")}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${paymentType === 'full' ? 'border-v-accent' : 'border-zinc-800 bg-white/5'}`}
                 >
                   <span className="text-sm font-bold uppercase italic">Полная оплата</span>
                   <span className="text-lg font-bold italic">{(currentPrice / 100).toLocaleString()} ₽</span>
                 </button>
                 {camp.depositAmount && (
                    <button
                      onClick={() => setPaymentType("deposit")}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${paymentType === 'deposit' ? 'border-v-accent' : 'border-zinc-800 bg-white/5'}`}
                    >
                      <span className="text-sm font-bold uppercase italic">Депозит</span>
                      <span className="text-lg font-bold italic">{(camp.depositAmount / 100).toLocaleString()} ₽</span>
                    </button>
                 )}
                 </div>
            </div>
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consents.pdp} onChange={e => setConsents(c => ({...c, pdp: e.target.checked}))} className="mt-0.5 w-5 h-5 rounded-md border-white/20 bg-white/5 accent-v-accent" />
                <span className="text-[10px] text-white/50 leading-snug font-bold uppercase">Я согласен на обработку персональных данных</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consents.waiver} onChange={e => setConsents(c => ({...c, waiver: e.target.checked}))} className="mt-0.5 w-5 h-5 rounded-md border-white/20 bg-white/5 accent-v-accent" />
                <span className="text-[10px] text-white/50 leading-snug font-bold uppercase">Я принимаю <a href="#" className="underline">условия оферты</a></span>
              </label>
            </div>
            <button
              onClick={handlePay}
              disabled={!consents.pdp || !consents.waiver || isSubmitting}
              className="w-full bg-v-accent h-14 rounded-2xl font-bold uppercase text-sm tracking-widest disabled:opacity-40 transition-all"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Оплатить`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
