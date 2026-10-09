import { ApiProperty } from '@nestjs/swagger';
import { RoleCode } from '../../../generated/prisma/enums.js';

class StaffRoleResponseDto {
    @ApiProperty({ enum: RoleCode })
    code: RoleCode;

    @ApiProperty()
    name: string;
}

class StaffTeamResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;
}

export class StaffOrganizationResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ nullable: true })
    phone: string | null;

    @ApiProperty()
    email: string;

    @ApiProperty({ type: () => StaffTeamResponseDto, nullable: true })
    team: StaffTeamResponseDto | null;

    @ApiProperty({ type: () => [StaffRoleResponseDto] })
    roles: StaffRoleResponseDto[];
}
