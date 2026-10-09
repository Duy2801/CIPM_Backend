import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { authLoginDTO } from "./dto/auth.login.dto.js";
import { AuthService } from "./auth.service.js";
import { authRegisterDTO } from "./dto/auth.register.dto.js";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard.js";
import { PermissonGuard } from "../../common/guards/permission.guard.js";
import { RequirePermission } from "../../common/decorators/permissions.decorator.js";

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('register')
    @UseGuards(JwtAuthGuard, PermissonGuard)
    @RequirePermission('staff.create')
    @ApiBearerAuth()
    register(@Body() data: authRegisterDTO) {
        return this.authService.register(data);
    }

    @Post('login')
    login(@Body() data: authLoginDTO) {
        return this.authService.login(data)
    }
}
