import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prima.service.js";
import { authLoginDTO } from "./dto/auth.login.dto.js";
import * as bcrypt from 'bcrypt';
import { UserService } from "../user/user.service.js";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "../user/dto/userResponseDto.js";
import { RedisService } from "../redis/redis.service.js";
import { authRegisterDTO } from "./dto/auth.register.dto.js";
import { getUserAccess } from "./user-permissions.js";
@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private redisService: RedisService
    ) { }

    async register(data: authRegisterDTO) {
        const email = data.email.trim().toLowerCase();
        const user = await this.userService.findByEmail(email);

        if (user) {
            throw new ConflictException("user already existed")
        }

        const hardPassword = await bcrypt.hash('1111', 10);

        const newUser = await this.userService.createUser({
            email,
            fullName: data.fullName,
            passwordHash: hardPassword,
            phone: data.phone,
            citizenId: data.citizenId,
            age: data.age,
            teamId: data.teamId,
            employmentType: data.employmentType,
            roleCodes: data.roleCodes,
        });
        return newUser;
    }

    async login(data: authLoginDTO) {
        const user = await this.userService.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException("user not found");
        }

        const hardPassword = await bcrypt.compare(data.password, user.password);

        if (!hardPassword) {
            throw new UnauthorizedException("auth.password_incorrect");
        }

        const accessToken = this.signAccsetToken(user.id, user.email);
        const refreshToken = this.signRefreshToken(user.id, user.email);

        const hasdleRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.redisService.set(`refresh_token:${user.id}`, hasdleRefreshToken, 7 * 24 * 60 * 60)

        const { roles, permissions } = await getUserAccess(this.prismaService, user.id);

        const userReponse = plainToInstance(UserResponseDto, { ...user, roles }, {
            excludeExtraneousValues: true
        });
        return {
            accessToken,
            refreshToken,
            user: userReponse,
            permissions
        }
    }

    private signAccsetToken(id: string, email: string) {
        return this.jwtService.sign(
            { sub: id, email },
            {
                expiresIn: '15m',
                secret: this.configService.get('JWT_SECRET')
            }
        )
    }
    private signRefreshToken(id: string, email: string) {
        return this.jwtService.sign(
            { sub: id, email },
            {
                expiresIn: '7d',
                secret: this.configService.get('JWT_REFRESH_SECRET')
            }
        )
    }

    async reFreshToken(id: string, refreshToken: string) {
        const user = await this.userService.findById(id)
        if (!user) {
            throw new UnauthorizedException("user not found")
        }
        const storedHard = await this.redisService.get(`refresh_token:${id}`);
        if (!storedHard) {
            throw new UnauthorizedException('Token đã hết hạn hoặc không tồn tại');
        }
        const match = await bcrypt.compare(refreshToken, storedHard);
        if (!match) {
            throw new UnauthorizedException('Token không hợp lệ');
        }
        const newAccessToken = this.signAccsetToken(user.id, user.email);

        return newAccessToken;
    }
    async logout(id: string) {
        await this.redisService.del(`refresh_token:${id}`);
    }
}
