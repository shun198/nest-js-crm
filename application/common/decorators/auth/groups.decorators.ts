import { SetMetadata } from '@nestjs/common';
import { Group } from './groups.enum';

export const GROUPSS_KEY = 'groups';
export const Groups = (...groups: Group[]) => SetMetadata(GROUPSS_KEY, groups);
