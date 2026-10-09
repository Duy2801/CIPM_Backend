import { ApiProperty } from '@nestjs/swagger';

export class DirectoryRoleResponseDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;
}

export class DirectoryUserResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ nullable: true })
    employmentType: string | null;

    @ApiProperty({ nullable: true })
    phone: string | null;

    @ApiProperty()
    email: string;

    @ApiProperty({ type: () => [DirectoryRoleResponseDto] })
    roles: DirectoryRoleResponseDto[];
}

export class TeamDirectoryGroupResponseDto {
    @ApiProperty({ format: 'uuid' })
    teamId: string;

    @ApiProperty()
    teamCode: string;

    @ApiProperty()
    teamName: string;

    @ApiProperty()
    count: number;

    @ApiProperty({ type: () => [DirectoryUserResponseDto] })
    users: DirectoryUserResponseDto[];
}

export class TeamDirectoryResponseDto {
    @ApiProperty({ type: () => [TeamDirectoryGroupResponseDto] })
    groups: TeamDirectoryGroupResponseDto[];
}
