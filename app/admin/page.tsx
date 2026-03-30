import { TrendingUp, Users, Tent, GraduationCap, ArrowUpRight, Activity } from "lucide-react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { format } from 'date-fns';

async function getDashboardData() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        revenueData,
        userCount,
        campCount,
        courseCount,
        recentPayments,
        pendingVideos
    ] = await Promise.all([
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'succeeded', createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.user.count(),
        prisma.camp.count({ where: { status: 'published' } }),
        prisma.course.count({ where: { status: 'published' } }),
        prisma.payment.findMany({
            where: { status: 'succeeded' },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true, booking: { include: { camp: true } } }
        }),
        prisma.videoReview.findMany({
            where: { status: 'pending' },
            take: 4,
            orderBy: { createdAt: 'desc' },
            include: { 
                user: true, 
                courseDay: { 
                    include: { 
                        week: {
                            include: {
                                course: true
                            }
                        }
                    } 
                } 
            }
        })
    ]);
    
    const totalRevenue = revenueData._sum.amount || 0;

    return {
        totalRevenue,
        userCount,
        campCount,
        courseCount,
        recentPayments,
        pendingVideos
    };
}


export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    { title: "Выручка", value: `${(data.totalRevenue / 100).toLocaleString('ru-RU')} ₽`, icon: TrendingUp, detail: "за 30 дней" },
    { title: "Пользователи", value: data.userCount.toLocaleString('ru-RU'), icon: Users, detail: "Всего в системе" },
    { title: "Активные кэмпы", value: data.campCount, icon: Tent, detail: "опубликовано" },
    { title: "Активные курсы", value: data.courseCount, icon: GraduationCap, detail: "программ" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 bg-[#FF2D2D] rounded-full" />
                <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Dashboard</h1>
            </div>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest ml-5">Обзор основных показателей платформы</p>
        </div>
        <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-3 self-start">
            <Activity className="w-4 h-4 text-v-accent" />
            <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Статус системы: <span className="text-green-500">Онлайн</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-white/5 rounded-[32px] p-8 space-y-4 hover:border-[#FF2D2D]/30 transition-all group">
                <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#FF2D2D]/10 transition-colors">
                        <stat.icon className="w-6 h-6 text-[#FF2D2D]" />
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-black italic tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase mt-1">{stat.detail}</div>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Последние платежи</h3>
                <Link href="/admin/payments" className="text-[10px] font-black uppercase text-[#FF2D2D] hover:underline flex items-center gap-2">Все транзакции <ArrowUpRight className="w-3 h-3" /></Link>
              </div>
              <div className="space-y-6">
                  {data.recentPayments.map(payment => (
                      <div key={payment.id} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center">
                                <img src={payment.user.photoUrl || '/default-avatar.png'} alt={payment.user.firstName || 'User'} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                  <div className="text-sm font-black uppercase italic">{payment.user.firstName} {payment.user.lastName}</div>
                                  <div className="text-[11px] text-white/40 font-bold uppercase">{payment.booking?.camp.title || 'Покупка курса'}</div>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="text-base font-black italic">{(payment.amount / 100).toLocaleString('ru-RU')} ₽</div>
                              <div className="text-[9px] text-[#1DB954] font-black uppercase tracking-widest">Успешно</div>
                          </div>
                      </div>
                  ))}
                  {data.recentPayments.length === 0 && <p className="text-center text-sm text-white/40">Пока нет успешных платежей.</p>}
              </div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-[40px] p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Проверка видео</h3>
                <button className="text-[10px] font-black uppercase text-[#FF2D2D] hover:underline flex items-center gap-2">Открыть очередь <ArrowUpRight className="w-3 h-3" /></button>
              </div>
              <div className="space-y-6">
                  {data.pendingVideos.map(review => (
                      <div key={review.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                              <div className="w-14 h-10 rounded-xl bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center">
                                <img src={review.user.photoUrl || '/default-avatar.png'} alt={review.user.firstName || 'User'} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                  <div className="text-sm font-black uppercase italic">{review.user.firstName} {review.user.lastName}</div>
                                  <div className="text-[11px] text-white/40 font-bold uppercase">{review.courseDay.week.course.title} · День {review.courseDay.dayNumber}</div>
                              </div>
                          </div>
                          <button className="bg-[#FF2D2D] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-[#FF2D2D]/20">
                            Проверить
                          </button>
                      </div>
                  ))}
                  {data.pendingVideos.length === 0 && <p className="text-center text-sm text-white/40">Нет видео на проверку.</p>}
              </div>
          </div>
      </div>
    </div>
  );
}
