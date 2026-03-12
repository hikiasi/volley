import { PrismaClient, CampStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const ensoLevels = [
    { name: 'Shoshin', minPoints: 0, maxPoints: 1000, orderIndex: 1 },
    { name: 'Shugyosha', minPoints: 1001, maxPoints: 3000, orderIndex: 2 },
    { name: 'Jukuren', minPoints: 3001, maxPoints: 7000, orderIndex: 3 },
    { name: 'Satori', minPoints: 7001, maxPoints: null, orderIndex: 4 },
  ];

  for (const level of ensoLevels) {
    await prisma.ensoLevel.upsert({
      where: { name: level.name },
      update: level,
      create: level,
    });
  }

  const camps = [
    {
      slug: 'moscow-october-2024',
      title: 'Москва · Октябрь',
      city: 'Москва',
      level: 'Shoshin',
      startDate: new Date('2024-10-12'),
      endDate: new Date('2024-10-14'),
      durationDays: 3,
      basePrice: 1500000, // 15,000 RUB
      maxParticipants: 25,
      currentParticipants: 18,
      status: CampStatus.published,
      hotMessage: '🔥 Спец-кэмп «Power Jump» · −10% до 12.10',
      whatsIncluded: ['3 дня тренировок', 'Проживание в отеле 4*', 'Спортивная страховка', 'Памятная футболка'],
      whatToBring: ['Спортивная форма (2 комплекта)', 'Волейбольные кроссовки', 'Средства личной гигиены', 'Хорошее настроение'],
      description: 'Интенсивный курс подготовки к прыжку и атакующему удару. В программе: биомеханика прыжка, работа над взрывной силой и техникой съема.',
      venueName: 'Спорткомплекс Динамо',
      address: 'Москва, ул. Лётчика Бабушкина, 23',
    },
    {
      slug: 'spb-november-2024',
      title: 'Санкт-Петербург · Ноябрь',
      city: 'Санкт-Петербург',
      level: 'Shugyosha',
      startDate: new Date('2024-11-05'),
      endDate: new Date('2024-11-07'),
      durationDays: 3,
      basePrice: 1800000,
      maxParticipants: 20,
      currentParticipants: 5,
      status: CampStatus.published,
      whatsIncluded: ['2 тренировки в день', 'Анализ техники по видео', 'Проживание и завтраки'],
      whatToBring: ['Форма', 'Обувь для зала', 'Вода'],
      description: 'Кэмп для игроков среднего уровня. Фокус на командном взаимодействии и тактике игры.',
    },
    {
      slug: 'sochi-december-2024',
      title: 'Сочи · Декабрь',
      city: 'Сочи',
      level: 'Jukuren',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-27'),
      durationDays: 7,
      basePrice: 4500000,
      maxParticipants: 30,
      currentParticipants: 12,
      status: CampStatus.published,
    }
  ]

  for (const camp of camps) {
    await prisma.camp.upsert({
      where: { slug: camp.slug },
      update: camp,
      create: camp,
    })
  }

  const courses = [
    {
      slug: 'jump-pro-6-weeks',
      title: 'Прыжок PRO',
      category: 'jump',
      expectedResult: '+8–12 см',
      level: 'intermediate',
      durationWeeks: 6,
      minutesPerDay: '45 мин',
      price: 490000, // 4,900 RUB
      status: 'published',
      isFeatured: true,
    },
    {
      slug: 'speed-elite',
      title: 'Взрывная скорость',
      category: 'speed',
      expectedResult: '−0.2с на 30м',
      level: 'advanced',
      durationWeeks: 4,
      minutesPerDay: '30 мин',
      price: 350000,
      status: 'published',
    },
    {
      slug: 'free-warmup',
      title: 'Базовая разминка',
      category: 'free',
      expectedResult: 'Без травм',
      level: 'beginner',
      durationWeeks: 1,
      minutesPerDay: '15 мин',
      price: 0,
      status: 'published',
    }
  ]

  for (const course of courses) {
    const createdCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: course as any,
      create: course as any,
    });

    if (course.slug === 'jump-pro-6-weeks') {
        const week = await prisma.courseWeek.upsert({
            where: { courseId_weekNumber: { courseId: createdCourse.id, weekNumber: 1 } },
            update: { title: 'Фундамент и техника' },
            create: { courseId: createdCourse.id, weekNumber: 1, title: 'Фундамент и техника' }
        });

        const day = await prisma.courseDay.upsert({
            where: { weekId_dayNumber: { weekId: week.id, dayNumber: 1 } },
            update: { title: 'Тестирование и база', isFree: true },
            create: { weekId: week.id, dayNumber: 1, title: 'Тестирование и база', isFree: true }
        });

        const exercises = [
            { title: 'МФР стопы', category: 'warmup', section: 'warmup' },
            { title: 'Приседания со штангой', category: 'main', section: 'main' },
            { title: 'Прыжки на тумбу', category: 'plyometric', section: 'plyometric' }
        ];

        for (const exData of exercises) {
            const ex = await prisma.exercise.create({
                data: {
                    title: exData.title,
                    category: exData.category as any,
                    difficulty: 'medium'
                }
            });

            await prisma.courseDayExercise.create({
                data: {
                    courseDayId: day.id,
                    exerciseId: ex.id,
                    section: exData.section,
                    orderIndex: 1
                }
            });
        }
    }
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
