import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getCamps() {
    const camps = await prisma.camp.findMany({
        orderBy: {
            startDate: 'desc',
        }
    });
    return camps;
}

export default async function AdminCampsPage() {
    const camps = await getCamps();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Кэмпы</h1>
                <Link href="/admin/camps/new" className="bg-v-accent text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Создать кэмп</span>
                </Link>
            </div>
            <div className="overflow-x-auto">
                <div className="bg-v-card rounded-lg border border-zinc-800">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="border-b border-zinc-800">
                            <tr>
                                <th className="p-4 text-sm font-semibold">Название</th>
                                <th className="p-4 text-sm font-semibold">Даты</th>
                                <th className="p-4 text-sm font-semibold">Статус</th>
                                <th className="p-4 text-sm font-semibold">Участники</th>
                                <th className="p-4 text-sm font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {camps.map(camp => (
                                <tr key={camp.id} className="border-b border-zinc-800 last:border-b-0">
                                    <td className="p-4">{camp.title}</td>
                                    <td className="p-4">{new Date(camp.startDate).toLocaleDateString('ru-RU')} - {new Date(camp.endDate).toLocaleDateString('ru-RU')}</td>
                                    <td className="p-4">{camp.status}</td>
                                    <td className="p-4">{camp.currentParticipants} / {camp.maxParticipants}</td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/camps/${camp.id}/edit`} className="text-v-accent hover:underline">
                                            Редактировать
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
