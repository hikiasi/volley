import Link from "next/link";
import { getCampBySlug } from "@/lib/camps";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, MoreVertical, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// This is a simplified server component version.
// A real implementation would also need to fetch the user's waitlist status.
export default async function WaitlistPage({ params }: { params: { slug: string } }) {
  const camp = await getCampBySlug(params.slug);

  if (!camp) {
    notFound();
  }

  // Redirect if the camp is not full
  if (camp.currentParticipants < camp.maxParticipants) {
    redirect(`/camps/${params.slug}`);
  }

  // Mocked data based on waitlist.html design
  const waitlistPosition = 12;
  const notificationEnabled = true;
  const isInWaitlist = true; // Assume user is in waitlist for this view

  return (
    <div className="h-full flex flex-col overflow-hidden bg-brand-black text-white max-w-md mx-auto">
      <header className="flex items-center justify-between px-4 py-4 shrink-0 z-10">
        <Link href={`/camps/${params.slug}`} className="p-1">
          <ChevronLeft className="text-brand-muted w-6 h-6" />
        </Link>
        <h1 className="text-xs font-medium tracking-widest text-brand-muted uppercase">Лист ожидания</h1>
        <button className="p-1">
          <MoreVertical className="text-brand-muted w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-20">
        <section className="relative rounded-3xl overflow-hidden mb-6 h-56 group">
          <img alt={camp.title} className="w-full h-full object-cover brightness-50" src={camp.coverImageUrl || `https://source.unsplash.com/random/800x600?volleyball,${camp.id}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute top-4 right-4">
            <span className="bg-brand-red/20 text-brand-red text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Распродан</span>
          </div>
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-serif text-white tracking-wide">{camp.city} • {camp.title.replace(`Кэмп ${camp.city} · `, '')}</h2>
          </div>
        </section>

        {isInWaitlist ? (
            <>
                <section className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <h3 className="text-brand-orange text-lg font-medium tracking-widest uppercase">Лист ожидания</h3>
                    </div>
                    <div className="bg-brand-card rounded-2xl p-5 space-y-4 border border-white/5">
                        <div className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-muted shrink-0"></div><p className="text-[15px] text-gray-300">Вы добавлены</p></div>
                        <div className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-muted shrink-0"></div><p className="text-[15px] text-gray-300">Ваша позиция: <span className="text-white font-medium">{waitlistPosition}</span></p></div>
                        <div className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-muted shrink-0"></div><p className="text-[15px] text-gray-300 leading-snug">Ожидаемое время уведомления:<br/><span className="text-white">при освобождении</span></p></div>
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0 ${notificationEnabled ? 'bg-green-500' : 'bg-brand-muted'}`}></div>
                            <p className="text-[15px] text-gray-300">Автоуведомление {notificationEnabled ? 'включено' : 'выключено'}</p>
                        </div>
                    </div>
                </section>
                <section className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full py-6 rounded-xl border-brand-border text-[11px] font-bold uppercase tracking-wider text-gray-300">Изменить кэмп</Button>
                        <Button variant="destructive" className="w-full py-6 rounded-xl border-brand-red/30 text-[11px] font-bold uppercase tracking-wider text-brand-red bg-transparent">Отменить заявку</Button>
                    </div>
                    <Button variant="secondary" className="w-full py-6 rounded-xl bg-brand-card border-brand-border text-[11px] font-bold uppercase tracking-wider text-white">Перейти к другим кэмпам</Button>
                </section>
            </>
        ) : (
            <p>Error: Not in waitlist view.</p>
        )}
      </main>
    </div>
  );
}
