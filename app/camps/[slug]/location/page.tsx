import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampBySlug } from "@/lib/camps";
import { ChevronLeft, MoreVertical, Check, Calendar, Users, FileText, AlertTriangle } from "lucide-react";
import YandexMapPlaceholder from "@/components/camps/YandexMap";
import { LocationActions } from "@/components/camps/LocationActions";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default async function CampLocationPage({ params }: { params: { slug: string } }) {
  const camp = await getCampBySlug(params.slug);

  if (!camp) {
    notFound();
  }
  
  const checklist = (camp.whatToBring as string[] | null) || [];
  const yandexMapsUrl = camp.yandexMapsUrl || `https://yandex.ru/maps/?text=${encodeURIComponent(camp.address || '')}`;

  return (
    <main className="w-full max-w-md mx-auto min-h-screen flex flex-col px-4 pb-10 bg-v-dark text-white">
      <header className="flex items-center justify-between py-4">
        <Link href={`/camps/${camp.slug}`} className="p-2 -ml-2">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-semibold">Адрес и карта</h1>
        <div className="w-8 h-8" />
      </header>

      <section className="mt-2">
        <h2 className="text-2xl font-bold">
          <span className="text-v-accent">{`Кэмп ${camp.city}`}</span>
          <span className="text-v-accent opacity-80"> • </span>
          <span className="text-v-accent">{`${format(new Date(camp.startDate), 'd')}–${format(new Date(camp.endDate), 'd MMM', { locale: ru })}`}</span>
        </h2>
      </section>

      <section className="mt-6">
        <YandexMapPlaceholder />
      </section>

      <section className="mt-6 bg-v-card rounded-2xl p-4 flex gap-4 border border-zinc-800">
        <div className="flex-1">
          <p className="text-[17px] leading-tight mb-4">{camp.address}</p>
          <LocationActions address={camp.address || ''} mapUrl={yandexMapsUrl} />
        </div>
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
          <img alt="Venue" className="w-full h-full object-cover" src={camp.coverImageUrl || `https://source.unsplash.com/random/200x200?volleyball,arena,${camp.id}`} />
        </div>
      </section>

      {checklist.length > 0 && (
        <section className="mt-4 bg-v-card rounded-2xl p-4 border border-zinc-800">
            <h3 className="text-lg font-bold mb-3">Что взять</h3>
            <div className="space-y-3">
              {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                      <div className="w-5 h-5 flex items-center justify-center rounded-md bg-v-green"><Check className="w-3 h-3 text-black" /></div>
                      <span>{item}</span>
                  </div>
              ))}
            </div>
        </section>
      )}
      
      <section className="mt-4 space-y-3">
        <a href={camp.icsFileUrl || '#'} className={`w-full flex items-center justify-center gap-2 py-3 bg-v-card rounded-lg border border-zinc-800 text-sm font-semibold ${!camp.icsFileUrl && 'opacity-50 cursor-not-allowed'}`}>
            <Calendar className="w-4 h-4" />
            <span>Добавить в календарь .ics</span>
        </a>
        <div className="grid grid-cols-2 gap-3">
            <a href={camp.participantsChatUrl || '#'} target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center gap-2 py-3 bg-v-card rounded-lg border border-zinc-800 text-sm font-semibold ${!camp.participantsChatUrl && 'opacity-50 cursor-not-allowed'}`}>
                <Users className="w-4 h-4" />
                <span>Чат участников</span>
            </a>
            <a href={camp.memoUrl || '#'} target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center gap-2 py-3 bg-v-card rounded-lg border border-zinc-800 text-sm font-semibold ${!camp.memoUrl && 'opacity-50 cursor-not-allowed'}`}>
                <FileText className="w-4 h-4" />
                <span>Памятка</span>
            </a>
        </div>
      </section>

      {camp.hotMessage && (
        <footer className="mt-6 flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-black">!</div>
            <p className="text-orange-500 font-medium">{camp.hotMessage}</p>
        </footer>
      )}
    </main>
  );
}
