'use server';

import { Account, User } from '@backend/types/__generated__/client';

import { api } from '@/lib/api/api';
import { createSafeAction } from '@/lib/create-safe-action';

import { LoginFormDataType, RegisterFormDataType } from './types/auth.types';

export async function login(data: LoginFormDataType) {
    const response = await api.post('/auth/login', data);
    return response.data;
}

export async function register(data: RegisterFormDataType) {
    const response = await api.post('/auth/register', data);
    return response.data;
}

export const getProfile = createSafeAction(async () => {
    const response = await api.get('users/profile');
    return response.data as User;
});

export const getAccounts = createSafeAction(async () => {
    const response = await api.get('users/accounts');
    return (response.data as Account[]) ?? [];
});

export const refetchUserData = createSafeAction(async () => {
    const [profileRes, accountsRes] = await Promise.all([getProfile(), getAccounts()]);

    if (!profileRes.success) throw new Error(profileRes.error);
    if (!accountsRes.success) throw new Error(accountsRes.error);

    return {
        profile: profileRes.data,
        accounts: accountsRes.data,
    };
});
