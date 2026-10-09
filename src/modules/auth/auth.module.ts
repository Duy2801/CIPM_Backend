import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { UserModule } from "../user/user.module.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { JwtModule } from "@nestjs/jwt";
import { RedisModule } from "../redis/redis.module.js";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy.js";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy.js";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        UserModule,
        RedisModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'FALLBACK_KEY',
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshTokenStrategy]
})
export class AuthModule { }
