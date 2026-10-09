import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prima.service.js';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  listUserPermissions(userId: string) {
    return this.prismaService.permission.findMany({
      where: {
        rolePermissions: {
          some: {
            role: {
              userRoles: { some: { userId } },
            },
          },
        },
      },
      select: { id: true, code: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
