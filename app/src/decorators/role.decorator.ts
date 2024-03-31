import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';

export enum Role {
  ADMIN = 'ADMIN',
}

export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);
