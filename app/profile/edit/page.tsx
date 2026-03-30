"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayout } from "@/app/contexts/LayoutContext";
import { ChevronLeft, Loader2, AlertTriangle, Camera } from "lucide-react";
import InputMask from 'react-input-mask';
import Link from 'next/link';

type UserProfile = {
  id: string;
  email: string | null;
  phone: string | null;
  playLevel: string | null;
  firstName: string;
  lastName: string | null;
  telegramId: string | null;
  photoUrl: string | null;
};

// Basic email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsBottomNavVisible } = useLayout();
  const reason = searchParams.get('reason');
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});

  const isIncomplete = reason === 'incomplete';

  useEffect(() => {
    setIsBottomNavVisible(false);
    return () => setIsBottomNavVisible(true);
  }, [setIsBottomNavVisible]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile", { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const validateEmail = (email: string | null) => {
    if (email && !EMAIL_REGEX.test(email)) {
        setFieldErrors(errors => ({...errors, email: "Неверный формат email"}));
    } else {
        setFieldErrors(errors => ({...errors, email: undefined}));
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const res = await fetch('/api/user/avatar/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!res.ok) throw new Error('Failed to upload avatar');

        const { photoUrl } = await res.json();
        setUser(u => u ? { ...u, photoUrl } : null);

    } catch (error) {
        alert('Не удалось загрузить фото.');
        console.error(error);
    } finally {
        setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError(null);

    if (user.email && !EMAIL_REGEX.test(user.email)) {
        setFieldErrors(errors => ({...errors, email: "Неверный формат email"}));
        return;
    }
    if (!user.email && !user.phone) {
        setFormError("Для совершения платежей необходимо указать Email или Телефон.");
        return;
    }
    if (Object.values(fieldErrors).some(Boolean)) return;

    setIsSaving(true);
    try {
        const res = await fetch('/api/user/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                playLevel: user.playLevel,
                photoUrl: user.photoUrl
            }),
        });
        if (res.ok) {
            alert('Профиль сохранен!');
            if (isIncomplete) router.back();
            else router.push('/profile');
        } else {
            throw new Error('Не удалось сохранить профиль');
        }
    } catch (error) {
        alert(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
        setIsSaving(false);
    }
  };
  
  if (loading) {
    return <div className="min-h-screen bg-v-dark flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  const highlightFields = formError || (isIncomplete && !user?.email && !user?.phone);

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-40">
        <header className="flex items-center justify-between mb-8">
            <button onClick={() => router.back()} className="p-2 -ml-2"><ChevronLeft className="h-6 w-6" /></button>
            <h1 className="text-lg font-semibold">Редактировать профиль</h1>
            <div className="w-8"></div>
        </header>

        {isIncomplete && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm rounded-lg p-4 mb-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Для продолжения необходимо указать ваш Email или Телефон.</p>
            </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-4">
                <input type="file" ref={avatarFileRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                <button type="button" onClick={() => avatarFileRef.current?.click()} className="relative w-20 h-20 rounded-full bg-v-card border-2 border-dashed border-zinc-700 flex items-center justify-center group flex-shrink-0">
                    {isUploading ? <Loader2 className="animate-spin"/> : (
                        <>
                            {user?.photoUrl ? <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover rounded-full"/> : <span className="text-xs text-zinc-500 text-center">Сменить фото</span>}
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white"/>
                            </div>
                        </>
                    )}
                </button>
                <div className="grid grid-cols-2 gap-3 flex-1">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-v-text-muted mb-1">Имя</label>
                        <input type="text" id="firstName" value={user?.firstName || ''} onChange={(e) => setUser(u => u ? {...u, firstName: e.target.value} : null)} className="w-full bg-v-card border border-zinc-800 rounded-lg p-3"/>
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-v-text-muted mb-1">Фамилия</label>
                        <input type="text" id="lastName" value={user?.lastName || ''} onChange={(e) => setUser(u => u ? {...u, lastName: e.target.value} : null)} className="w-full bg-v-card border border-zinc-800 rounded-lg p-3"/>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-v-text-muted mb-1">Email</label>
                    <input type="email" id="email" value={user?.email || ''} onBlur={(e) => validateEmail(e.target.value)} onChange={(e) => setUser(u => u ? {...u, email: e.target.value} : null)} className={`w-full bg-v-card border rounded-lg p-3 ${highlightFields || fieldErrors.email ? 'border-red-500' : 'border-zinc-800'}`} placeholder="example@mail.com" />
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-v-text-muted mb-1">Телефон</label>
                    <InputMask mask="+7 (999) 999-99-99" value={user?.phone || ''} onChange={(e) => setUser(u => u ? {...u, phone: e.target.value} : null)}>
                        {(inputProps: any) => <input {...inputProps} type="tel" id="phone" className={`w-full bg-v-card border rounded-lg p-3 ${highlightFields ? 'border-red-500' : 'border-zinc-800'}`} placeholder="+7 (999) 999-99-99" />}
                    </InputMask>
                </div>
                 <div>
                    <label htmlFor="playLevel" className="block text-sm font-medium text-v-text-muted mb-1">Уровень игры</label>
                    <select id="playLevel" value={user?.playLevel || ''} onChange={(e) => setUser(u => u ? {...u, playLevel: e.target.value} : null)} className="w-full bg-v-card border border-zinc-800 rounded-lg p-3 appearance-none">
                        <option value="">Не выбрано</option>
                        <option value="beginner">Начинающий</option>
                        <option value="amateur">Любитель</option>
                        <option value="advanced">Продвинутый</option>
                        <option value="pro">Профи</option>
                    </select>
                </div>
            </div>

            {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
            
            {!user?.telegramId && (
                <div className="pt-4">
                    <Link href="/profile/link-telegram" className="block w-full text-center py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                        Привязать Telegram
                    </Link>
                </div>
            )}
        </form>

        <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-v-dark/80 backdrop-blur-xl border-t border-zinc-800">
            <div className="max-w-md mx-auto">
                <button onClick={handleSave} type="submit" disabled={isSaving} className="w-full bg-v-accent text-white h-14 rounded-2xl font-bold uppercase text-sm tracking-widest disabled:opacity-50">
                    {isSaving ? <Loader2 className="animate-spin mx-auto"/> : 'Сохранить'}
                </button>
            </div>
        </div>
    </div>
  );
}

export default function ProfileEditPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-v-dark flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <EditForm />
        </Suspense>
    );
}
