import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  ProjectStatus,
  UserStatus,
} from '../src/generated/prisma/client.js';
import { seedProjectScreen } from './seed-projects.js';
import { seedTeamDirectory } from './seed-team-directory.js';
import { seedRolePermissions } from './seed-role-permissions.js';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required. Copy .env.example to .env.');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const projects = [
  ['BQL-DA-2026-001', 'Nâng cấp đường ven biển Hà Tiên', 'Giao thông', ProjectStatus.CONSTRUCTION, '125000000000', '62.50', '48.00'],
  ['BQL-DA-2026-002', 'Khu tái định cư Mỹ Đức', 'Hạ tầng kỹ thuật', ProjectStatus.COMPENSATION, '98000000000', '35.00', '28.00'],
  ['BQL-DA-2026-003', 'Trường Tiểu học Đông Hồ', 'Dân dụng', ProjectStatus.PROCUREMENT, '68000000000', '22.00', '20.00'],
  ['BQL-DA-2026-004', 'Kè chống sạt lở Mũi Nai', 'Thủy lợi', ProjectStatus.DESIGN, '156000000000', '15.00', '12.00'],
  ['BQL-DA-2026-005', 'Cải tạo trụ sở UBND phường Hà Tiên', 'Dân dụng', ProjectStatus.ACCEPTANCE, '23000000000', '95.00', '100.00'],
] as const;

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const engineerPassword = await bcrypt.hash('Engineer@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bqlhatien.gov.vn' },
    update: {
      password: adminPassword,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'admin@bqlhatien.gov.vn',
      fullName: 'Huỳnh Thái Hải',
      password: adminPassword,
      status: UserStatus.ACTIVE,
    },
  });
  const engineer = await prisma.user.upsert({
    where: { email: 'engineer@bqlhatien.gov.vn' },
    update: {
      password: engineerPassword,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'engineer@bqlhatien.gov.vn',
      fullName: 'Nguyễn Văn Kỹ',
      password: engineerPassword,
      status: UserStatus.ACTIVE,
    },
  });
  const role = await prisma.role.upsert({ where: { code: 'DIRECTOR' }, update: { name: 'Giám đốc' }, create: { code: 'DIRECTOR', name: 'Giám đốc' } });
  const engineerRole = await prisma.role.upsert({ where: { code: 'TECHNICAL_OFFICER' }, update: { name: 'Tổ Kỹ thuật' }, create: { code: 'TECHNICAL_OFFICER', name: 'Tổ Kỹ thuật' } });
  const permission = await prisma.permission.upsert({ where: { code: 'project.manage' }, update: {}, create: { code: 'project.manage', name: 'Quản lý dự án' } });
  await prisma.userRole.upsert({ where: { userId_roleId: { userId: admin.id, roleId: role.id } }, update: {}, create: { userId: admin.id, roleId: role.id } });
  await prisma.userRole.upsert({ where: { userId_roleId: { userId: engineer.id, roleId: engineerRole.id } }, update: {}, create: { userId: engineer.id, roleId: engineerRole.id } });
  await prisma.rolePermission.upsert({ where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } }, update: {}, create: { roleId: role.id, permissionId: permission.id } });
  await prisma.rolePermission.upsert({ where: { roleId_permissionId: { roleId: engineerRole.id, permissionId: permission.id } }, update: {}, create: { roleId: engineerRole.id, permissionId: permission.id } });
  for (const [code, name, constructionType, status, totalInvestment, plannedProgress, actualProgress] of projects) {
    await prisma.project.upsert({ where: { code }, update: { name, status, plannedProgress, actualProgress }, create: { code, name, constructionType, status, totalInvestment, plannedProgress, actualProgress } });
  }
  await seedProjectScreen(prisma, admin.id, engineerRole.id, engineerPassword);
  await seedTeamDirectory(prisma);
  await seedRolePermissions(prisma);
  console.log('Seeded 10 sample projects and 7 test accounts, including M2 project relations.');
}
main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
