/**
 * Roles Decorator 
  - This decorator is used to specify which roles are required to access a specific route/controller/method
  - SetMetadata - Allows you to attach metedata to routes, controllers and or methods in NestJS
  - RoleEnum - Possible roles in the application
  - ROLES_KEY - Allows retrieving roles metadata
  - Roles function
   - Custom decorator
   - Takes an array of RoleEnum values arguements. This arrays represents roles allowed to access a particular route.
   - At least pass one role
   - Uses setmetadata to attach the roles to the target route/controller under the key roles
 */

import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/enums/role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: [RoleEnum, ...RoleEnum[]]) =>
  SetMetadata(ROLES_KEY, roles);
