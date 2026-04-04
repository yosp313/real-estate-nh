CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
CREATE TABLE IF NOT EXISTS "users"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "email" varchar not null,
  "email_verified_at" datetime,
  "password" varchar not null,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "users_email_unique" on "users"("email");
CREATE TABLE IF NOT EXISTS "password_reset_tokens"(
  "email" varchar not null,
  "token" varchar not null,
  "created_at" datetime,
  primary key("email")
);
CREATE TABLE IF NOT EXISTS "sessions"(
  "id" varchar not null,
  "user_id" integer,
  "ip_address" varchar,
  "user_agent" text,
  "payload" text not null,
  "last_activity" integer not null,
  primary key("id")
);
CREATE INDEX "sessions_user_id_index" on "sessions"("user_id");
CREATE INDEX "sessions_last_activity_index" on "sessions"("last_activity");
CREATE TABLE IF NOT EXISTS "cache"(
  "key" varchar not null,
  "value" text not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE TABLE IF NOT EXISTS "cache_locks"(
  "key" varchar not null,
  "owner" varchar not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE TABLE IF NOT EXISTS "jobs"(
  "id" integer primary key autoincrement not null,
  "queue" varchar not null,
  "payload" text not null,
  "attempts" integer not null,
  "reserved_at" integer,
  "available_at" integer not null,
  "created_at" integer not null
);
CREATE INDEX "jobs_queue_index" on "jobs"("queue");
CREATE TABLE IF NOT EXISTS "job_batches"(
  "id" varchar not null,
  "name" varchar not null,
  "total_jobs" integer not null,
  "pending_jobs" integer not null,
  "failed_jobs" integer not null,
  "failed_job_ids" text not null,
  "options" text,
  "cancelled_at" integer,
  "created_at" integer not null,
  "finished_at" integer,
  primary key("id")
);
CREATE TABLE IF NOT EXISTS "failed_jobs"(
  "id" integer primary key autoincrement not null,
  "uuid" varchar not null,
  "connection" text not null,
  "queue" text not null,
  "payload" text not null,
  "exception" text not null,
  "failed_at" datetime not null default CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" on "failed_jobs"("uuid");
CREATE TABLE IF NOT EXISTS "reservations"(
  "id" integer primary key autoincrement not null,
  "project_id" integer not null,
  "customer_name" varchar not null,
  "customer_email" varchar not null,
  "customer_phone" varchar not null,
  "created_at" datetime,
  "updated_at" datetime,
  "status" varchar not null default 'pending',
  foreign key("project_id") references "projects"("id") on delete cascade
);
CREATE UNIQUE INDEX "reservations_project_id_customer_email_unique" on "reservations"(
  "project_id",
  "customer_email"
);
CREATE TABLE IF NOT EXISTS "contacts"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "email" varchar not null,
  "phone" varchar,
  "message" text not null,
  "is_read" tinyint(1) not null default '0',
  "created_at" datetime,
  "updated_at" datetime
);
CREATE INDEX "contacts_email_index" on "contacts"("email");
CREATE INDEX "contacts_is_read_index" on "contacts"("is_read");
CREATE INDEX "reservations_status_index" on "reservations"("status");
CREATE TABLE IF NOT EXISTS "projects"(
  "id" integer primary key autoincrement not null,
  "slug" varchar not null,
  "name" varchar not null,
  "description" text not null,
  "price_starts_at" varchar,
  "image_url" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  "type" varchar not null default('apartment'),
  "area_sqm" integer,
  "location" varchar,
  "bedrooms" integer,
  "bathrooms" integer,
  "is_featured" tinyint(1) not null default('0'),
  "status" varchar not null default('available')
);
CREATE INDEX "projects_slug_index" on "projects"("slug");
CREATE UNIQUE INDEX "projects_slug_unique" on "projects"("slug");
CREATE INDEX "projects_status_index" on "projects"("status");

INSERT INTO migrations VALUES(1,'0001_01_01_000000_create_users_table',1);
INSERT INTO migrations VALUES(2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO migrations VALUES(3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO migrations VALUES(4,'2025_12_03_133138_create_projects_table',1);
INSERT INTO migrations VALUES(5,'2025_12_03_133230_create_reservations_table',1);
INSERT INTO migrations VALUES(6,'2026_01_10_033542_add_property_details_to_projects_table',1);
INSERT INTO migrations VALUES(7,'2026_01_10_033637_create_contacts_table',1);
INSERT INTO migrations VALUES(8,'2026_02_24_100000_add_status_to_projects_table',1);
INSERT INTO migrations VALUES(9,'2026_02_24_160000_add_status_to_reservations_table',1);
INSERT INTO migrations VALUES(10,'2026_03_31_000000_make_project_price_and_image_nullable',1);
