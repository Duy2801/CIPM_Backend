import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PERMISSION_KEY } from "../decorators/permissions.decorator.js";
import { RoleCode } from "../../generated/prisma/enums.js";

@Injectable()
export class PermissonGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requirePermission = this.reflector.getAllAndOverride<string[]>(
            PERMISSION_KEY, [context.getHandler(), context.getClass()]
        )
        if (!requirePermission || requirePermission.length === 0) {
            return false;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Who are you?');
        }

        if (user.roles?.includes(RoleCode.DIRECTOR)) {
            return true;
        }

        const userPermission: string[] = user.permissions || [];

        const havePermission = requirePermission.every((permisstion) => {
            return userPermission.includes(permisstion);
        })

        if (!havePermission) {
            throw new ForbiddenException('Role invalid.');
        }

        return true;
    }

}
