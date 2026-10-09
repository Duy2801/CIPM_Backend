import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prima.service.js";
import { ProjectService } from "../project/project.service.js";
import { HouseholdService } from "../household/household.service.js";
import { PaymentService } from "../payment/payment.service.js";

@Injectable()
export class NotificationService {
    constructor(private prismaService: PrismaService,
        private paymentService: PaymentService,
        private projectService: ProjectService,
        private householdService: HouseholdService
    ) { }

    async countDelayedProjects() {
        const [lateProjects, overduePayments, coercionHouseholds] =
            await Promise.all([
                this.projectService.getLateProject(),
                this.paymentService.getExpiringProject(),
                this.householdService.getHouseholdsNeedingCoercion()])

        const projectId = [
            ...lateProjects.map((project) => project.id),
            ...overduePayments.map((payment) => payment.projectId),
            ...coercionHouseholds.map((household) => household.projectId)
        ]

        return new Set(projectId).size;
    }
}