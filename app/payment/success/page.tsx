"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, XCircle, Loader2, Calendar, Users, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import type { Booking, Camp } from '@prisma/client';

const FAILURE_TITLE = "Что-то пошло не так";
const FAILURE_MESSAGE = "Не удалось подтвердить ваш платеж. Если средства были списаны, свяжитесь с нами.";
const PROCESSING_TITLE = "Обрабатываем платеж...";
const PROCESSING_MESSAGE = "Это может занять до 30 секунд. Пожалуйста, не закрывайте страницу.";

type EnrichedBooking = Booking & { camp: Camp };

function PaymentStatusChecker() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const [status, setStatus] = useState<'processing' | 'success' | 'failure'>('processing');
  const [booking, setBooking] = useState<EnrichedBooking | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setStatus('failure');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.status === 'succeeded' && data.booking) {
            setBooking(data.booking);
            setPaymentId(data.paymentId);
            setStatus('success');
          } else {
            setStatus('failure');
          }
        } else {
          setStatus('failure');
        }
      } catch (error) {
        console.error("Failed to verify payment:", error);
        setStatus('failure');
      }
    };

    const timer = setTimeout(verifyPayment, 2500);
    return () => clearTimeout(timer);
  }, [bookingId]);

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6">
        <Loader2 className="w-16 h-16 text-v-accent animate-spin mb-6" />
        <h1 className="text-2xl font-bold">{PROCESSING_TITLE}</h1>
        <p className="text-white/60 mt-2 max-w-xs">{PROCESSING_MESSAGE}</p>
      </div>
    );
  }
  
  if (status === 'success' && booking) {
    return (
       <div className="w-full max-w-md px-6 py-8 flex flex-col items-center">
        <header className="flex flex-col items-center mb-8">
            <div className="mb-4">
                <svg fill="none" height="80" viewBox="0 0 100 100" width="80" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50" stroke="#E31E24" strokeLinecap="round" strokeWidth="8"></path>
                </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-widest text-v-accent">VOLLEYDZEN</h1>
        </header>
        <section className="flex flex-col items-center mb-8 text-center">
            <div className="flex items-center justify-center bg-green-500 rounded-full w-8 h-8 mb-4">
                <Check className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-semibold leading-tight">Оплата прошла успешно</h2>
        </section>
        <section className="w-full bg-v-card rounded-3xl p-5 mb-6 border border-zinc-800">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-lg font-medium">{booking.camp.title}</span>
                </div>
                <span className="text-lg font-medium">{(booking.paidAmount / 100).toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between items-center text-xs text-v-text-muted">
                <span>Заказ #{booking.id.split('-')[0]}</span>
                <span>YooKassa</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-700">
                <span className="text-v-text-muted">Оплачено</span>
                <span className="text-xl font-bold">{(booking.paidAmount / 100).toLocaleString('ru-RU')} ₽</span>
            </div>
        </section>

        <section className="grid grid-cols-4 gap-3 w-full mb-8">
            <a href="#" className="flex flex-col items-center p-2 rounded-lg hover:bg-v-card transition-colors">
                <div className="w-14 h-14 bg-v-card rounded-2xl border border-zinc-800 flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-v-accent" />
                </div>
                <span className="text-[10px] text-center text-v-text-muted">В календарь</span>
            </a>
            <a href={booking.camp.participantsChatUrl || '#'} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${booking.camp.participantsChatUrl ? 'hover:bg-v-card' : 'opacity-50 cursor-not-allowed'}`}>
                <div className="w-14 h-14 bg-v-card rounded-2xl border border-zinc-800 flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-v-accent" />
                </div>
                <span className="text-[10px] text-center text-v-text-muted">Чат</span>
            </a>
            <a href={booking.camp.memoUrl || '#'} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${booking.camp.memoUrl ? 'hover:bg-v-card' : 'opacity-50 cursor-not-allowed'}`}>
                <div className="w-14 h-14 bg-v-card rounded-2xl border border-zinc-800 flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-v-accent" />
                </div>
                <span className="text-[10px] text-center text-v-text-muted">Памятка</span>
            </a>
            <a href={paymentId ? `/api/payments/${paymentId}/receipt` : '#'} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${paymentId ? 'hover:bg-v-card' : 'opacity-50 cursor-not-allowed'}`}>
                <div className="w-14 h-14 bg-v-card rounded-2xl border border-zinc-800 flex items-center justify-center mb-2">
                    <Download className="h-6 w-6 text-v-accent" />
                </div>
                <span className="text-[10px] text-center text-v-text-muted">Квитанция</span>
            </a>
        </section>

        <footer className="w-full mt-auto">
            <Link href={`/camps/${booking.camp.slug}`} className="w-full bg-v-accent text-white font-semibold py-4 rounded-2xl text-lg hover:opacity-90 transition-opacity block text-center">
                Перейти к кэмпу
            </Link>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold">{FAILURE_TITLE}</h1>
        <p className="text-white/60 mt-2 max-w-xs">{FAILURE_MESSAGE}</p>
        <Link href="/profile/payments" className="mt-8 bg-v-card text-white py-3 px-8 rounded-lg font-bold uppercase text-sm">
            Мои платежи
        </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-v-dark text-white flex items-center justify-center">
            <Suspense fallback={<Loader2 className="w-16 h-16 text-v-accent animate-spin" />}>
                <PaymentStatusChecker />
            </Suspense>
        </div>
    )
}
