-- Preserve each user's former primary role before removing the duplicate column.
INSERT INTO "roles" ("id", "code", "name")
SELECT gen_random_uuid(), u."userType"::text::"RoleCode", u."userType"::text
FROM "users" AS u
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "user_roles" ("user_id", "role_id")
SELECT u."id", r."id"
FROM "users" AS u
JOIN "roles" AS r ON r."code" = u."userType"::text::"RoleCode"
ON CONFLICT ("user_id", "role_id") DO NOTHING;

ALTER TABLE "users" DROP COLUMN "userType";
DROP TYPE "EmployeeType";
