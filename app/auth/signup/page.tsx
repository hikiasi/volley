"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, firstName }),
      });
      if (res.ok) {
        const { token, user: userData } = await res.json();
        login(token, userData);
        router.push("/");
      } else {
        const err = await res.json();
        alert(`Ошибка: ${err.error}`);
      }
    } catch {
      alert("Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm glass-card p-8 space-y-6">
        <h1 className="text-2xl font-black uppercase text-center italic tracking-tighter">Регистрация</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Имя"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF2D2D] transition-colors"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF2D2D] transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF2D2D] transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF2D2D] text-white py-4 rounded-xl font-black uppercase text-sm active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Загрузка..." : "Создать аккаунт"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-[#0A0A0A] px-2 text-white/40">или</span></div>
        </div>

        <button
          onClick={() => {
             const tg = (window as { Telegram?: { WebApp?: { initData: string } } }).Telegram?.WebApp;
             if (tg?.initData) {
                 window.location.reload(); // AuthProvider will handle it
             } else {
                 alert("Зайдите через Telegram Mini App");
             }
          }}
          className="w-full bg-[#0088cc] text-white py-4 rounded-xl font-black uppercase text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Войти через Telegram
        </button>

        <div className="text-center text-xs text-white/40">
          Уже есть аккаунт? <Link href="/auth/login" className="text-[#FF2D2D] font-bold">Войти</Link>
        </div>
      </div>
    </div>
  );
}
