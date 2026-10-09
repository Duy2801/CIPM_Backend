import { Injectable } from '@nestjs/common';
import { UserStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prima.service.js';
import { DirectoryUserResponseDto, TeamDirectoryResponseDto } from './dto/team-directory.response.dto.js';

const directoryUserSelect = {
    id: true,
    fullName: true,
    employmentType: true,
    phone: true,
    email: true,
    userRoles: {
        select: {
            role: { select: { code: true, name: true } },
        },
    },
} as const;

@Injectable()
export class TeamService {
    constructor(private prismaService: PrismaService) { }

    async listDirectory(): Promise<TeamDirectoryResponseDto> {
        const teams = await this.prismaService.team.findMany({
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' },
            ],
            select: {
                id: true,
                code: true,
                name: true,
                users: {
                    where: {
                        status: UserStatus.ACTIVE,
                    },
                    orderBy: {
                        fullName: 'asc',
                    },
                    select: directoryUserSelect,
                },
            },
        });

        const toDirectoryUser = (user: (typeof teams)[number]['users'][number]): DirectoryUserResponseDto => ({
            id: user.id,
            fullName: user.fullName,
            employmentType: user.employmentType,
            phone: user.phone,
            email: user.email,
            roles: user.userRoles.map(({ role }) => ({ code: role.code, name: role.name })),
        });

        return {
            groups: teams.map((team) => ({
                teamId: team.id,
                teamCode: team.code,
                teamName: team.name,
                count: team.users.length,
                users: team.users.map(toDirectoryUser),
            })),
        };
    }
}
