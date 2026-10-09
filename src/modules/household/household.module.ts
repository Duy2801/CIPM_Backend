import { Module } from "@nestjs/common";
import { HouseholdService } from "./household.service.js";
import { HouseholdController } from "./household.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
    imports: [PrismaModule],
    controllers: [HouseholdController],
    providers: [HouseholdService],
    exports: [HouseholdService]
})
export class HouseholdModule { }
