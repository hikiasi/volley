"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { Camp, CampStatus } from '@prisma/client';

type CustomSection = {
    title: string;
    content: string;
};

// Helper function to format date for input[type=date]
const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
}

export default function CampEditPage({ params }: { params: { id: string } }) {
    const [camp, setCamp] = useState<Partial<Camp>>({});
    const [customSections, setCustomSections] = useState<CustomSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (params.id !== 'new') {
            setLoading(true);
            fetch(`/api/admin/camps/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        setCamp(data);
                        setCustomSections(data.customSections || []);
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [params.id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const method = params.id === 'new' ? 'POST' : 'PATCH';
        const url = params.id === 'new' ? '/api/admin/camps' : `/api/admin/camps/${params.id}`;

        const payload = { ...camp, customSections };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            const resData = await res.json();
            if (res.ok) {
                alert('Сохранено!');
                router.push('/admin/camps');
                router.refresh(); // Refresh server-side props of the list page
            } else {
                throw new Error(resData.error || 'Ошибка сохранения');
            }
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setSaving(false);
        }
    };
    
    const handleAddSection = () => {
        setCustomSections(prev => [...prev, { title: '', content: '' }]);
    };

    const handleRemoveSection = (index: number) => {
        setCustomSections(prev => prev.filter((_, i) => i !== index));
    };

    const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
        const newSections = [...customSections];
        newSections[index][field] = value;
        setCustomSections(newSections);
    };


    if (loading) return <div className="flex justify-center items-center"><Loader2 className="animate-spin" /></div>;

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{params.id === 'new' ? 'Новый кэмп' : 'Редактировать кэмп'}</h1>
                <button type="submit" disabled={saving} className="bg-v-accent text-white px-6 py-2 rounded-lg disabled:opacity-50">
                    {saving ? <Loader2 className="animate-spin" /> : 'Сохранить'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Fields */}
                    <fieldset className="border border-zinc-800 p-4 rounded-lg space-y-4">
                        <legend className="px-2 text-sm text-v-text-muted">Основная информация</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input value={camp?.title || ''} onChange={e => setCamp(c => ({...c, title: e.target.value}))} placeholder="Название" className="bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                            <input value={camp?.slug || ''} onChange={e => setCamp(c => ({...c, slug: e.target.value}))} placeholder="Slug (URL)" className="bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                        </div>
                        <textarea value={camp?.description || ''} onChange={e => setCamp(c => ({...c, description: e.target.value}))} placeholder="Описание кэмпа" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700 h-24"/>
                    </fieldset>

                     {/* Location */}
                    <fieldset className="border border-zinc-800 p-4 rounded-lg space-y-4">
                        <legend className="px-2 text-sm text-v-text-muted">Локация</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input value={camp?.city || ''} onChange={e => setCamp(c => ({...c, city: e.target.value}))} placeholder="Город" className="bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                            <input value={camp?.venueName || ''} onChange={e => setCamp(c => ({...c, venueName: e.target.value}))} placeholder="Название площадки" className="bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                        </div>
                        <input value={camp?.address || ''} onChange={e => setCamp(c => ({...c, address: e.target.value}))} placeholder="Адрес" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                    </fieldset>

                    {/* Custom Sections */}
                    <fieldset className="border border-zinc-800 p-4 rounded-lg">
                        <legend className="px-2 text-sm text-v-text-muted">Дополнительные разделы</legend>
                        <div className="space-y-4">
                            {customSections.map((section, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <div className="flex-1 space-y-2">
                                        <input value={section.title} onChange={e => handleSectionChange(index, 'title', e.target.value)} placeholder="Заголовок раздела" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700"/>
                                        <textarea value={section.content} onChange={e => handleSectionChange(index, 'content', e.target.value)} placeholder="Содержимое раздела (Markdown)" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700 h-24"/>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveSection(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddSection} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-zinc-700 text-zinc-500 rounded-lg hover:bg-zinc-800 hover:text-white">
                                <Plus className="w-4 h-4"/>
                                Добавить раздел
                            </button>
                        </div>
                    </fieldset>
                </div>
                <div className="lg:col-span-1 space-y-6">
                     <fieldset className="border border-zinc-800 p-4 rounded-lg space-y-4">
                        <legend className="px-2 text-sm text-v-text-muted">Даты и Статус</legend>
                        <select value={camp?.status || 'draft'} onChange={e => setCamp(c => ({...c, status: e.target.value as CampStatus}))} className="bg-zinc-800 p-2 rounded-md border border-zinc-700 w-full">
                            <option value="draft">Черновик</option>
                            <option value="published">Опубликован</option>
                            <option value="full">Мест нет</option>
                            <option value="completed">Завершен</option>
                            <option value="cancelled">Отменен</option>
                        </select>
                        <input value={formatDateForInput(camp?.startDate)} type="date" onChange={e => setCamp(c => ({...c, startDate: new Date(e.target.value)}))} placeholder="Дата начала" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                        <input value={formatDateForInput(camp?.endDate)} type="date" onChange={e => setCamp(c => ({...c, endDate: new Date(e.target.value)}))} placeholder="Дата окончания" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                    </fieldset>
                    <fieldset className="border border-zinc-800 p-4 rounded-lg space-y-4">
                        <legend className="px-2 text-sm text-v-text-muted">Цены</legend>
                        <input value={camp?.basePrice ? camp.basePrice / 100 : ''} type="number" step="0.01" onChange={e => setCamp(c => ({...c, basePrice: Math.round(parseFloat(e.target.value) * 100)}))} placeholder="Цена (в рублях)" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                        <input value={camp?.depositAmount ? camp.depositAmount / 100 : ''} type="number" step="0.01" onChange={e => setCamp(c => ({...c, depositAmount: Math.round(parseFloat(e.target.value) * 100) || null}))} placeholder="Депозит (рубли)" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                    </fieldset>
                    <fieldset className="border border-zinc-800 p-4 rounded-lg space-y-4">
                        <legend className="px-2 text-sm text-v-text-muted">Ранняя цена</legend>
                        <input value={camp?.earlyBirdPrice ? camp.earlyBirdPrice / 100 : ''} type="number" step="0.01" onChange={e => setCamp(c => ({...c, earlyBirdPrice: Math.round(parseFloat(e.target.value) * 100) || null}))} placeholder="Цена Early Bird (рубли)" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                        <input value={formatDateForInput(camp?.earlyBirdCutoff)} type="date" onChange={e => setCamp(c => ({...c, earlyBirdCutoff: e.target.value ? new Date(e.target.value) : null}))} placeholder="Крайний срок" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                    </fieldset>
                    <fieldset className="border border-zinc-800 p-4 rounded-lg space-y-4">
                        <legend className="px-2 text-sm text-v-text-muted">Участники</legend>
                        <input value={camp?.maxParticipants || ''} type="number" onChange={e => setCamp(c => ({...c, maxParticipants: parseInt(e.target.value, 10)}))} placeholder="Макс. участников" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                        <input value={camp?.currentParticipants || ''} type="number" onChange={e => setCamp(c => ({...c, currentParticipants: parseInt(e.target.value, 10)}))} placeholder="Текущие участники" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                    </fieldset>
                     <fieldset className="border border-zinc-800 p-4 rounded-lg space-y-4">
                        <legend className="px-2 text-sm text-v-text-muted">Ссылки и медиа</legend>
                        <input value={camp?.coverImageUrl || ''} onChange={e => setCamp(c => ({...c, coverImageUrl: e.target.value}))} placeholder="URL обложки" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                         <input value={camp?.hotMessage || ''} onChange={e => setCamp(c => ({...c, hotMessage: e.target.value}))} placeholder="Hot-сообщение на карточке" className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700" />
                    </fieldset>
                </div>
            </div>
        </form>
    );
}
