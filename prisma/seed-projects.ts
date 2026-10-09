import {
  PrismaClient,
  ProjectStatus,
  UserStatus,
} from '../src/generated/prisma/client.js';

// Fictional fixtures for BRD M2 (4.2.1–4.2.4). Amounts are stored in VND.
const samples = [
  {
    code: 'BQL-DA-2026-006',
    name: 'Nâng cấp đường nội ô phường Đông Hồ',
    constructionType: 'Giao thông',
    status: ProjectStatus.CONSTRUCTION,
    totalInvestment: '45000000000',
    plannedProgress: '70.00',
    actualProgress: '55.00',
    plannedStartDate: '2026-01-05',
    plannedEndDate: '2026-12-31',
    actualCompletionDate: null,
    fullName: 'Trần Minh Quân',
    fundingCode: 'M2-SEED-NS-TINH',
    fundingName: 'Ngân sách tỉnh (mẫu)',
    annualAmount: '18000000000',
    oldPlannedPercent: '65.00',
    oldActualPercent: '50.00',
    note: 'Đã hoàn thành nền đường, đang thi công hệ thống thoát nước.',
  },
  {
    code: 'BQL-DA-2026-007',
    name: 'Xây dựng hệ thống thoát nước khu dân cư Mỹ Đức',
    constructionType: 'Hạ tầng kỹ thuật',
    status: ProjectStatus.CONSTRUCTION,
    totalInvestment: '32000000000',
    plannedProgress: '60.00',
    actualProgress: '62.00',
    plannedStartDate: '2026-02-02',
    plannedEndDate: '2027-03-31',
    actualCompletionDate: null,
    fullName: 'Lê Thị Thanh',
    fundingCode: 'M2-SEED-NS-TW',
    fundingName: 'Ngân sách trung ương hỗ trợ (mẫu)',
    annualAmount: '12000000000',
    oldPlannedPercent: '55.00',
    oldActualPercent: '56.00',
    note: 'Hoàn thành lắp đặt cống tuyến chính, tiến độ vượt kế hoạch.',
  },
  {
    code: 'BQL-DA-2026-008',
    name: 'Cải tạo Trường Mầm non Bình San',
    constructionType: 'Dân dụng',
    status: ProjectStatus.CONSTRUCTION,
    totalInvestment: '15000000000',
    plannedProgress: '100.00',
    actualProgress: '80.00',
    plannedStartDate: '2026-01-12',
    plannedEndDate: '2026-08-15',
    actualCompletionDate: null,
    fullName: 'Phạm Quốc Bảo',
    fundingCode: 'M2-SEED-NS-DP',
    fundingName: 'Ngân sách địa phương (mẫu)',
    annualAmount: '15000000000',
    oldPlannedPercent: '100.00',
    oldActualPercent: '75.00',
    note: 'Chậm bàn giao thiết bị lớp học; đang hoàn thiện sân trường.',
  },
  {
    code: 'BQL-DA-2026-009',
    name: 'Xây dựng công viên cây xanh khu vực Tô Châu',
    constructionType: 'Hạ tầng kỹ thuật',
    status: ProjectStatus.PREPARATION,
    totalInvestment: '22000000000',
    plannedProgress: '10.00',
    actualProgress: '5.00',
    plannedStartDate: '2026-08-03',
    plannedEndDate: '2027-12-31',
    actualCompletionDate: null,
    fullName: 'Võ Ngọc Mai',
    fundingCode: 'M2-SEED-DAT',
    fundingName: 'Nguồn thu sử dụng đất (mẫu)',
    annualAmount: '3000000000',
    oldPlannedPercent: '8.00',
    oldActualPercent: '3.00',
    note: 'Đang lập hồ sơ đề xuất chủ trương đầu tư.',
  },
  {
    code: 'BQL-DA-2026-010',
    name: 'Lắp đặt chiếu sáng công cộng tuyến đường Mũi Nai',
    constructionType: 'Hạ tầng kỹ thuật',
    status: ProjectStatus.COMPLETED,
    totalInvestment: '8500000000',
    plannedProgress: '100.00',
    actualProgress: '100.00',
    plannedStartDate: '2026-01-05',
    plannedEndDate: '2026-09-30',
    actualCompletionDate: '2026-09-21',
    fullName: 'Đặng Hoàng Nam',
    fundingCode: 'M2-SEED-XHH',
    fundingName: 'Vốn xã hội hóa (mẫu)',
    annualAmount: '8500000000',
    oldPlannedPercent: '95.00',
    oldActualPercent: '95.00',
    note: 'Hoàn thành lắp đặt và bàn giao hệ thống chiếu sáng.',
  },
] as const;

const date = (value: string) => new Date(`${value}T00:00:00.000Z`);

// Stable UUIDs allow re-running assignments/history without duplicate rows.
const seedId = (group: number, index: number) =>
  `b0122026-0000-4000-8000-${String(group * 100 + index).padStart(12, '0')}`;

export async function seedProjectScreen(
  prisma: PrismaClient,
  assignedById: string,
  engineerRoleId: string,
  password: string,
) {
  // All M2 records are committed together; existing records are left intact.
  await prisma.$transaction(
    async (tx) => {
      const users: { id: string }[] = [];
      for (const [index, sample] of samples.entries()) {
        const user = await tx.user.upsert({
          where: { email: `m2.engineer${index + 1}@example.com` },
          update: {},
          create: {
            email: `m2.engineer${index + 1}@example.com`,
            fullName: sample.fullName,
            password,
            status: UserStatus.ACTIVE,
          },
        });
        users.push(user);
        await tx.userRole.upsert({
          where: { userId_roleId: { userId: user.id, roleId: engineerRoleId } },
          update: {},
          create: { userId: user.id, roleId: engineerRoleId },
        });
      }

      for (const [index, sample] of samples.entries()) {
        const project = await tx.project.upsert({
          where: { code: sample.code },
          update: {},
          create: {
            code: sample.code,
            name: sample.name,
            constructionType: sample.constructionType,
            status: sample.status,
            totalInvestment: sample.totalInvestment,
            plannedProgress: sample.plannedProgress,
            actualProgress: sample.actualProgress,
            plannedStartDate: date(sample.plannedStartDate),
            plannedEndDate: date(sample.plannedEndDate),
            actualCompletionDate: sample.actualCompletionDate
              ? date(sample.actualCompletionDate)
              : null,
          },
        });

        const fundingSource = await tx.fundingSource.upsert({
          where: { code: sample.fundingCode },
          update: {},
          create: {
            code: sample.fundingCode,
            name: sample.fundingName,
            description:
              'Dữ liệu mẫu phục vụ màn hình M2 – Dự án & Công trình.',
          },
        });
        const capitalPlanKey = {
          projectId: project.id,
          fundingSourceId: fundingSource.id,
          year: 2026,
        };
        await tx.annualCapitalPlan.upsert({
          where: { projectId_fundingSourceId_year: capitalPlanKey },
          update: {},
          create: {
            ...capitalPlanKey,
            approvedAmount: sample.annualAmount,
            currentAmount: sample.annualAmount,
          },
        });

        const lead = users[index];
        const supervisor = users[(index + 1) % users.length];
        // assignmentType is a String in the schema; these are seed conventions.
        for (const [group, assignmentType, userId] of [
          [1, 'PRIMARY', lead.id],
          [2, 'TECHNICAL_SUPERVISOR', supervisor.id],
        ] as const) {
          await tx.projectAssignment.upsert({
            where: { id: seedId(group, index) },
            update: {},
            create: {
              id: seedId(group, index),
              projectId: project.id,
              userId,
              assignmentType,
              startDate: date(sample.plannedStartDate),
              assignedById,
            },
          });
        }

        await tx.projectProgressUpdate.upsert({
          where: { id: seedId(3, index) },
          update: {},
          create: {
            id: seedId(3, index),
            projectId: project.id,
            updatedById: supervisor.id,
            updateDate: date('2026-09-21'), // Monday, per BRD 4.2.3.
            oldPlannedPercent: sample.oldPlannedPercent,
            newPlannedPercent: sample.plannedProgress,
            oldActualPercent: sample.oldActualPercent,
            newActualPercent: sample.actualProgress,
            note: sample.note,
          },
        });
      }
    },
    { timeout: 30000 },
  );

  console.log(
    'M2: 5 projects, 5 users, 5 user roles, 5 funding sources, 5 capital plans, 10 assignments, 5 progress updates.',
  );
}
