import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prima.service.js';
import { ProjectProgressQueryDto } from './dto/project-progress-query.dto.js';

@Injectable()
export class ProjectProgressUpdateService {
  constructor(private readonly prisma: PrismaService) { }

  async findByProject(projectId: string, query: ProjectProgressQueryDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    if (!Number.isSafeInteger(skip)) {
      throw new BadRequestException('Trang yêu cầu quá lớn');
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Không tìm thấy dự án');

    const where = { projectId };
    const [data, total] = await Promise.all([
      this.prisma.projectProgressUpdate.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { updateDate: 'desc' },
          { createdAt: 'desc' },
          { id: 'desc' },
        ],
        include: {
          updatedBy: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.projectProgressUpdate.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page, limit, total, totalPages: Math.ceil(total / limit)
      },
    };
  }

}
