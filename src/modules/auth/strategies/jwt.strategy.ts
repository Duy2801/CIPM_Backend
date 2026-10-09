import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "../../prisma/prima.service.js";
import { getUserAccess } from "../user-permissions.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || ''
        })
    }

    async validate(payload: { sub: string; email: string }) {
        const { roles, permissions } = await getUserAccess(this.prisma, payload.sub);
        return {
            userId: payload.sub,
            email: payload.email,
            roles,
            permissions,
        }
    }
}
