import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProjectProgressUpdateController } from './project-progress-update.controller.js';
import { ProjectProgressUpdateService } from './project-progress-update.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectProgressUpdateController],
  providers: [ProjectProgressUpdateService],
  exports: [ProjectProgressUpdateService],
})
export class ProjectProgressUpdateModule {}
