"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type CampData = {
    id?: string; // Optional for new camps
    title: string;
    slug: string;
    city: string;
    address: string;
    basePrice: number;
    earlyBirdPrice?: number | null;
    earlyBirdCutoff?: Date | null;
    maxParticipants: number;
    description?: string;
    coverImageUrl?: string;
    whatToBring?: string[];
    whatsIncluded?: string[];
    customSections?: { title: string; content: string }[];
    memoUrl?: string;
    participantsChatUrl?: string;
    icsFileUrl?: string;
    hotMessage?: string;
    status: string; // published, draft etc.
};

interface CampFormProps {
    isOpen: boolean;
    onClose: () => void;
    camp?: CampData | null; // For editing
    onSave: () => void;
}

export function CampForm({ isOpen, onClose, camp, onSave }: CampFormProps) {
    const [formData, setFormData] = useState<CampData>(camp || {
        title: '',
        slug: '',
        city: '',
        address: '',
        basePrice: 0,
        maxParticipants: 0,
        status: 'draft',
        customSections: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (camp) {
            setFormData({
                ...camp,
                earlyBirdCutoff: camp.earlyBirdCutoff ? new Date(camp.earlyBirdCutoff) : null,
            });
        }
    }, [camp]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseInt(value) : (type === 'checkbox' ? checked : value)
        }));
    };

    const handleCustomSectionChange = (index: number, field: 'title' | 'content', value: string) => {
        setFormData(prev => {
            const sections = [...(prev.customSections || [])];
            sections[index] = { ...sections[index], [field]: value };
            return { ...prev, customSections: sections };
        });
    };

    const addCustomSection = () => {
        setFormData(prev => ({
            ...prev,
            customSections: [...(prev.customSections || []), { title: '', content: '' }]
        }));
    };

    const removeCustomSection = (index: number) => {
        setFormData(prev => ({
            ...prev,
            customSections: (prev.customSections || []).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = formData.id ? `/api/admin/camps/${formData.id}` : '/api/admin/camps';
            const method = formData.id ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Кэмп успешно сохранен!');
                onSave();
                onClose();
            } else {
                const errorData = await res.json();
                alert(`Ошибка: ${errorData.error || 'Неизвестная ошибка'}`);
            }
        } catch (error) {
            alert('Произошла сетевая ошибка.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{camp ? 'Редактировать кэмп' : 'Создать новый кэмп'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input id="title" label="Название кэмпа" value={formData.title} onChange={handleChange} required />
                    <Input id="slug" label="Slug (для URL)" value={formData.slug} onChange={handleChange} required />
                    <Textarea id="description" label="Описание" value={formData.description || ''} onChange={handleChange} />
                    <Input id="city" label="Город" value={formData.city} onChange={handleChange} required />
                    <Input id="address" label="Адрес" value={formData.address} onChange={handleChange} />
                    <Input id="basePrice" label="Базовая цена (₽)" type="number" value={formData.basePrice / 100} onChange={handleChange} required />

                    <div className="grid grid-cols-2 gap-4">
                        <Input id="earlyBirdPrice" label="Ранняя цена (₽)" type="number" value={(formData.earlyBirdPrice || 0) / 100} onChange={handleChange} />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={"w-full justify-start text-left font-normal " + (!formData.earlyBirdCutoff && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.earlyBirdCutoff ? format(formData.earlyBirdCutoff, "PPP") : <span>Дата окончания ранней цены</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.earlyBirdCutoff || undefined}
                                    onSelect={(date) => setFormData(prev => ({ ...prev, earlyBirdCutoff: date || null }))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Input id="maxParticipants" label="Макс. участников" type="number" value={formData.maxParticipants} onChange={handleChange} required />
                    
                    <div>
                        <Label htmlFor="status">Статус</Label>
                        <select id="status" value={formData.status} onChange={handleChange} className="w-full bg-background border rounded-lg p-2">
                            <option value="draft">Черновик</option>
                            <option value="published">Опубликован</option>
                            <option value="full">Полный</option>
                            <option value="completed">Завершен</option>
                        </select>
                    </div>

                    {/* Custom Sections */}
                    <h3 className="font-bold mt-6">Дополнительные секции</h3>
                    {(formData.customSections || []).map((section, index) => (
                        <div key={index} className="border p-3 rounded-md space-y-2 relative">
                            <Input
                                label="Заголовок секции"
                                value={section.title}
                                onChange={(e) => handleCustomSectionChange(index, 'title', e.target.value)}
                            />
                            <Textarea
                                label="Содержимое секции"
                                value={section.content}
                                onChange={(e) => handleCustomSectionChange(index, 'content', e.target.value)}
                            />
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeCustomSection(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addCustomSection} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Добавить секцию
                    </Button>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                        Сохранить
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Re-export shadcn components if they are used directly in other files
export { Input, Textarea, Button, Label, Switch };
