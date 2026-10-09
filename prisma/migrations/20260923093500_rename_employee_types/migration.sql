-- Map legacy employee types to the seven business roles in BRD CF 1.0.
CREATE TYPE "EmployeeType_new" AS ENUM (
  'DIRECTOR',
  'DEPUTY_DIRECTOR',
  'TECHNICAL_OFFICER',
  'CHIEF_ACCOUNTANT',
  'ACCOUNTANT',
  'COMPENSATION_OFFICER',
  'ADMINISTRATIVE_OFFICER'
);

ALTER TABLE "users"
  ALTER COLUMN "userType" TYPE "EmployeeType_new"
  USING (
    CASE "userType"::text
      WHEN 'SYSTEM_ADMIN' THEN 'DIRECTOR'
      WHEN 'DEPUTY_MANAGER' THEN 'DEPUTY_DIRECTOR'
      WHEN 'ENGINEER' THEN 'TECHNICAL_OFFICER'
      ELSE "userType"::text
    END
  )::"EmployeeType_new";

DROP TYPE "EmployeeType";
ALTER TYPE "EmployeeType_new" RENAME TO "EmployeeType";

UPDATE "roles"
SET
  "code" = CASE "code"
    WHEN 'SYSTEM_ADMIN' THEN 'DIRECTOR'
    WHEN 'DEPUTY_MANAGER' THEN 'DEPUTY_DIRECTOR'
    WHEN 'ENGINEER' THEN 'TECHNICAL_OFFICER'
    ELSE "code"
  END,
  "name" = CASE "code"
    WHEN 'SYSTEM_ADMIN' THEN 'Giám đốc'
    WHEN 'DEPUTY_MANAGER' THEN 'Phó Giám đốc'
    WHEN 'ENGINEER' THEN 'Tổ Kỹ thuật'
    ELSE "name"
  END
WHERE "code" IN ('SYSTEM_ADMIN', 'DEPUTY_MANAGER', 'ENGINEER');
