import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prima.service.js";
import { PaymentStatus } from "../../generated/prisma/enums.js";

@Injectable()
export class PaymentService {
    constructor(private prismaService: PrismaService) { }

    async getDisbursementByYear(year: number) {
        const total = await this.prismaService.payment.aggregate({
            where: {
                status: PaymentStatus.DISBURSED,
                disbursedAt: {
                    gte: new Date(Date.UTC(year, 0, 1)),
                    lt: new Date(Date.UTC(year + 1, 0, 1)),
                }
            },
            _sum: {
                disbursedAmount: true
            }
        })
        return total;
    }
    async getExpiringProject() {
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDay()));

        const result = await this.prismaService.payment.findMany({
            where: {
                dueDate: { lt: today },
                disbursedAt: null,
                status: {
                    notIn: [PaymentStatus.DISBURSED, PaymentStatus.REJECTED]
                }
            },
            select: {
                id: true,
                projectId: true,
            }

        })
        return result;
    }
}