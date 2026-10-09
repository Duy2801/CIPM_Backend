import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prima.service.js";
import { ProcedureMilestone, ProjectStatus } from "../../generated/prisma/enums.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ProjectQueryDto } from "./dto/projectQueryDto.js";
import { CreateProjectDto } from "./dto/createProjectDto.js";
import { FiscalYear } from "../../common/decorators/fiscal-year.decorator.js";

@Injectable()
export class ProjectService {
    constructor(private prismaService: PrismaService) { }

    async countAllProjects() {
        return this.prismaService.project.count();
    }

    async getLateProject() {
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDay()));
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

        const result = await this.prismaService.project.findMany({
            where: {
                plannedEndDate: { lte: thirtyDaysAgo },
                actualCompletionDate: null,
                status: {
                    notIn: [ProjectStatus.COMPLETED, ProjectStatus.CLOSED]
                }
            },
            select: {
                id: true,
                name: true,
            }
        })
        return result;
    }
    async countAcceptedProjects(): Promise<number> {
        return this.prismaService.project.count({
            where: {
                procedureSteps: {
                    some: {
                        template: {
                            is: { milestone: ProcedureMilestone.ACCEPTANCE_COMPLETED },
                        },
                        completedAt: { not: null },
                    },
                },
            },
        });
    }
    async getProjects(query: ProjectQueryDto, fiscalYear: number) {
        const { status, constructionType, page, limit } = query;
        const search = query.search?.trim();

        const where: Prisma.ProjectWhereInput = {
            capitalPlans: { some: { year: fiscalYear } },
            ...(status && status !== 'ALL' ? { status } : {}),
            ...(constructionType && constructionType !== 'ALL' ? { constructionType } : {}),
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { code: { contains: search, mode: 'insensitive' } },
                    { assignments: { some: { user: { fullName: { contains: search, mode: 'insensitive' } } } } },
                ],
            } : {}),
        };

        const [data, total] = await Promise.all([
            this.prismaService.project.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    capitalPlans: {
                        select: {
                            year: true
                        },
                        where: { year: fiscalYear },
                    },
                    assignments: {
                        where: { assignmentType: { in: ['PRIMARY', 'TECHNICAL_SUPERVISOR'] } },
                        include: { user: { select: { id: true, fullName: true } } },
                    },
                },
                orderBy: { code: 'asc' },
            }),
            this.prismaService.project.count({ where }),
        ]);

        return {
            pagination: { data, page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getDetailProject(id: string) {
        const project = await this.prismaService.project.findUnique({
            where: { id },
            include: {
                assignments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        if (!project) {
            throw new NotFoundException('Không tìm thấy dự án');
        }
        return project;
    }

    async getNextProjectCode(fiscalYear: number): Promise<string> {
        const prefix = `BQL-DA-${fiscalYear}-`;

        const countThisYear = await this.prismaService.project.count({
            where: {
                code: { startsWith: prefix }
            }
        });

        const nextNumber = String(countThisYear + 1).padStart(3, '0');
        return `${prefix}${nextNumber}`;
    }

    async createProject(dto: CreateProjectDto, @FiscalYear() fiscalYear: number) {
        return this.prismaService.$transaction(async (tx) => {

        });
    }




}
