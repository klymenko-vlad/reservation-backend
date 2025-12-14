import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { DatabaseService } from '../../database/database.service';
import { eq } from 'drizzle-orm';
import {
  permissions,
  rolePermissions,
  userRoles,
} from '../../database/schema/roles.schema';
import { Request } from 'express';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly database: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: unknown }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthenticated');
    }

    const getUserId = (u: unknown): string | undefined => {
      if (typeof u !== 'object' || u === null) return undefined;
      const record = u as Record<string, unknown>;
      const candidate = record['id'] ?? record['userId'] ?? record['sub'];
      return typeof candidate === 'string' ? candidate : undefined;
    };

    const userId = getUserId(user);

    if (!userId) {
      console.error(
        'RbacGuard: authenticated user has no id field',
        JSON.stringify(user),
      );
      throw new ForbiddenException('Unauthenticated');
    }

    const rows = await this.database.db
      .select({
        action: permissions.action,
        resource: permissions.resource,
      })
      .from(userRoles)
      .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(userRoles.userId, userId));

    const permissionSet = new Set(rows.map((p) => `${p.resource}:${p.action}`));

    const allowed = requiredPermissions.every((p) => permissionSet.has(p));

    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
