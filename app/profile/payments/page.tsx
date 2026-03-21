"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Download, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Payment, Booking, Camp } from '@prisma/client';

type EnrichedPayment = Payment & {
    booking: (Booking & {
        camp: Camp;
    }) | null;
};

type Profile = {
  payments: EnrichedPayment[];
};

export default function PaymentsHistoryPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile", {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Оплачено</Badge>;
      case "canceled":
        return <Badge variant="destructive">Отменено</Badge>;
      case "pending":
        return <Badge variant="secondary">В ожидании</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 border-b border-white/5">
        <Link href="/profile" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-sm font-black uppercase italic tracking-widest">История оплат</h1>
        <div className="w-8 h-8"></div>
      </header>

      <div className="p-4 space-y-4">
        {loading && <div className="text-center text-white/50">Загрузка...</div>}
        {!loading && (!profile || profile.payments.length === 0) && (
            <div className="text-center text-white/50 pt-20">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/20"/>
                <h2 className="font-bold text-lg">История платежей пуста</h2>
                <p className="text-sm text-white/40 mt-2">Здесь будут отображаться все ваши транзакции.</p>
            </div>
        )}
        {!loading && profile && profile.payments.map((payment) => (
          <div key={payment.id} className="glass-card p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-bold text-sm">{payment.booking?.camp.title || 'Оплата курса'}</p>
              <p className="text-xs text-white/50">
                {(payment.amount / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                <span className="mx-2">•</span>
                {new Date(payment.createdAt).toLocaleDateString("ru-RU")}
              </p>
              {getStatusBadge(payment.status)}
            </div>
            {payment.status === 'succeeded' && (
              <a
                href={`/api/payments/${payment.id}/receipt`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
