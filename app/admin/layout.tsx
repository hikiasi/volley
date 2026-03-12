import { ReactNode, ComponentProps } from "react";
import Link from "next/link";
import { LayoutDashboard, Tent, GraduationCap, Users, CreditCard, Bell } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col bg-[#0F0F0F] shrink-0">
        <div className="p-8">
          <div className="text-2xl font-black italic text-[#FF2D2D] tracking-tighter leading-none">VOLLEYDZEN</div>
          <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mt-2">Admin Panel</div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
            { icon: Tent, label: "Кэмпы", href: "/admin/camps" },
            { icon: GraduationCap, label: "Курсы", href: "/admin/courses" },
            { icon: Users, label: "Пользователи", href: "/admin/users" },
            { icon: CreditCard, label: "Платежи", href: "/admin/payments" },
            { icon: Bell, label: "Рассылки", href: "/admin/notifications" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/5 transition-all group active:scale-[0.98]"
            >
              <item.icon className="w-5 h-5 text-white/40 group-hover:text-[#FF2D2D] transition-colors" />
              <span className="text-sm font-black uppercase italic tracking-tight text-white/70 group-hover:text-white">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20">
           <Link href="/" className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/5 transition-all text-sm font-black uppercase italic text-white/30 hover:text-white">
            <ArrowBack className="w-5 h-5" />
            В приложение
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
        <div className="p-10 max-w-7xl mx-auto w-full">
            {children}
        </div>
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
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}
