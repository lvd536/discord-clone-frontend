'use server';

import { revalidatePath } from 'next/cache';

import { api } from '@/lib/api/api';
import { createSafeAction } from '@/lib/create-safe-action';

import { RoleType } from './types/role.types';

export const grantMemberRoles = createSafeAction(
    async ({
        memberId,
        serverId,
        roleIds,
    }: {
        memberId: string;
        serverId: string;
        roleIds: string[];
    }) => {
        const response = await api.post(`/servers/${serverId}/members/${memberId}/roles`, {
            roleIds,
        });
        revalidatePath(`dashboard/server/[serverId]/settings`);
        return response.data;
    },
);

export const revokeMemberRole = createSafeAction(
    async ({
        memberId,
        roleId,
        serverId,
    }: {
        memberId: string;
        roleId: string;
        serverId: string;
    }) => {
        const response = await api.delete(
            `/servers/${serverId}/members/${memberId}/roles/${roleId}`,
        );
        revalidatePath(`dashboard/server/[serverId]/settings`);
        return response.data;
    },
);

export const kickMember = createSafeAction(
    async ({ memberId, serverId }: { memberId: string; serverId: string }) => {
        const response = await api.delete(`/servers/${serverId}/members/${memberId}`);
        revalidatePath(`dashboard/server/[serverId]/settings`);
        return response.data;
    },
);

export const getServerRoles = createSafeAction(async (serverId: string) => {
    const response = await api.get(`/servers/${serverId}/roles`);

    return response.data;
});

export const createServerRole = createSafeAction(
    async ({ serverId, role }: { serverId: string; role: RoleType }) => {
        const response = await api.post(`/servers/${serverId}/roles`, role);
        revalidatePath(`dashboard/server/[serverId]/settings`);
        return response.data;
    },
);

export const updateServerRole = createSafeAction(
    async ({ serverId, roleId, role }: { serverId: string; roleId: string; role: RoleType }) => {
        const response = await api.patch(`/servers/${serverId}/roles/${roleId}`, role);
        revalidatePath(`dashboard/server/[serverId]/settings`);
        return response.data;
    },
);

export const deleteServerRole = createSafeAction(
    async ({ serverId, roleId }: { serverId: string; roleId: string }) => {
        const response = await api.delete(`/servers/${serverId}/roles/${roleId}`);
        revalidatePath(`dashboard/server/[serverId]/settings`);
        return response.data;
    },
);
