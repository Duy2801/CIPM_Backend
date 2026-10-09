import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { RoleCode } from '../../../generated/prisma/enums.js';

const SYSTEM_ROLES = Object.values(RoleCode).filter(
    (code) => code !== RoleCode.LEAD && code !== RoleCode.MEMBER,
);

export class UpdateStaffOrganizationDto {
    @ApiProperty({ enum: SYSTEM_ROLES, example: RoleCode.TECHNICAL_OFFICER })
    @IsIn(SYSTEM_ROLES)
    systemRoleCode: RoleCode;

    @ApiPropertyOptional({ enum: SYSTEM_ROLES, description: 'Required when the user has multiple system roles' })
    @IsOptional()
    @IsIn(SYSTEM_ROLES)
    previousSystemRoleCode?: RoleCode;

    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    teamId: string;

    @ApiProperty({ enum: [RoleCode.LEAD, RoleCode.MEMBER], nullable: true })
    @IsIn([RoleCode.LEAD, RoleCode.MEMBER, null])
    teamPositionCode: typeof RoleCode.LEAD | typeof RoleCode.MEMBER | null;
}
