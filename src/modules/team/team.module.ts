import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TeamService } from './team.service.js';
import { TeamController } from './team.controller.js';

@Module({
    imports: [PrismaModule],
    controllers: [TeamController],
    providers: [TeamService],
    exports: [TeamService],
})
export class TeamModule { }
