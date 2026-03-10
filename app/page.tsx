import {
  History,
  MapPin,
  Zap,
  Dumbbell,
  MessagesSquare,
  Users2,
  Newspaper,
  ShoppingBag,
  UserCircle
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { icon: History, label: "Манифест", href: "/manifest" },
  { icon: MapPin, label: "Кэмпы", href: "/camps" },
  { icon: Zap, label: "Путь Энсо", href: "/enso" },
  { icon: Dumbbell, label: "Атлетизм", href: "/courses" },
  { icon: MessagesSquare, label: "Консультации", href: "/consultations" },
  { icon: Users2, label: "Офлайн", href: "/offline" },
  { icon: Newspaper, label: "Новости", href: "/news", badge: "2" },
  { icon: ShoppingBag, label: "Мерч", href: "/merch", badge: "NEW" },
  { icon: UserCircle, label: "Профиль", href: "/profile" },
];

export default function Home() {
  return (
    <div className="px-4 py-6">
      <header className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter text-[#E63946]">VOLLEYDZEN</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">ты решаешь как играть и жить</p>
      </header>

      {/* Community Banner */}
      <div className="bg-[#1A1A1A] rounded-2xl p-4 mb-6 flex items-center justify-between border border-white/5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#E63946]/10 p-2 rounded-xl">
            <Users2 className="text-[#E63946] w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Сообщество</div>
            <div className="text-sm font-bold">12 540 участников</div>
          </div>
        </div>
        <div className="bg-[#E63946] text-[10px] font-black px-2 py-1 rounded-md animate-pulse">
          HOT-АКЦИЯ
        </div>
      </div>

      {/* 3x3 Grid Navigation */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center aspect-square bg-[#1A1A1A] rounded-2xl border border-white/5 active:scale-95 transition-all relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-active:opacity-100 transition-opacity" />
            <item.icon className="w-8 h-8 mb-2 text-white/90" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.label}</span>
            {item.badge && (
              <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-black ${
                item.badge === 'NEW' ? 'bg-[#2DC653]' : 'bg-[#E63946]'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Camp Banner (Preview) */}
      <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#E63946]/20" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-black text-[#E63946] uppercase mb-1">Ближайший кэмп</div>
              <h3 className="text-xl font-black italic">НИЖНИЙ НОВГОРОД</h3>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold">15–18 МАЯ</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tight">
              <span>Заполнено 72%</span>
              <span className="text-[#E63946]">Осталось 7 мест</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div className="bg-[#E63946] h-full rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          <Link
            href="/camps/1"
            className="w-full bg-[#E63946] text-white py-4 rounded-2xl font-black text-sm text-center block shadow-[0_4px_20px_rgba(230,57,70,0.3)] active:translate-y-0.5 transition-all uppercase tracking-widest"
          >
            Предбронь
          </Link>
        </div>
      </div>
    </div>
  );
}
