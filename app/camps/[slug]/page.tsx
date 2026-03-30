import { getCampBySlug } from "@/lib/camps";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  ChevronLeft, MapPin, Users, ClipboardList, ListChecks, PackageCheck, Flame
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CampCheckoutActions } from "@/components/camps/CampCheckoutActions";
import type { Booking } from "@prisma/client";

async function getPageData(slug: string) {
  const camp = await getCampBySlug(slug);
  if (!camp) return { camp: null, booking: null };
  
  const cookieStore = cookies();
  const req = { headers: new Headers({ cookie: cookieStore.toString() }) };
  const user = await getUserFromRequest(req as any);

  let booking: Booking | null = null;
  if (user) {
    booking = await prisma.booking.findFirst({
      where: {
        userId: user.sub,
        campId: camp.id,
        status: { in: ['pre_booked', 'deposit_paid', 'fully_paid'] }
      }
    });
  }
  
  return { 
    camp: JSON.parse(JSON.stringify(camp)),
    booking: JSON.parse(JSON.stringify(booking))
  };
}


export default async function CampDetailPage({ params }: { params: { slug: string } }) {
  const { camp, booking } = await getPageData(params.slug);

  if (!camp) {
    notFound();
  }

  const heroImage = camp.coverImageUrl || `https://source.unsplash.com/random/800x450?volleyball,${camp.id}`;
  const occupancy = Math.round((camp.currentParticipants / camp.maxParticipants) * 100);
  const isCampFull = camp.currentParticipants >= camp.maxParticipants;
  const isBooked = booking && (booking.status === 'fully_paid' || booking.status === 'deposit_paid');
  const isPreBooked = booking && booking.status === 'pre_booked';

  const now = new Date();
  const isEarlyBirdActive = camp.earlyBirdPrice && camp.earlyBirdCutoff && now < new Date(camp.earlyBirdCutoff);
  const currentPrice = isEarlyBirdActive ? camp.earlyBirdPrice : camp.basePrice;

  return (
    <div className="min-h-screen bg-v-dark text-white pb-32">
        <header className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
            <Link href="/camps" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                <ChevronLeft className="w-6 h-6" />
            </Link>
        </header>

        <div className="relative h-80 w-full">
            <img src={heroImage} alt={camp.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-v-dark via-v-dark/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-4xl font-extrabold tracking-tight">{camp.title}</h1>
                <p className="text-lg font-semibold text-v-text-muted">{camp.city}</p>
            </div>
        </div>

      <div className="container max-w-md mx-auto py-6 space-y-6">
        <div className="bg-v-card rounded-2xl p-4 border border-zinc-800">
            <div className="flex justify-between items-center text-sm mb-2 text-v-text-muted">
                <span>Заполнено {occupancy}%</span>
                <span>Осталось {camp.maxParticipants - camp.currentParticipants} мест</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-v-green h-2 rounded-full" style={{width: `${occupancy}%`}}></div>
            </div>
        </div>

        <div className="bg-v-card rounded-2xl p-4 border border-zinc-800 flex justify-between items-baseline">
            <span className="text-sm font-bold text-v-text-muted">ЦЕНА</span>
            <div className="text-right">
                {isEarlyBirdActive && (
                    <div className="flex items-center justify-end gap-2 text-v-green">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-bold">Ранняя цена!</span>
                        <span className="text-sm line-through text-v-text-muted/50">{(camp.basePrice / 100).toLocaleString('ru-RU')} ₽</span>
                    </div>
                )}
                <p className="text-3xl font-black text-v-green">{(currentPrice / 100).toLocaleString('ru-RU')} ₽</p>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
            <Link 
              href={isBooked ? `/camps/${camp.slug}/location` : '#'} 
              className={`bg-v-card rounded-2xl p-3 flex flex-col items-center justify-center gap-2 border border-zinc-800 transition-colors ${isBooked ? 'hover:border-zinc-700' : 'opacity-50 cursor-not-allowed'}`}
              aria-disabled={!isBooked}
            >
                <MapPin className="w-6 h-6 text-v-text-muted"/>
                <span className="text-xs font-semibold">Карта</span>
            </Link>
            <Link 
              href={isBooked ? `/camps/${camp.slug}/chat` : '#'} 
              className={`bg-v-card rounded-2xl p-3 flex flex-col items-center justify-center gap-2 border border-zinc-800 transition-colors ${isBooked ? 'hover:border-zinc-700' : 'opacity-50 cursor-not-allowed'}`}
              aria-disabled={!isBooked}
            >
                <Users className="w-6 h-6 text-v-text-muted"/>
                <span className="text-xs font-semibold">Чат</span>
            </Link>
            <Link 
              href={isCampFull ? `/camps/${camp.slug}/waitlist` : '#'} 
              className={`bg-v-card rounded-2xl p-3 flex flex-col items-center justify-center gap-2 border border-zinc-800 transition-colors ${isCampFull ? 'hover:border-zinc-700' : 'opacity-50 cursor-not-allowed'}`}
              aria-disabled={!isCampFull}
            >
                <ClipboardList className="w-6 h-6 text-v-text-muted"/>
                <span className="text-xs font-semibold">Лист ожидания</span>
            </Link>
        </div>

        <Accordion type="single" collapsible={false} defaultValue="program" className="w-full space-y-3">
          <AccordionItem value="program" className="border-none bg-v-card rounded-2xl px-4">
            <AccordionTrigger className="text-base font-bold hover:no-underline">
                <div className="flex items-center gap-3">
                    <ListChecks className="w-5 h-5 text-v-accent"/>
                    <span>Программа по дням</span>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                {camp.days.map(day => (
                    <div key={day.id} className="py-3 border-b border-zinc-800 last:border-b-0">
                        <div className="font-bold">День {day.dayNumber}: {day.title}</div>
                        <p className="text-xs text-v-text-muted mt-1">{day.description}</p>
                    </div>
                ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="trainers" className="border-none bg-v-card rounded-2xl px-4">
            <AccordionTrigger className="text-base font-bold hover:no-underline">
                <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-v-accent"/>
                    <span>Тренеры</span>
                </div>
            </AccordionTrigger>
            <AccordionContent>
              {camp.trainers.map(({ trainer }) => (
                <div key={trainer.id} className="py-3 flex items-center gap-4 border-b border-zinc-800 last:border-b-0">
                    <img src={trainer.photoUrl || `https://source.unsplash.com/random/100x100?portrait,person,${trainer.id}`} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                        <div className="font-bold">{trainer.name}</div>
                        <div className="text-sm text-v-text-muted">{trainer.specialization}</div>
                    </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="included" className="border-none bg-v-card rounded-2xl px-4">
            <AccordionTrigger className="text-base font-bold hover:no-underline">
                <div className="flex items-center gap-3">
                    <PackageCheck className="w-5 h-5 text-v-accent"/>
                    <span>Что входит</span>
                </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-v-text-muted text-sm space-y-2 pl-2">
                {(camp.whatsIncluded as string[] || []).map(item => <li key={item}>{item}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          {camp.customSections && (camp.customSections as Array<{title: string, content: string}>).map((section, index) => (
            <AccordionItem key={index} value={`custom-${index}`} className="border-none bg-v-card rounded-2xl px-4">
              <AccordionTrigger className="text-base font-bold hover:no-underline">
                  <div className="flex items-center gap-3">
                      <ListChecks className="w-5 h-5 text-v-accent"/>
                      <span>{section.title}</span>
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-invert prose-sm max-w-none">
                  {section.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

        </Accordion>
      </div>

      {!isBooked && (
        <CampCheckoutActions camp={camp} isPreBooked={isPreBooked} />
      )}
    </div>
  );
}
