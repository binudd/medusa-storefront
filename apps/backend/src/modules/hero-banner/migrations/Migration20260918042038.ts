import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260918042038 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "hero_banner" ("id" text not null, "name" text not null, "heading" text null, "subheading" text null, "desktop_image_url" text null, "desktop_image_id" text null, "mobile_image_url" text null, "mobile_image_id" text null, "button_text" text null, "button_link" text null, "is_active" boolean not null default false, "sort_order" integer not null default 0, "starts_at" timestamptz null, "ends_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "hero_banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_hero_banner_deleted_at" ON "hero_banner" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "hero_banner" cascade;`);
  }

}
