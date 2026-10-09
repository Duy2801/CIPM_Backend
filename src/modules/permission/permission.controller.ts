import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionResponseDto } from './dto/permission.response.dto.js';
import { PermissionService } from './permission.service.js';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PermissionResponseDto, isArray: true })
  listUserPermissions(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.permissionService.listUserPermissions(userId);
  }
}
