import { RoleCode, type PrismaClient } from '../src/generated/prisma/client.js';

export async function seedRolePermissions(prisma: PrismaClient) {
  await prisma.permission.upsert({
    where: { code: 'staff.create' },
    update: {},
    create: { code: 'staff.create', name: 'Thêm nhân sự' },
  });
  await prisma.permission.upsert({
    where: { code: 'staff.update' },
    update: {},
    create: { code: 'staff.update', name: 'Cập nhật nhân sự' },
  });

  const director = await prisma.role.findUnique({
    where: { code: RoleCode.DIRECTOR },
    select: { id: true },
  });
  if (!director) throw new Error('DIRECTOR role must be seeded first');

  const permissions = await prisma.permission.findMany({ select: { id: true } });
  await prisma.rolePermission.createMany({
    data: permissions.map(({ id }) => ({ roleId: director.id, permissionId: id })),
    skipDuplicates: true,
  });
}
