import { getCamps } from "@/lib/camps";
import { CampCard } from "@/components/camp-card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CampStatus } from "@prisma/client";

// Mock data fallback since DB might not be connected in this env
const MOCK_CAMPS = [
  {
    id: "1",
    slug: 'moscow-october-2024',
    title: 'Москва · Октябрь',
    city: 'Москва',
    level: 'Shoshin',
    startDate: new Date('2024-10-12'),
    endDate: new Date('2024-10-14'),
    durationDays: 3,
    basePrice: 1500000,
    maxParticipants: 25,
    currentParticipants: 18,
    status: 'published' as CampStatus,
    hotMessage: '🔥 Спец-кэмп «Power Jump» · −10% до 12.10',
  },
  {
    id: "2",
    slug: 'spb-november-2024',
    title: 'Санкт-Петербург · Ноябрь',
    city: 'Санкт-Петербург',
    level: 'Shugyosha',
    startDate: new Date('2024-11-05'),
    endDate: new Date('2024-11-07'),
    durationDays: 3,
    basePrice: 1800000,
    maxParticipants: 20,
    currentParticipants: 5,
    status: 'published' as CampStatus,
  }
];

export default async function CampsPage() {
  let camps = [];
  try {
    camps = await getCamps();
    if (camps.length === 0) camps = MOCK_CAMPS;
  } catch {
    camps = MOCK_CAMPS;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-[430px]">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-black uppercase italic tracking-tight">Кэмпы</h1>
      </header>

      <div className="space-y-4">
        {camps.map((camp) => (
          <CampCard key={camp.id} camp={camp} />
        ))}
      </div>
    </div>
  );
}
