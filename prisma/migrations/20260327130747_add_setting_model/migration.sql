-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'trainer', 'admin');

-- CreateEnum
CREATE TYPE "PlayLevel" AS ENUM ('beginner', 'amateur', 'advanced', 'pro');

-- CreateEnum
CREATE TYPE "CampStatus" AS ENUM ('draft', 'published', 'full', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pre_booked', 'deposit_paid', 'fully_paid', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('full', 'deposit', 'installment');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'waiting_for_capture', 'succeeded', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('sbp', 'bank_card', 'yoo_money', 'installment');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed_amount');

-- CreateEnum
CREATE TYPE "ApplicableTo" AS ENUM ('all', 'camps', 'courses', 'merch');

-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('jump', 'speed', 'upper_body', 'free');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('warmup', 'main', 'plyometric', 'cooldown', 'test');

-- CreateEnum
CREATE TYPE "ExerciseDifficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "UserCourseStatus" AS ENUM ('active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "VideoReviewStatus" AS ENUM ('pending', 'reviewed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "telegram_id" BIGINT,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "username" VARCHAR(100),
    "photo_url" TEXT,
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "password" TEXT,
    "play_level" "PlayLevel",
    "enso_level_id" TEXT,
    "enso_points" INTEGER NOT NULL DEFAULT 0,
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_active_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_invites" (
    "id" TEXT NOT NULL,
    "invited_by_user_id" TEXT NOT NULL,
    "telegram_id" BIGINT,
    "role" "UserRole" NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camps" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "level" VARCHAR(50) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "venue_name" VARCHAR(255),
    "address" TEXT,
    "lat" DECIMAL(10,8),
    "lng" DECIMAL(11,8),
    "yandex_maps_url" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "base_price" INTEGER NOT NULL,
    "early_bird_price" INTEGER,
    "early_bird_cutoff" TIMESTAMP(3),
    "deposit_amount" INTEGER,
    "max_participants" INTEGER NOT NULL,
    "current_participants" INTEGER NOT NULL DEFAULT 0,
    "status" "CampStatus" NOT NULL DEFAULT 'draft',
    "cover_image_url" TEXT,
    "gallery" JSONB,
    "assembly_time" TIME,
    "start_time" TIME,
    "what_to_bring" JSONB,
    "whats_included" JSONB,
    "custom_sections" JSONB,
    "hot_message" VARCHAR(500),
    "parking_info" TEXT,
    "rating" DECIMAL(3,2),
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "organizer_phone" VARCHAR(20),
    "organizer_telegram" VARCHAR(100),
    "ics_file_url" TEXT,
    "participants_chat_url" TEXT,
    "memo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "camps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camp_days" (
    "id" TEXT NOT NULL,
    "camp_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_optional" BOOLEAN NOT NULL DEFAULT false,
    "extra_price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "camp_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camp_day_options" (
    "id" TEXT NOT NULL,
    "camp_day_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,

    CONSTRAINT "camp_day_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "photo_url" TEXT,
    "specialization" VARCHAR(255),
    "instagram_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camp_trainers" (
    "id" TEXT NOT NULL,
    "camp_id" TEXT NOT NULL,
    "trainer_id" TEXT NOT NULL,

    CONSTRAINT "camp_trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "camp_id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pre_booked',
    "payment_type" "PaymentType" NOT NULL,
    "base_amount" INTEGER NOT NULL,
    "options_amount" INTEGER NOT NULL DEFAULT 0,
    "discount_amount" INTEGER NOT NULL DEFAULT 0,
    "total_amount" INTEGER NOT NULL,
    "paid_amount" INTEGER NOT NULL DEFAULT 0,
    "remaining_amount" INTEGER NOT NULL DEFAULT 0,
    "promo_code_id" TEXT,
    "pre_booked_at" TIMESTAMP(3),
    "pre_book_expires_at" TIMESTAMP(3),
    "pdp_consent" BOOLEAN NOT NULL DEFAULT false,
    "waiver_consent" BOOLEAN NOT NULL DEFAULT false,
    "photo_video_consent" BOOLEAN,
    "selected_day_ids" JSONB,
    "notes" TEXT,
    "receipt_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT,
    "user_course_id" TEXT,
    "user_id" TEXT NOT NULL,
    "yookassa_payment_id" VARCHAR(255),
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'RUB',
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "payment_method" "PaymentMethod",
    "description" TEXT,
    "confirmation_url" TEXT,
    "metadata" JSONB,
    "captured_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_installments" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "payment_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_codes" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" INTEGER NOT NULL,
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "applicable_to" "ApplicableTo" NOT NULL,
    "specific_item_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by_admin_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_code_usages" (
    "id" TEXT NOT NULL,
    "promo_code_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_code_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" "CourseCategory" NOT NULL,
    "description" TEXT,
    "expected_result" VARCHAR(255),
    "level" "CourseLevel" NOT NULL,
    "duration_weeks" INTEGER NOT NULL,
    "minutes_per_day" VARCHAR(50),
    "price" INTEGER NOT NULL,
    "installment_price" INTEGER,
    "cover_image_url" TEXT,
    "preview_video_url" TEXT,
    "trainer_id" TEXT,
    "requirements" TEXT,
    "suitable_for" JSONB,
    "not_suitable_for" JSONB,
    "refund_days" INTEGER NOT NULL DEFAULT 7,
    "status" "CourseStatus" NOT NULL DEFAULT 'draft',
    "rating" DECIMAL(3,2),
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_weeks" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "week_number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "course_weeks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_days" (
    "id" TEXT NOT NULL,
    "week_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "course_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" "ExerciseCategory" NOT NULL,
    "difficulty" "ExerciseDifficulty" NOT NULL,
    "vimeo_video_id" VARCHAR(100),
    "video_duration_seconds" INTEGER,
    "thumbnail_url" TEXT,
    "technique_steps" JSONB,
    "common_mistakes" JSONB,
    "safety_notes" JSONB,
    "sets_default" INTEGER,
    "reps_default" INTEGER,
    "duration_seconds" INTEGER,
    "rest_seconds" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_day_exercises" (
    "id" TEXT NOT NULL,
    "course_day_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "section" VARCHAR(50) NOT NULL,
    "order_index" INTEGER NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "duration_secs" INTEGER,
    "rest_secs" INTEGER,
    "notes" TEXT,

    CONSTRAINT "course_day_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_courses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "status" "UserCourseStatus" NOT NULL DEFAULT 'active',
    "tier" VARCHAR(50),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "current_week" INTEGER NOT NULL DEFAULT 1,
    "current_day" INTEGER NOT NULL DEFAULT 1,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3),

    CONSTRAINT "user_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_day_progress" (
    "id" TEXT NOT NULL,
    "user_course_id" TEXT NOT NULL,
    "course_day_id" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "rpe" INTEGER,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "user_day_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_exercise_progress" (
    "id" TEXT NOT NULL,
    "user_course_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "is_viewed" BOOLEAN NOT NULL DEFAULT false,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "viewed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "user_exercise_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "testType" VARCHAR(50) NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "trainer_id" TEXT NOT NULL,
    "user_course_id" TEXT NOT NULL,
    "course_day_id" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "user_comment" TEXT,
    "rpe" INTEGER,
    "status" "VideoReviewStatus" NOT NULL DEFAULT 'pending',
    "trainer_feedback" TEXT,
    "trainer_video_url" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "action_url" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "variables" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enso_levels" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "min_points" INTEGER NOT NULL,
    "max_points" INTEGER,
    "icon_url" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "enso_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "value" INTEGER NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merch_products" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "image_url" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merch_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merch_orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merch_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offline_trainings" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "max_slots" INTEGER NOT NULL,
    "booked_slots" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offline_trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" TEXT,
    "changes" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "camp_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "camp_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "text" TEXT,
    "type" TEXT NOT NULL DEFAULT 'text',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_invites_token_key" ON "admin_invites"("token");

-- CreateIndex
CREATE UNIQUE INDEX "camps_slug_key" ON "camps"("slug");

-- CreateIndex
CREATE INDEX "camps_status_idx" ON "camps"("status");

-- CreateIndex
CREATE INDEX "camps_start_date_idx" ON "camps"("start_date");

-- CreateIndex
CREATE INDEX "camps_city_idx" ON "camps"("city");

-- CreateIndex
CREATE UNIQUE INDEX "camp_days_camp_id_day_number_key" ON "camp_days"("camp_id", "day_number");

-- CreateIndex
CREATE UNIQUE INDEX "camp_trainers_camp_id_trainer_id_key" ON "camp_trainers"("camp_id", "trainer_id");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_camp_id_idx" ON "bookings"("camp_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_yookassa_payment_id_key" ON "payments"("yookassa_payment_id");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_category_idx" ON "courses"("category");

-- CreateIndex
CREATE INDEX "courses_status_idx" ON "courses"("status");

-- CreateIndex
CREATE UNIQUE INDEX "course_weeks_course_id_week_number_key" ON "course_weeks"("course_id", "week_number");

-- CreateIndex
CREATE UNIQUE INDEX "course_days_week_id_day_number_key" ON "course_days"("week_id", "day_number");

-- CreateIndex
CREATE UNIQUE INDEX "course_day_exercises_course_day_id_exercise_id_order_index_key" ON "course_day_exercises"("course_day_id", "exercise_id", "order_index");

-- CreateIndex
CREATE INDEX "user_courses_user_id_idx" ON "user_courses"("user_id");

-- CreateIndex
CREATE INDEX "user_courses_course_id_idx" ON "user_courses"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_courses_user_id_course_id_key" ON "user_courses"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_day_progress_user_course_id_course_day_id_key" ON "user_day_progress"("user_course_id", "course_day_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_exercise_progress_user_course_id_exercise_id_key" ON "user_exercise_progress"("user_course_id", "exercise_id");

-- CreateIndex
CREATE INDEX "test_results_user_id_testType_idx" ON "test_results"("user_id", "testType");

-- CreateIndex
CREATE INDEX "video_reviews_trainer_id_status_idx" ON "video_reviews"("trainer_id", "status");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_name_key" ON "notification_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "enso_levels_name_key" ON "enso_levels"("name");

-- CreateIndex
CREATE INDEX "user_achievements_user_id_idx" ON "user_achievements"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_user_id_idx" ON "audit_log"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_idx" ON "audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_entries_user_id_camp_id_key" ON "waitlist_entries"("user_id", "camp_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_enso_level_id_fkey" FOREIGN KEY ("enso_level_id") REFERENCES "enso_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_invites" ADD CONSTRAINT "admin_invites_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camp_days" ADD CONSTRAINT "camp_days_camp_id_fkey" FOREIGN KEY ("camp_id") REFERENCES "camps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camp_day_options" ADD CONSTRAINT "camp_day_options_camp_day_id_fkey" FOREIGN KEY ("camp_day_id") REFERENCES "camp_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camp_trainers" ADD CONSTRAINT "camp_trainers_camp_id_fkey" FOREIGN KEY ("camp_id") REFERENCES "camps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camp_trainers" ADD CONSTRAINT "camp_trainers_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_camp_id_fkey" FOREIGN KEY ("camp_id") REFERENCES "camps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_course_id_fkey" FOREIGN KEY ("user_course_id") REFERENCES "user_courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_installments" ADD CONSTRAINT "payment_installments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_code_usages" ADD CONSTRAINT "promo_code_usages_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_code_usages" ADD CONSTRAINT "promo_code_usages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_weeks" ADD CONSTRAINT "course_weeks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_days" ADD CONSTRAINT "course_days_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "course_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_day_exercises" ADD CONSTRAINT "course_day_exercises_course_day_id_fkey" FOREIGN KEY ("course_day_id") REFERENCES "course_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_day_exercises" ADD CONSTRAINT "course_day_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_day_progress" ADD CONSTRAINT "user_day_progress_user_course_id_fkey" FOREIGN KEY ("user_course_id") REFERENCES "user_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_day_progress" ADD CONSTRAINT "user_day_progress_course_day_id_fkey" FOREIGN KEY ("course_day_id") REFERENCES "course_days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exercise_progress" ADD CONSTRAINT "user_exercise_progress_user_course_id_fkey" FOREIGN KEY ("user_course_id") REFERENCES "user_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exercise_progress" ADD CONSTRAINT "user_exercise_progress_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_reviews" ADD CONSTRAINT "video_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_reviews" ADD CONSTRAINT "video_reviews_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_reviews" ADD CONSTRAINT "video_reviews_user_course_id_fkey" FOREIGN KEY ("user_course_id") REFERENCES "user_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_reviews" ADD CONSTRAINT "video_reviews_course_day_id_fkey" FOREIGN KEY ("course_day_id") REFERENCES "course_days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_camp_id_fkey" FOREIGN KEY ("camp_id") REFERENCES "camps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_camp_id_fkey" FOREIGN KEY ("camp_id") REFERENCES "camps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
