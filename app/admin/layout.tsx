import { ReactNode, ComponentProps } from "react";
import Link from "next/link";
import { LayoutDashboard, Tent, GraduationCap, Users, CreditCard, Bell } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-6">
          <div className="text-xl font-black italic text-[#FF2D2D] tracking-tighter">VOLLEYDZEN</div>
          <div className="text-[10px] text-white/40 uppercase font-bold">Admin Panel</div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/admin/camps" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold">
            <Tent className="w-4 h-4" />
            Кэмпы
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold">
            <GraduationCap className="w-4 h-4" />
            Курсы
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold">
            <Users className="w-4 h-4" />
            Пользователи
          </Link>
          <Link href="/admin/payments" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold">
            <CreditCard className="w-4 h-4" />
            Платежи
          </Link>
          <Link href="/admin/notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold">
            <Bell className="w-4 h-4" />
            Рассылки
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
           <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-white/50">
            <ArrowBack className="w-4 h-4" />
            В приложение
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 max-w-none">
        {children}
      </main>
    </div>
  );
}

function ArrowBack(props: ComponentProps<"svg">) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}
