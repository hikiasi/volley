"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, MoreHorizontal, Bell, Flame } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Camp, WaitlistEntry } from "@prisma/client";

export default function WaitlistPage({ params }: { params: { slug: string } }) {
  const [camp, setCamp] = useState<Camp | null>(null);
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const campRes = await fetch(`/api/camps/${params.slug}`);
        if (campRes.ok) setCamp(await campRes.json());

        const entryRes = await fetch(`/api/camps/${params.slug}/waitlist`);
        if (entryRes.ok) {
            const data = await entryRes.json();
            setEntry(data.entry);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.slug]);

  const handleJoin = async () => {
    try {
        const res = await fetch(`/api/camps/${params.slug}/waitlist`, { method: "POST" });
        if (res.ok) setEntry(await res.json());
        else alert("Ошибка при добавлении в лист ожидания");
    } catch (err) {
        console.error(err);
    }
  };

  const handleCancel = async () => {
    try {
        const res = await fetch(`/api/camps/${params.slug}/waitlist`, { method: "DELETE" });
        if (res.ok) setEntry(null);
        else alert("Ошибка при удалении из листа ожидания");
    } catch (err) {
        console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-bold uppercase tracking-widest italic">Загрузка...</div>;
  if (!camp) return <div className="min-h-screen bg-[#0A0A0A] p-4 flex flex-col items-center justify-center gap-6"><h1 className="text-xl font-black italic uppercase">Кэмп не найден</h1><Link href="/camps" className="bg-[#FF2D2D] px-8 py-3 rounded-2xl font-black uppercase text-xs">В каталог</Link></div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      {/* Header */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 border-b border-white/5">
        <Link href={`/camps/${params.slug}`} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xs font-black uppercase italic text-white/40 tracking-widest">Лист ожидания</h1>
        <button className="p-2">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </header>

      {/* Hero Mini */}
      <div className="px-4 mt-6 mb-6">
        <div className="relative h-48 rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {camp.coverImageUrl && (
            <img src={camp.coverImageUrl} className="w-full h-full object-cover opacity-40 grayscale" alt="" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-[#FF2D2D] text-white border-none text-[10px] font-black uppercase px-3 py-1 shadow-lg">
              {camp.status === 'full' ? 'Распродан' : camp.status}
            </Badge>
          </div>
          <div className="absolute bottom-6 left-6">
            <div className="text-[10px] font-black uppercase text-[#FF2D2D] mb-1 tracking-widest">Кэмп детали</div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              {camp.city} · {new Date(camp.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Waitlist Status Card */}
        {entry ? (
          <section className="glass-card p-6 border-[#FF2D2D]/30 relative overflow-hidden bg-gradient-to-br from-[#FF2D2D]/5 to-transparent">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF2D2D]/5 rounded-full blur-3xl" />

            <h3 className="text-xs font-black uppercase text-[#FF2D2D] text-center mb-8 tracking-[0.2em] italic">
              Вы в списке
            </h3>

            <div className="space-y-6 mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                  ✔️
                </div>
                <div className="text-sm font-bold">Вы добавлены в очередь</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-[#FF2D2D]">
                  #{entry.position}
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-white/40 tracking-tight">Ваша позиция</div>
                  <div className="text-sm font-bold">Осталось подождать совсем немного</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-[#10B981] tracking-tight">Уведомления включены</div>
                  <div className="text-[11px] text-white/50 leading-tight">Мы напишем вам в Telegram, как только освободится место</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 relative z-10">
              <Button variant="outline" className="flex-1 h-12 border-white/10 bg-white/5 rounded-xl font-black uppercase text-[10px] tracking-widest">
                Другой кэмп
              </Button>
              <Button
                onClick={handleCancel}
                className="flex-1 h-12 bg-transparent border border-[#FF2D2D]/20 text-[#FF2D2D]/60 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#FF2D2D]/5 hover:text-[#FF2D2D]"
              >
                Отменить
              </Button>
            </div>
          </section>
        ) : (
          <section className="glass-card p-8 border-white/10 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2">
               <Flame className="w-10 h-10 text-[#FF2D2D]" />
            </div>
            <div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Мест пока нет</h3>
                <p className="text-xs text-white/50 font-medium max-w-[200px] mx-auto mt-2">
                    Встаньте в лист ожидания, и мы сообщим вам первым, если кто-то отменит бронь.
                </p>
            </div>
            <Button
                onClick={handleJoin}
                className="w-full h-14 bg-[#FF2D2D] hover:bg-[#FF2D2D]/90 text-white rounded-2xl font-black uppercase text-xs tracking-[0.1em] shadow-[0_10px_30px_rgba(255,45,45,0.3)]"
            >
                Встать в очередь
            </Button>
          </section>
        )}

        {/* Navigation Action */}
        <Link href="/camps" className="block">
            <Button className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-[0.98] transition-all">
                Вернуться к списку кэмпов
            </Button>
        </Link>

        {/* Settings Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                 <Bell className="w-4 h-4 text-white/40" />
             </div>
             <span className="text-xs font-bold uppercase tracking-tight">Умные уведомления</span>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-[#FF2D2D]" />
        </div>
      </div>
    </div>
  );
}
