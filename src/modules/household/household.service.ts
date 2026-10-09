import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prima.service.js";
import { HouseholdSpecialStatus, HouseholdStepStatus } from "../../generated/prisma/enums.js";

@Injectable()
export class HouseholdService {
    constructor(private prismaService: PrismaService) { }

    async getHouseholdsNeedingCoercion() {
        return this.prismaService.household.findMany({
            where: {
                specialStatus: HouseholdSpecialStatus.COERCION
            },
            select: {
                id: true,
                projectId: true
            }
        })
    }
    async countClearedHouseholds() {
        return this.prismaService.household.count({
            where: {
                steps: {
                    some: {
                        stepNumber: 16,
                        completedAt: { not: null },
                        status: HouseholdStepStatus.COMPLETED
                    }
                }
            }
        })
    }
}