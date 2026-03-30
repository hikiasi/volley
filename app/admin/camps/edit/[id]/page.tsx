"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { Camp } from '@prisma/client';

type CustomSection = {
    title: string;
    content: string;
};

export default function CampEditPage({ params }: { params: { id: string } }) {
    const [camp, setCamp] = useState<Partial<Camp> | null>(null);
    const [customSections, setCustomSections] = useState<CustomSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (params.id !== 'new') {
            fetch(`/api/camps/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setCamp(data);
                    setCustomSections(data.customSections || []);
                    setLoading(false);
                });
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
            if (res.ok) {
                alert('Сохранено!');
                router.push('/admin/camps');
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


    if (loading) return <Loader2 className="animate-spin" />;

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <h1 className="text-2xl font-bold">{params.id === 'new' ? 'Новый кэмп' : 'Редактировать кэмп'}</h1>
            
            {/* Main Fields */}
            <div className="grid grid-cols-2 gap-4">
                <input value={camp?.title || ''} onChange={e => setCamp(c => ({...c, title: e.target.value}))} placeholder="Название" className="bg-v-card p-2 rounded-md border border-zinc-800" />
                <input value={camp?.slug || ''} onChange={e => setCamp(c => ({...c, slug: e.target.value}))} placeholder="Slug (URL)" className="bg-v-card p-2 rounded-md border border-zinc-800" />
                <input value={camp?.city || ''} onChange={e => setCamp(c => ({...c, city: e.target.value}))} placeholder="Город" className="bg-v-card p-2 rounded-md border border-zinc-800" />
                <input value={camp?.basePrice || ''} type="number" onChange={e => setCamp(c => ({...c, basePrice: parseInt(e.target.value, 10)}))} placeholder="Цена (в копейках)" className="bg-v-card p-2 rounded-md border border-zinc-800" />
            </div>

            {/* Early Bird */}
            <fieldset className="border border-zinc-800 p-4 rounded-lg">
                <legend className="px-2 text-sm text-v-text-muted">Ранняя цена</legend>
                <div className="grid grid-cols-2 gap-4">
                     <input value={camp?.earlyBirdPrice || ''} type="number" onChange={e => setCamp(c => ({...c, earlyBirdPrice: parseInt(e.target.value, 10)}))} placeholder="Цена Early Bird (копейки)" className="bg-v-card p-2 rounded-md border border-zinc-800" />
                     <input value={camp?.earlyBirdDeadline ? new Date(camp.earlyBirdDeadline).toISOString().split('T')[0] : ''} type="date" onChange={e => setCamp(c => ({...c, earlyBirdDeadline: new Date(e.target.value)}))} placeholder="Крайний срок" className="bg-v-card p-2 rounded-md border border-zinc-800" />
                </div>
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

            <button type="submit" disabled={saving} className="bg-v-accent text-white px-6 py-3 rounded-lg w-full disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin mx-auto" /> : 'Сохранить'}
            </button>
        </form>
    );
}
