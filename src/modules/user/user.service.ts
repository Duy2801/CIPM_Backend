import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prima.service.js";
import type { CreateUserData } from "./dto/create-user-data.js";
import { UpdateUserDto } from "./dto/user.update.dto.js";
import { Prisma, RoleCode, type User } from "../../generated/prisma/client.js";

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    async getDirectoryUser(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                employmentType: true,
                phone: true,
                email: true,
                status: true,
                team: { select: { id: true, code: true, name: true } },
                userRoles: {
                    select: { role: { select: { code: true, name: true } } },
                },
            },
        });

        if (!user) throw new NotFoundException('User not found');
        const { userRoles, ...profile } = user;
        return { ...profile, roles: userRoles.map(({ role }) => role) };
    }

    async createUser(data: CreateUserData) {
        const roleCodes = [...new Set(data.roleCodes)];
        try {
            return await this.prismaService.$transaction(async (tx) => {
                const [team, roles] = await Promise.all([
                    tx.team.findUnique({
                        where: { id: data.teamId },
                        select: { id: true },
                    }),
                    tx.role.findMany({
                        where: { code: { in: roleCodes } },
                        select: { id: true, code: true },
                    }),
                ]);

                if (!team) throw new NotFoundException('Team not found');
                if (roles.length !== roleCodes.length) {
                    throw new BadRequestException('One or more roles do not exist');
                }

                const user = await tx.user.create({
                    data: {
                        email: data.email,
                        fullName: data.fullName,
                        password: data.passwordHash,
                        phone: data.phone,
                        citizenId: data.citizenId,
                        age: data.age,
                        status: data.status,
                        employmentType: data.employmentType,
                        team: { connect: { id: data.teamId } },
                        userRoles: {
                            create: roles.map((role) => ({
                                role: { connect: { id: role.id } },
                            })),
                        },
                    },
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        phone: true,
                        employmentType: true,
                        team: { select: { id: true, code: true, name: true } },
                        userRoles: {
                            select: { role: { select: { code: true, name: true } } },
                        },
                    },
                });

                const { userRoles, ...profile } = user;
                return { ...profile, roles: userRoles.map(({ role }) => role) };
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email or citizen ID already exists');
            }
            throw error;
        }
    }

    findByEmail(email: string): Promise<User | null> {
        return this.prismaService.user.findUnique({ where: { email } });
    }

    findById(id: string): Promise<User | null> {
        return this.prismaService.user.findUnique({ where: { id } });
    }

    updateUser(id: string, data: UpdateUserDto): Promise<User> {
        return this.prismaService.user.update({ where: { id }, data });
    }

    async getStaffOrganization(userId: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                phone: true,
                email: true,
                team: { select: { id: true, code: true, name: true } },
                userRoles: {
                    select: { role: { select: { code: true, name: true } } },
                },
            },
        });

        if (!user) throw new NotFoundException('Không tìm thấy nhân sự');

        const roles = user.userRoles.map(({ role }) => role);

        return {
            id: user.id,
            fullName: user.fullName,
            phone: user.phone,
            email: user.email,
            team: user.team,
            roles,
        };
    }
    async updateStaffOrganization(
        userId: string,
        data: {
            systemRoleCode: RoleCode;
            previousSystemRoleCode?: RoleCode;
            teamId: string;
            teamPositionCode: 'LEAD' | 'MEMBER' | null;
        },
        actorRoles: RoleCode[],
    ) {

        await this.prismaService.$transaction(async tx => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: {
                    userRoles: {
                        select: {
                            roleId: true,
                            role: { select: { code: true } },
                        },
                    },
                },
            });

            if (!user) throw new NotFoundException('Không tìm thấy nhân sự');
            
            const newCodes = [
                data.systemRoleCode,
                data.teamPositionCode,
            ].filter((code): code is RoleCode => code !== null);

            const newRoles = await tx.role.findMany({
                where: { code: { in: newCodes } },
                select: { id: true },
            });
            const isTeamPosition = (code: RoleCode) =>
                code === RoleCode.LEAD || code === RoleCode.MEMBER;

            const currentSystemRoles = user.userRoles.filter(
                ({ role }) => !isTeamPosition(role.code),
            );
            const oldSystemRole = data.previousSystemRoleCode
                ? currentSystemRoles.find(({ role }) => role.code === data.previousSystemRoleCode)
                : currentSystemRoles[0];
            const oldRoleIds = [
                ...(oldSystemRole ? [oldSystemRole.roleId] : []),
                ...user.userRoles
                    .filter(({ role }) => isTeamPosition(role.code))
                    .map(({ roleId }) => roleId),
            ];

            await tx.user.update({
                where: { id: userId },
                data: { teamId: data.teamId },
            });

            await tx.userRole.deleteMany({
                where: { userId, roleId: { in: oldRoleIds } },
            });

            await tx.userRole.createMany({
                data: newRoles.map(role => ({ userId, roleId: role.id })),
                skipDuplicates: true,
            });
        });

        return this.getStaffOrganization(userId);
    }
}
