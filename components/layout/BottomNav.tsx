"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, BarChart3 } from "lucide-react";
import { useLayout } from "@/app/contexts/LayoutContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Главная" },
  { href: "/camps", icon: Calendar, label: "Кэмпы" },
  { href: "/courses", icon: BarChart3, label: "Атлетизм" },
  { href: "/profile", icon: User, label: "Профиль" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isBottomNavVisible } = useLayout();

  if (!isBottomNavVisible) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 px-6 py-3 z-40 max-w-md mx-auto">
      <div className="flex justify-around items-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 group">
              <div className={cn(isActive ? "text-v-accent" : "text-v-text-muted opacity-40 group-hover:opacity-100 transition-colors")}>
                <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-tighter",
                isActive ? "text-v-accent" : "text-v-text-muted opacity-40 group-hover:opacity-100 transition-colors"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
       {/* iPhone Home Indicator Placeholder */}
       <div className="w-32 h-1.5 bg-zinc-600 rounded-full mx-auto mt-3 mb-1"></div>
    </nav>
  );
}
