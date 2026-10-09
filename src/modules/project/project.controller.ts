import { Body, Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { ProjectService } from "./project.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ProjectStatus } from "../../generated/prisma/enums.js";
import { ProjectQueryDto } from "./dto/projectQueryDto.js";
import { FiscalYear } from "../../common/decorators/fiscal-year.decorator.js";

@ApiTags('Project')
@Controller('project')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
    constructor(private projectService: ProjectService) { }

    @Get('count')
    countAllProjects() {
        return this.projectService.countAllProjects();
    }
    @Get('accepted/count')
    getAcceptedProjects() {
        return this.projectService.countAcceptedProjects();
    }
    @Get('status')
  getProjects(
     @Query() query: ProjectQueryDto,
     @FiscalYear() fiscalYear: number,
   ) {
     return this.projectService.getProjects(query, fiscalYear);
   }
    @Get('detail/:id')
    getDetailProject(@Param('id' ) id: string) {
        return this.projectService.getDetailProject(id);
    }
}
