"use client";

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

type Settings = {
    community_banner?: { text?: string };
    hot_sale_banner?: { text?: string; link?: string; isActive?: boolean };
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                alert('Настройки сохранены!');
            } else {
                throw new Error('Ошибка сохранения');
            }
        } catch (error) {
            console.error(error);
            alert('Произошла ошибка');
        } finally {
            setSaving(false);
        }
    };
    
    const handleSettingChange = (key: keyof Settings, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    if (loading) return <Loader2 className="animate-spin" />;

    return (
        <form onSubmit={handleSave} className="space-y-8">
            <h1 className="text-3xl font-bold">Настройки главной страницы</h1>

            <fieldset className="border border-zinc-800 p-4 rounded-lg">
                <legend className="px-2 text-sm text-v-text-muted">Баннер "Сообщество"</legend>
                <input
                    value={settings.community_banner?.text || ''}
                    onChange={e => handleSettingChange('community_banner', 'text', e.target.value)}
                    placeholder="Текст (напр. 12 500+ участников)"
                    className="w-full bg-v-card p-2 rounded-md border border-zinc-800"
                />
            </fieldset>

            <fieldset className="border border-zinc-800 p-4 rounded-lg space-y-4">
                <legend className="px-2 text-sm text-v-text-muted">Баннер "Горячая скидка"</legend>
                <input
                    value={settings.hot_sale_banner?.text || ''}
                    onChange={e => handleSettingChange('hot_sale_banner', 'text', e.target.value)}
                    placeholder="Текст акции (напр. Скидка -20% на курс)"
                    className="w-full bg-v-card p-2 rounded-md border border-zinc-800"
                />
                <input
                    value={settings.hot_sale_banner?.link || ''}
                    onChange={e => handleSettingChange('hot_sale_banner', 'link', e.target.value)}
                    placeholder="Ссылка (напр. /camps/moscow)"
                    className="w-full bg-v-card p-2 rounded-md border border-zinc-800"
                />
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="hot_sale_active"
                        checked={settings.hot_sale_banner?.isActive || false}
                        onChange={e => handleSettingChange('hot_sale_banner', 'isActive', e.target.checked)}
                        className="h-4 w-4 rounded"
                    />
                    <label htmlFor="hot_sale_active">Активен</label>
                </div>
            </fieldset>

            <button type="submit" disabled={saving} className="bg-v-accent text-white px-6 py-3 rounded-lg w-full disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin mx-auto" /> : 'Сохранить настройки'}
            </button>
        </form>
    );
}
