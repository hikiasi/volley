import { cookies } from "next/headers";
import Link from "next/link";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import {
  ChevronRight,
  Award,
  Calendar,
  PlayCircle,
  CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProfileClientActions } from "@/components/profile/ProfileClientActions";

async function getProfileData() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.sub;

        if (!userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                bookings: {
                    include: {
                        camp: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                userCourses: true,
                ensoLevel: true,
            }
        });

        if (!user) return null;
        
        // Ensure BigInts are converted to strings for client components
        return JSON.parse(JSON.stringify(user, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

    } catch (err) {
        console.error("Profile data fetch error:", err);
        return null;
    }
}

export default async function ProfilePage() {
  const user = await getProfileData();

  if (!user) {
    return (
      <div className="min-h-screen bg-enso-black flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-xl font-bold mb-4 uppercase">Вы не авторизованы</h1>
        <Link href="/auth/login" className="bg-enso-red text-white px-8 py-3 rounded-2xl font-bold uppercase text-sm">
            Войти
        </Link>
      </div>
    );
  }

  const ensoPoints = user.ensoPoints || 0;
  const nextLevelPoints = 2000; // Mock
  const ensoProgress = Math.round((ensoPoints / nextLevelPoints) * 100);
  const strokeDashoffset = 251.2 * (1 - ensoProgress / 100);

  return (
    <main className="max-w-md mx-auto px-4 pt-6 pb-28">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <img alt="Avatar" className="w-full h-full object-cover rounded-full border-2 border-v-accent p-1" src={user.photoUrl || '/default-avatar.png'} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.firstName} {user.lastName || ''}</h1>
            <p className="text-v-text-muted text-sm">Подтвержденный: <span className="text-v-green">{user.ensoLevel?.name || 'Новичок'}</span></p>
          </div>
        </div>
        <Link href="/profile/edit" className="text-v-accent text-sm font-medium">Редактировать</Link>
      </header>

      <section className="mb-10">
        <h2 className="text-xs font-bold text-v-text-muted uppercase tracking-widest mb-4">ПУТЬ ЭНСО</h2>
        <div className="bg-v-card rounded-3xl p-6 flex items-center justify-between border border-zinc-800">
          <div className="flex-1">
            <p className="text-v-text-muted text-xs mb-1 uppercase tracking-tight">Текущий уровень</p>
            <h3 className="text-xl font-bold mb-4">Играющий</h3>
            <Link href="/enso" className="mt-6 bg-white/5 hover:bg-white/10 text-v-accent text-sm font-bold py-3 px-6 rounded-2xl transition-colors">
              Продолжить путь
            </Link>
          </div>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-white/10" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
              <circle className="text-v-accent" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="8" style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%'}}></circle>
            </svg>
            <div className="absolute text-center">
              <span className="block text-[10px] text-v-text-muted">Ранг</span>
              <span className="text-lg font-bold">{user.ensoLevel?.orderIndex || 1}/10</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-2">
           {[
             { icon: PlayCircle, label: "Моё обучение", href: "/courses", count: user.userCourses?.length || 0 },
             { icon: CreditCard, label: "История оплат", href: "/profile/payments" },
           ].map((item) => (
             <Link key={item.href} href={item.href} className="flex items-center justify-between p-4 bg-v-card rounded-2xl active:scale-[0.98] transition-transform border border-zinc-800">
               <div className="flex items-center gap-3">
                 <item.icon className="w-5 h-5 text-v-text-muted" />
                 <span className="text-sm font-bold uppercase">{item.label}</span>
               </div>
               <div className="flex items-center gap-2">
                {typeof item.count !== 'undefined' && <Badge variant="secondary">{item.count}</Badge>}
                <ChevronRight className="w-4 h-4 text-v-text-muted/50" />
               </div>
             </Link>
           ))}
       </section>
       
       <section className="mt-10">
        <h2 className="text-xs font-bold text-v-text-muted uppercase tracking-widest mb-4">Мои Кэмпы</h2>
        <div className="space-y-3">
          {user.bookings && user.bookings.filter(b => ['pre_booked', 'deposit_paid', 'fully_paid'].includes(b.status)).map(booking => (
            <Link href={`/camps/${booking.camp.slug}`} key={booking.id} className="block bg-v-card rounded-2xl p-4 border border-zinc-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{booking.camp.title}</h3>
                  <p className="text-xs text-v-text-muted">{new Date(booking.camp.startDate).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' })} - {new Date(booking.camp.endDate).toLocaleDateString('ru-RU', { day: 'numeric' })}</p>
                </div>
                <Badge variant={booking.status === 'fully_paid' ? 'default' : 'secondary'}>{booking.status}</Badge>
              </div>
            </Link>
          ))}
          {user.bookings?.filter(b => ['pre_booked', 'deposit_paid', 'fully_paid'].includes(b.status)).length === 0 && (
            <p className="text-sm text-v-text-muted text-center py-4">У вас пока нет активных кэмпов.</p>
          )}
        </div>
       </section>


      <ProfileClientActions isAdmin={user.role === 'admin'} />
    </main>
  );
}
