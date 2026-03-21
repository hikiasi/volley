import { PrismaClient, CampStatus, CourseCategory, CourseLevel, UserRole, PlayLevel, ExerciseCategory, ExerciseDifficulty, CourseStatus, BookingStatus, PaymentType, PaymentStatus as PaymentStatusEnum, DiscountType, ApplicableTo } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/ru';

const prisma = new PrismaClient()

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log("🔥 Start seeding...");

  // Clean up existing data in order
  console.log("🧹 Cleaning up old data...");
  await prisma.chatMessage.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.promoCodeUsage.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.waitlistEntry.deleteMany({});
  await prisma.campTrainer.deleteMany({});
  await prisma.campDay.deleteMany({});
  await prisma.camp.deleteMany({});
  await prisma.userCourse.deleteMany({});
  await prisma.courseDayExercise.deleteMany({});
  await prisma.courseDay.deleteMany({});
  await prisma.courseWeek.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ensoLevel.deleteMany({});
  await prisma.promoCode.deleteMany({});
  console.log("✅ Old data cleaned up.");

  // 1. Enso Levels
  const ensoLevelData = [
    { id: "cl1", name: 'Shoshin', minPoints: 0, maxPoints: 1000, orderIndex: 1, description: "Начинающий" },
    { id: "cl2", name: 'Shugyosha', minPoints: 1001, maxPoints: 3000, orderIndex: 2, description: "Практикующий" },
    { id: "cl3", name: 'Jukuren', minPoints: 3001, maxPoints: 7000, orderIndex: 3, description: "Опытный" },
    { id: "cl4", name: 'Satori', minPoints: 7001, maxPoints: null, orderIndex: 4, description: "Мастер" },
  ];
  await prisma.ensoLevel.createMany({ data: ensoLevelData });
  console.log("🌱 Seeded Enso levels.");

  // 2. Trainers
  const trainerData = [
    { id: "tr1", name: 'Алексей Волков', bio: 'Главный тренер VOLLEYDZEN. 10 лет опыта в профессиональном волейболе.', specialization: 'Прыжок и атака', photoUrl: 'https://images.unsplash.com/photo-1574634534894-89d757d93249?auto=format&fit=crop&w=200&q=80' },
    { id: "tr2", name: 'Дмитрий Соколов', bio: 'Специалист по ОФП и скоростно-силовой подготовке.', specialization: 'Скорость и выносливость', photoUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=200&q=80' },
    { id: "tr3", name: 'Мария Кузнецова', bio: 'Тренер по технике защиты и приема.', specialization: 'Защита и прием', photoUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&q=80' },
  ];
  await prisma.trainer.createMany({ data: trainerData });
  const createdTrainers = await prisma.trainer.findMany();
  console.log("🌱 Seeded trainers.");
  
  // 3. Users
  const userData = [];
  for (let i = 0; i < 15; i++) {
    userData.push({
      id: `user${i+1}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      telegramId: faker.number.int({ min: 100000, max: 999999 }),
      role: UserRole.user,
      playLevel: getRandomItem(Object.values(PlayLevel)),
      ensoLevelId: getRandomItem(ensoLevelData).id,
      ensoPoints: faker.number.int({ min: 0, max: 8000 }),
      photoUrl: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80&${i}`
    });
  }
  userData.push({ id: `user16`, firstName: 'Admin', lastName: 'User', email: 'admin@volleydzen.com', telegramId: 99999999, role: UserRole.admin, ensoLevelId: ensoLevelData[3].id });
  userData.push({ id: `user17`, firstName: 'Trainer', lastName: 'User', email: 'trainer@volleydzen.com', telegramId: 88888888, role: UserRole.trainer, ensoLevelId: ensoLevelData[2].id });
  
  await prisma.user.createMany({ data: userData });
  const createdUsers = await prisma.user.findMany();
  console.log("🌱 Seeded users.");

  // 4. Camps
  const campData = [
    { id: "camp1", slug: 'moscow-oct-2024', title: 'Кэмп Москва · Октябрь', city: 'Москва', level: 'Shoshin', startDate: new Date('2024-10-12'), endDate: new Date('2024-10-14'), durationDays: 3, basePrice: 2990000, maxParticipants: 24, currentParticipants: 17, status: CampStatus.published, coverImageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80', description: 'Интенсивный курс для начинающих игроков.', whatsIncluded: ['Тренировки', 'Проживание', 'Питание'], whatToBring: ['Форма', 'Кроссовки'] },
    { id: "camp2", slug: 'spb-nov-2024', title: 'Кэмп Санкт-Петербург · Ноябрь', city: 'Санкт-Петербург', level: 'Shugyosha', startDate: new Date('2024-11-15'), endDate: new Date('2024-11-17'), durationDays: 3, basePrice: 3290000, maxParticipants: 20, currentParticipants: 8, status: CampStatus.published, coverImageUrl: 'https://images.unsplash.com/photo-1551773487-95e7d5dc5343?auto=format&fit=crop&w=800&q=80', description: 'Кэмп среднего уровня.' , whatsIncluded: ['Тренировки', 'Видео-анализ'], whatToBring: ['Форма', 'Наколенники'] },
    { id: "camp3", slug: 'sochi-dec-2024', title: 'Кэмп Сочи · Декабрь', city: 'Сочи', level: 'Jukuren', startDate: new Date('2024-12-20'), endDate: new Date('2024-12-22'), durationDays: 3, basePrice: 3490000, maxParticipants: 16, currentParticipants: 16, status: CampStatus.full, coverImageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80', description: 'Продвинутый кэмп для опытных игроков.', whatsIncluded: ['Тренировки', 'Тактика', 'Психология'], whatToBring: ['Все необходимое'] },
    { id: "camp4", slug: 'kazan-jan-2025', title: 'Кэмп Казань · Январь', city: 'Казань', level: 'Satori', startDate: new Date('2025-01-10'), endDate: new Date('2025-01-12'), durationDays: 3, basePrice: 3990000, maxParticipants: 12, currentParticipants: 5, status: CampStatus.published, coverImageUrl: 'https://images.unsplash.com/photo-1562886889-6d6f24c3a5d3?auto=format&fit=crop&w=800&q=80', description: 'Элитный кэмп для мастеров.', whatsIncluded: ['Все включено'], whatToBring: ['Только себя']}
  ];
  await prisma.camp.createMany({ data: campData });
  const createdCamps = await prisma.camp.findMany();
  console.log("🌱 Seeded camps.");

  for (const camp of createdCamps) {
    await prisma.campDay.createMany({
        data: [ { campId: camp.id, dayNumber: 1, title: 'День 1: Техника', description: 'Отработка базовых элементов.'}, { campId: camp.id, dayNumber: 2, title: 'День 2: Тактика', description: 'Изучение игровых схем.'}, { campId: camp.id, dayNumber: 3, title: 'День 3: Игра', description: 'Игровые упражнения и матчи.'}, ]
    });
    await prisma.campTrainer.create({ data: { campId: camp.id, trainerId: getRandomItem(createdTrainers).id } });
  }
  console.log("🌱 Seeded camp days & trainers.");
  
  // 5. Courses and Exercises
  const exerciseData = [
    { id:'ex1', title: 'МФР голени', category: ExerciseCategory.warmup, difficulty: ExerciseDifficulty.easy, vimeoVideoId: '123456789' },
    { id:'ex2', title: 'Динамическая растяжка', category: ExerciseCategory.warmup, difficulty: ExerciseDifficulty.easy, vimeoVideoId: '987654321' },
    { id:'ex3', title: 'Приседания со штангой', category: ExerciseCategory.main, difficulty: ExerciseDifficulty.medium, vimeoVideoId: '111222333' },
    { id:'ex4', title: 'Прыжки на тумбу 60см', category: ExerciseCategory.plyometric, difficulty: ExerciseDifficulty.hard, vimeoVideoId: '444555666' },
  ];
  await prisma.exercise.createMany({ data: exerciseData });

  const courseData = [
    { id: "course1", slug: 'jump-pro-6weeks', title: 'Прыжок PRO — 6 недель', category: CourseCategory.jump, level: CourseLevel.intermediate, durationWeeks: 6, price: 490000, trainerId: trainerData[0].id, coverImageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80' },
    { id: "course2", slug: 'speed-100-8weeks', title: 'Скорость 100 — 8 недель', category: CourseCategory.speed, level: CourseLevel.advanced, durationWeeks: 8, price: 390000, trainerId: trainerData[1].id, coverImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80' },
  ];
  await prisma.course.createMany({ data: courseData });
  const createdCourses = await prisma.course.findMany();
  console.log("🌱 Seeded courses & exercises.");

  // 6. Relational Data
  // Bookings & Payments
  for (let i = 0; i < 5; i++) {
    const user = createdUsers[i];
    const camp = getRandomItem(createdCamps.filter(c => c.status === CampStatus.published));
    const booking = await prisma.booking.create({
        data: { userId: user.id, campId: camp.id, status: BookingStatus.fully_paid, paymentType: PaymentType.full, totalAmount: camp.basePrice, paidAmount: camp.basePrice, baseAmount: camp.basePrice }
    });
    await prisma.payment.create({ data: { bookingId: booking.id, userId: user.id, amount: camp.basePrice, status: PaymentStatusEnum.succeeded, yookassaPaymentId: faker.string.uuid() }});
  }
  console.log("🌱 Seeded bookings and payments.");

  // User Courses
  for (let i = 0; i < 3; i++) {
    const user = createdUsers[i];
    const course = getRandomItem(createdCourses);
    await prisma.userCourse.create({ data: { userId: user.id, courseId: course.id, status: 'active', progress: faker.number.int({min: 10, max: 90}) }});
  }
  console.log("🌱 Seeded user courses.");

  // Chat Messages
  const campForChat = createdCamps[0];
  for (let i = 0; i < 10; i++) {
      const user = getRandomItem(createdUsers.filter(u => u.role === UserRole.user));
      await prisma.chatMessage.create({
          data: { campId: campForChat.id, userId: user.id, text: faker.lorem.sentence() }
      });
  }
  console.log("🌱 Seeded chat messages.");

  // Notifications
  for (let i = 0; i < 5; i++) {
      await prisma.notification.create({
          data: { userId: createdUsers[i].id, title: "Добро пожаловать!", body: "Рады видеть вас в VOLLEYDZEN.", type: "welcome" }
      });
  }
  console.log("🌱 Seeded notifications.");
  
  // Promo Codes
  const adminUser = createdUsers.find(u => u.role === 'admin');
  if (adminUser) {
    await prisma.promoCode.create({
      data: {
        code: 'SALE20',
        discountType: DiscountType.percentage,
        discountValue: 20,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        applicableTo: ApplicableTo.all,
        createdByAdminId: adminUser.id,
      }
    });
  }
  console.log("🌱 Seeded promo codes.");

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ An error occurred during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

