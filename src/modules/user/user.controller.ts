import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Put, UseGuards } from "@nestjs/common";
import { UpdateUserDto } from "./dto/user.update.dto.js";
import { UserService } from "./user.service.js";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { RoleCode } from "../../generated/prisma/enums.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { RequirePermission } from "../../common/decorators/permissions.decorator.js";
import { PermissonGuard } from "../../common/guards/permission.guard.js";
import { StaffOrganizationResponseDto } from "./dto/staff-organization.response.dto.js";
import { UpdateStaffOrganizationDto } from "./dto/update-staff-organization.dto.js";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get(':id/organization')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: StaffOrganizationResponseDto })
    getStaffOrganization(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.getStaffOrganization(id);
    }

    @Patch(':id/organization')
    @UseGuards(JwtAuthGuard, PermissonGuard)
    @RequirePermission('staff.update')
    @ApiBearerAuth()
    @ApiOkResponse({ type: StaffOrganizationResponseDto })
    updateStaffOrganization(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() data: UpdateStaffOrganizationDto,
        @CurrentUser() actor: { roles: RoleCode[] },
    ) {
        return this.userService.updateStaffOrganization(id, data, actor.roles);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    getDirectoryUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.getDirectoryUser(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, PermissonGuard)
    @RequirePermission('staff.update')
    @ApiBearerAuth()
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUserDto) {
        return this.userService.updateUser(id, data);
    }
}
