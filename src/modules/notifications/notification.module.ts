import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service.js";
import { NotificationController } from "./notification.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { ProjectModule } from "../project/project.module.js";
import { PaymentModule } from "../payment/payment.module.js";
import { HouseholdModule } from "../household/household.module.js";

@Module({
    imports: [ ProjectModule, PaymentModule, HouseholdModule],
    controllers: [NotificationController],
    providers: [NotificationService]
})
export class NotificationModule { }
