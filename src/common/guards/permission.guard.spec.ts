import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { PermissonGuard } from './permission.guard.js';

describe('PermissonGuard', () => {
    it('allows a director without checking assigned permissions', async () => {
        const reflector = { getAllAndOverride: vi.fn().mockReturnValue(['staff.create']) } as unknown as Reflector;
        const context = {
            getHandler: () => undefined,
            getClass: () => undefined,
            switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['DIRECTOR'], permissions: [] } }) }),
        } as unknown as ExecutionContext;

        await expect(new PermissonGuard(reflector).canActivate(context)).resolves.toBe(true);
    });

    it('requires assigned permissions for other users', async () => {
        const reflector = { getAllAndOverride: vi.fn().mockReturnValue(['staff.create']) } as unknown as Reflector;
        const context = {
            getHandler: () => undefined,
            getClass: () => undefined,
            switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['TECHNICAL_OFFICER'], permissions: [] } }) }),
        } as unknown as ExecutionContext;

        await expect(new PermissonGuard(reflector).canActivate(context)).rejects.toThrow(ForbiddenException);
    });
});
