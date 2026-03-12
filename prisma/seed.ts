import { PrismaClient, CampStatus, CourseCategory, CourseLevel, UserRole, ExerciseCategory, ExerciseDifficulty, CourseStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 0. Clean up existing data
  await prisma.courseDayExercise.deleteMany({});
  await prisma.userExerciseProgress.deleteMany({});
  await prisma.userDayProgress.deleteMany({});
  await prisma.videoReview.deleteMany({});
  await prisma.courseDay.deleteMany({});
  await prisma.courseWeek.deleteMany({});
  await prisma.userCourse.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.campTrainer.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.campDayOption.deleteMany({});
  await prisma.campDay.deleteMany({});
  await prisma.camp.deleteMany({});

  // 1. Enso Levels
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

  // 2. Trainers
  const trainers = [
    {
      name: 'Алексей Волков',
      bio: 'Главный тренер VOLLEYDZEN. 10 лет опыта в профессиональном волейболе.',
      specialization: 'Прыжок и атака',
    },
    {
      name: 'Дмитрий Соколов',
      bio: 'Специалист по ОФП и скоростно-силовой подготовке.',
      specialization: 'Скорость и выносливость',
    },
    {
      name: 'Мария Кузнецова',
      bio: 'Тренер по технике защиты и приема.',
      specialization: 'Защита и прием',
    }
  ];

  const createdTrainers = [];
  for (const t of trainers) {
    const trainer = await prisma.trainer.create({ data: t });
    createdTrainers.push(trainer);
  }

  // 3. Camps
  const camps = [
    {
      slug: 'moscow-oct-2024',
      title: 'Кэмп Москва · Октябрь',
      city: 'Москва',
      level: 'Shoshin',
      startDate: new Date('2024-10-12'),
      endDate: new Date('2024-10-14'),
      durationDays: 3,
      basePrice: 2990000, // 29,900 RUB
      depositAmount: 500000, // 5,000 RUB
      maxParticipants: 24,
      currentParticipants: 17,
      status: CampStatus.published,
      hotMessage: '🔥 Парковка на территории бесплатная для участников',
      whatsIncluded: ['3 дня интенсивных тренировок', 'Проживание в отеле 4*', 'Трехразовое питание', 'Спортивная страховка', 'Фирменная джерси'],
      whatToBring: ['Волейбольная форма (3 комплекта)', 'Кроссовки для зала', 'Наколенники', 'Бутылка для воды'],
      description: 'Интенсивный курс для начинающих игроков. Фокус на базовой технике перемещений, подаче и приеме.',
      venueName: 'Спорткомплекс «Луч»',
      address: 'Москва, ул. Лётчика Бабушкина, 23',
      assemblyTime: new Date('1970-01-01T09:30:00Z'),
      startTime: new Date('1970-01-01T10:00:00Z'),
      organizerPhone: '+7 999 123 45 67',
      organizerTelegram: '@volleydzen_admin',
    },
    {
      slug: 'spb-nov-2024',
      title: 'Кэмп Санкт-Петербург · Ноябрь',
      city: 'Санкт-Петербург',
      level: 'Shugyosha',
      startDate: new Date('2024-11-15'),
      endDate: new Date('2024-11-17'),
      durationDays: 3,
      basePrice: 3290000,
      depositAmount: 700000,
      maxParticipants: 20,
      currentParticipants: 8,
      status: CampStatus.published,
      hotMessage: '📍 Центр города, 5 минут от метро',
      whatsIncluded: ['Программа «Связующий + Атака»', 'Видео-анализ техники', 'Завтраки включены'],
      whatToBring: ['Форма', 'Кроссовки', 'Хорошее настроение'],
      description: 'Кэмп среднего уровня. Разбираем связки, тактику нападения и взаимодействия на блоке.',
    }
  ];

  for (const cData of camps) {
    const camp = await prisma.camp.upsert({
      where: { slug: cData.slug },
      update: cData as any,
      create: cData as any,
    });

    // Link trainers to camps
    await prisma.campTrainer.create({
      data: {
        campId: camp.id,
        trainerId: createdTrainers[0].id
      }
    });
  }

  // 4. Exercises Library
  const exercises = [
    { title: 'МФР голени', category: ExerciseCategory.warmup, difficulty: ExerciseDifficulty.easy, vimeoVideoId: '123456789' },
    { title: 'Динамическая растяжка', category: ExerciseCategory.warmup, difficulty: ExerciseDifficulty.easy, vimeoVideoId: '987654321' },
    { title: 'Приседания со штангой', category: ExerciseCategory.main, difficulty: ExerciseDifficulty.medium, vimeoVideoId: '111222333' },
    { title: 'Прыжки на тумбу 60см', category: ExerciseCategory.plyometric, difficulty: ExerciseDifficulty.hard, vimeoVideoId: '444555666' },
    { title: 'Заминка и МФР спины', category: ExerciseCategory.cooldown, difficulty: ExerciseDifficulty.easy, vimeoVideoId: '777888999' },
    { title: 'Тест: CMJ (прыжок вверх)', category: ExerciseCategory.test, difficulty: ExerciseDifficulty.medium, vimeoVideoId: '000111222' },
  ];

  const createdExercises = [];
  for (const ex of exercises) {
    const createdEx = await prisma.exercise.create({ data: ex });
    createdExercises.push(createdEx);
  }

  // 5. Courses
  const courses = [
    {
      slug: 'jump-pro-6weeks',
      title: 'Прыжок PRO — 6 недель',
      category: CourseCategory.jump,
      expectedResult: '+8-12 см к прыжку',
      level: CourseLevel.intermediate,
      durationWeeks: 6,
      minutesPerDay: '30-45 мин/день',
      price: 490000, // 4,900 RUB
      installmentPrice: 150000,
      status: CourseStatus.published,
      isFeatured: true,
      requirements: 'Без болей в коленях и спине. Наличие штанги или гантелей.',
      suitableFor: ['Волейболистов любого уровня', 'Баскетболистов', 'Желающих увеличить взрывную силу'],
      notSuitableFor: ['Людей с серьезными травмами суставов', 'В период реабилитации'],
      trainerId: createdTrainers[0].id,
    },
    {
      slug: 'speed-100-8weeks',
      title: 'Скорость 100 — 8 недель',
      category: CourseCategory.speed,
      expectedResult: 'Ускорение реакции и рывка',
      level: CourseLevel.advanced,
      durationWeeks: 8,
      minutesPerDay: '20-30 мин/день',
      price: 390000,
      status: CourseStatus.published,
      trainerId: createdTrainers[1].id,
    }
  ];

  for (const cData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: cData.slug },
      update: cData as any,
      create: cData as any,
    });

    // Create Weeks and Days for Jump Pro
    if (course.slug === 'jump-pro-6weeks') {
      for (let w = 1; w <= 6; w++) {
        const week = await prisma.courseWeek.create({
          data: {
            courseId: course.id,
            weekNumber: w,
            title: `Неделя ${w}: Фундамент силы`,
            isFree: w === 1,
          }
        });

        for (let d = 1; d <= 3; d++) {
          const day = await prisma.courseDay.create({
            data: {
              weekId: week.id,
              dayNumber: d,
              title: `День ${d}: Взрывная тренировка`,
              isFree: w === 1 && d === 1,
            }
          });

          // Add Exercises to Day
          for (let e = 0; e < createdExercises.length; e++) {
             await prisma.courseDayExercise.create({
               data: {
                 courseDayId: day.id,
                 exerciseId: createdExercises[e].id,
                 section: createdExercises[e].category.toLowerCase(),
                 orderIndex: e,
                 sets: 3,
                 reps: 10,
                 restSecs: 60,
               }
             });
          }
        }
      }
    }
  }

  console.log('Seed completed successfully with realistic data.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
