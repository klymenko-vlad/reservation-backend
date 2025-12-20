import { permissions, rolePermissions, roles } from '../schema/roles.schema';
import { db } from '../database';

export async function seedRbac() {
  const roleNames = ['USER', 'HOST'];

  for (const name of roleNames) {
    await db.insert(roles).values({ name }).onConflictDoNothing();
  }

  const permissionList = [
    { resource: 'property', action: 'create' },
    { resource: 'property', action: 'update' },
    { resource: 'property', action: 'read' },
    { resource: 'property', action: 'delete' },

    { resource: 'reservation', action: 'create' },
    { resource: 'reservation', action: 'read' },
    { resource: 'reservation', action: 'update' },
    { resource: 'reservation', action: 'delete' },
  ];

  for (const permission of permissionList) {
    await db.insert(permissions).values(permission).onConflictDoNothing();
  }

  const allRoles = await db.select().from(roles);
  const allPermissions = await db.select().from(permissions);

  const roleMap = Object.fromEntries(allRoles.map((r) => [r.name, r.id]));

  const permissionMap = Object.fromEntries(
    allPermissions.map((p) => [`${p.resource}:${p.action}`, p.id]),
  );

  const rolePermissionMatrix: Record<string, string[]> = {
    USER: [
      'property:read',
      'reservation:create',
      'reservation:read',
      'reservation:update',
      'reservation:delete',
    ],
    HOST: [
      'property:create',
      'property:update',
      'property:read',
      'property:delete',
      'reservation:read',
    ],
  };

  for (const [roleName, perms] of Object.entries(rolePermissionMatrix)) {
    for (const perm of perms) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: roleMap[roleName],
          permissionId: permissionMap[perm],
        })
        .onConflictDoNothing();
    }
  }

  console.log('✅ RBAC seeded');
}
