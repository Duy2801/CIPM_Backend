import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service.js";
import { ProjectController } from "./project.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService]
})
export class ProjectModule { }
