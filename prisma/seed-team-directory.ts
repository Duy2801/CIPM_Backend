import { RoleCode, type PrismaClient } from '../src/generated/prisma/client.js';

const teams = [
  {
    code: 'DIRECTORATE',
    name: 'Ban Giám đốc',
    sortOrder: 0,
    roleCodes: [RoleCode.DIRECTOR, RoleCode.DEPUTY_DIRECTOR],
  },
  {
    code: 'TECHNICAL',
    name: 'Tổ Giám sát – Kỹ thuật',
    sortOrder: 10,
    roleCodes: [RoleCode.TECHNICAL_OFFICER],
  },
  {
    code: 'ACCOUNTING',
    name: 'Tổ Kế toán',
    sortOrder: 20,
    roleCodes: [RoleCode.CHIEF_ACCOUNTANT, RoleCode.ACCOUNTANT],
  },
  {
    code: 'COMPENSATION',
    name: 'Tổ Bồi thường – GT – TĐC',
    sortOrder: 30,
    roleCodes: [RoleCode.COMPENSATION_OFFICER],
  },
  {
    code: 'ADMIN',
    name: 'Tổ Hành chính – Tổng hợp',
    sortOrder: 40,
    roleCodes: [RoleCode.ADMINISTRATIVE_OFFICER],
  },
] as const;

const staffRoles = [
  { code: RoleCode.DIRECTOR, name: 'Giám đốc' },
  { code: RoleCode.DEPUTY_DIRECTOR, name: 'Phó Giám đốc' },
  { code: RoleCode.TECHNICAL_OFFICER, name: 'Kỹ thuật' },
  { code: RoleCode.CHIEF_ACCOUNTANT, name: 'Kế toán trưởng' },
  { code: RoleCode.ACCOUNTANT, name: 'Kế toán viên' },
  { code: RoleCode.COMPENSATION_OFFICER, name: 'Bồi thường' },
  { code: RoleCode.ADMINISTRATIVE_OFFICER, name: 'Hành chính' },
  { code: RoleCode.LEAD, name: 'Trưởng tổ' },
  { code: RoleCode.MEMBER, name: 'Thành viên tổ' },
] as const;

export async function seedTeamDirectory(prisma: PrismaClient) {
  return prisma.$transaction(async (tx) => {
    const result: { teamCode: string; assignedUsers: number }[] = [];

    for (const definition of staffRoles) {
      await tx.role.upsert({
        where: { code: definition.code },
        update: {},
        create: definition,
      });
    }

    for (const definition of teams) {
      const team = await tx.team.upsert({
        where: { code: definition.code },
        update: {},
        create: {
          code: definition.code,
          name: definition.name,
          sortOrder: definition.sortOrder,
        },
      });

      const assigned = await tx.user.updateMany({
        where: {
          teamId: null,
          userRoles: { some: { role: { code: { in: [...definition.roleCodes] } } } },
        },
        data: { teamId: team.id },
      });

      result.push({ teamCode: team.code, assignedUsers: assigned.count });
    }

    return result;
  });
}
