import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { TeamDirectoryResponseDto } from './dto/team-directory.response.dto.js';
import { TeamService } from './team.service.js';

@Controller('team')
export class TeamController {
    constructor(private teamService: TeamService) { }

    @Get('directory')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: TeamDirectoryResponseDto })
    listDirectory() {
        return this.teamService.listDirectory();
    }
}
