import { RolePermissions } from '@backend/types/__generated__/enums';

export type RoleType = {
    name: string;
    color: string;
    permissions: RolePermissions[];
};
