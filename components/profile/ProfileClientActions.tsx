"use client";

import Link from "next/link";
import { LogOut, Shield } from "lucide-react";

export function ProfileClientActions({ isAdmin }: { isAdmin: boolean }) {
  
  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/auth/login";
  };

  return (
    <section className="space-y-2 mt-4">
      {isAdmin && (
        <Link href="/admin" className="flex items-center justify-between p-4 bg-blue-500/10 rounded-2xl active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold uppercase text-blue-400">Панель управления</span>
          </div>
        </Link>
      )}

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-between p-4 bg-enso-red/10 rounded-2xl active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-3">
          <LogOut className="w-5 h-5 text-enso-red" />
          <span className="text-sm font-bold uppercase text-enso-red">Выйти из аккаунта</span>
        </div>
      </button>
    </section>
  );
}
