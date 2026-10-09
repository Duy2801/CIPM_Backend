import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { ProjectProgressQueryDto } from './dto/project-progress-query.dto.js';
import { ProjectProgressUpdateService } from './project-progress-update.service.js';

@ApiTags('Project Progress Update')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress-updates')
export class ProjectProgressUpdateController {
  constructor(private readonly service: ProjectProgressUpdateService) { }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy nhật ký tiến độ dự án có phân trang' })
  @ApiParam({ name: 'id', type: String })
  findByProject(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: ProjectProgressQueryDto,
  ) {
    return this.service.findByProject(id, query);
  }
}
