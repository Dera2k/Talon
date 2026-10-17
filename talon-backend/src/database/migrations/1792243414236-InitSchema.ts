import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1792243414236 implements MigrationInterface {
  name = 'InitSchema1792243414236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_theme_enum" AS ENUM('light', 'dark', 'system')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(254) NOT NULL, "password_hash" character varying NOT NULL, "first_name" character varying(50), "last_name" character varying(50), "timezone" character varying(50) NOT NULL DEFAULT 'UTC', "theme" "public"."users_theme_enum" NOT NULL DEFAULT 'system', "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "is_active" boolean NOT NULL DEFAULT true, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_073999dfec9d14522f0cf58cd6" ON "users"  ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users"  ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(64) NOT NULL, "family_id" uuid NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_a7838d2ba25be1342091b6695f1" UNIQUE ("token_hash"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ddc983c5f7bcf132fd8732c3f" ON "refresh_tokens"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d5e27da0cd39bc3bb2811fc8ba" ON "refresh_tokens"  ("family_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ba3bd69c8ad1e799c0256e9e50" ON "refresh_tokens"  ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(64) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_91185d86d5d7557b19abbb2868b" UNIQUE ("token_hash"), CONSTRAINT "PK_d16bebd73e844c48bca50ff8d3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52ac39dd8a28730c63aeb428c9" ON "password_reset_tokens"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c038e5a589b06cbe4320cc88b" ON "password_reset_tokens"  ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "habit_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "habit_id" uuid NOT NULL, "days_of_week" smallint array NOT NULL, CONSTRAINT "UQ_4604f177f965bfa6147e5cf8150" UNIQUE ("habit_id"), CONSTRAINT "REL_4604f177f965bfa6147e5cf815" UNIQUE ("habit_id"), CONSTRAINT "PK_433667fa6c7712d1361540e15a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."habits_color_enum" AS ENUM('red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'indigo', 'teal', 'gray')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."habits_frequency_enum" AS ENUM('daily', 'weekly')`,
    );
    await queryRunner.query(
      `CREATE TABLE "habits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500), "color" "public"."habits_color_enum" NOT NULL, "icon" character varying(32) NOT NULL DEFAULT 'target', "category" character varying(50), "frequency" "public"."habits_frequency_enum" NOT NULL, "reminder_time" character varying(5), "archived_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b3ec33c2d7af69d09fcf4af7e39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_60c485fc1b2b0a8370bb6e1e16" ON "habits"  ("user_id", "archived_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."habit_completions_status_enum" AS ENUM('completed', 'skipped')`,
    );
    await queryRunner.query(
      `CREATE TABLE "habit_completions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "habit_id" uuid NOT NULL, "user_id" uuid NOT NULL, "date" date NOT NULL, "status" "public"."habit_completions_status_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_bebe890ee470fd9ecbd3dc4eedf" UNIQUE ("habit_id", "date"), CONSTRAINT "PK_6cd5cba8604717303b951f3aa1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9ecbb317b17e71b12d09f22a2" ON "habit_completions"  ("user_id", "date") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('reminder', 'milestone')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_status_enum" AS ENUM('unread', 'read')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "habit_id" uuid, "type" "public"."notifications_type_enum" NOT NULL, "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'unread', "title" character varying(150) NOT NULL, "message" character varying(500) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e12b049ad2071dd19fbfe1e76" ON "notifications"  ("user_id", "status", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "streaks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "habit_id" uuid NOT NULL, "user_id" uuid NOT NULL, "current_streak" integer NOT NULL DEFAULT '0', "longest_streak" integer NOT NULL DEFAULT '0', "last_completed_date" date, "calculated_on" date NOT NULL, CONSTRAINT "UQ_260471e93f893465e0f8f2a9bd0" UNIQUE ("habit_id"), CONSTRAINT "REL_260471e93f893465e0f8f2a9bd" UNIQUE ("habit_id"), CONSTRAINT "PK_52547016a1a6409f6e5287ed859" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ef06a4f4177b11885dd5fb8b2" ON "streaks"  ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "FK_52ac39dd8a28730c63aeb428c9c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "habit_schedules" ADD CONSTRAINT "FK_4604f177f965bfa6147e5cf8150" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "habits" ADD CONSTRAINT "FK_652ea1f27d16800eca4259546a1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "habit_completions" ADD CONSTRAINT "FK_074ec16420ef7425e584774ee03" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_f40c39eabda94237ede14a8bef3" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "streaks" ADD CONSTRAINT "FK_260471e93f893465e0f8f2a9bd0" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "streaks" DROP CONSTRAINT "FK_260471e93f893465e0f8f2a9bd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_f40c39eabda94237ede14a8bef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "habit_completions" DROP CONSTRAINT "FK_074ec16420ef7425e584774ee03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "habits" DROP CONSTRAINT "FK_652ea1f27d16800eca4259546a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "habit_schedules" DROP CONSTRAINT "FK_4604f177f965bfa6147e5cf8150"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "FK_52ac39dd8a28730c63aeb428c9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ef06a4f4177b11885dd5fb8b2"`,
    );
    await queryRunner.query(`DROP TABLE "streaks"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3e12b049ad2071dd19fbfe1e76"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9ecbb317b17e71b12d09f22a2"`,
    );
    await queryRunner.query(`DROP TABLE "habit_completions"`);
    await queryRunner.query(
      `DROP TYPE "public"."habit_completions_status_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_60c485fc1b2b0a8370bb6e1e16"`,
    );
    await queryRunner.query(`DROP TABLE "habits"`);
    await queryRunner.query(`DROP TYPE "public"."habits_frequency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."habits_color_enum"`);
    await queryRunner.query(`DROP TABLE "habit_schedules"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7c038e5a589b06cbe4320cc88b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_52ac39dd8a28730c63aeb428c9"`,
    );
    await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ba3bd69c8ad1e799c0256e9e50"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d5e27da0cd39bc3bb2811fc8ba"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3ddc983c5f7bcf132fd8732c3f"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_073999dfec9d14522f0cf58cd6"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_theme_enum"`);
  }
}
