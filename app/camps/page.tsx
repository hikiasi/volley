import { getCamps } from "@/lib/camps";
import { CampCard } from "@/components/camp-card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Camp } from "@prisma/client";

export default async function CampsPage() {
  let camps: Camp[] = [];
  try {
    camps = await getCamps();
  } catch (err) {
    console.error("Failed to fetch camps:", err);
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
