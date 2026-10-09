import { PrismaService } from '../prisma/prima.service.js';

export async function getUserAccess(prisma: PrismaService, userId: string) {
    const userRoles = await prisma.userRole.findMany({
        where: { userId },
        select: {
            role: {
                select: {
                    code: true,
                    rolePermissions: {
                        select: { permission: { select: { code: true } } },
                    },
                },
            },
        },
    });

    const roles = userRoles.map(({ role }) => role.code);
    const permissions = [...new Set(userRoles.flatMap(({ role }) =>
        role.rolePermissions.map(({ permission }) => permission.code),
    ))];
    return { roles, permissions };
}
