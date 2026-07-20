import { Account, User } from '@backend/types/__generated__/client';
import { create } from 'zustand';

import { getAccounts, refetchUserData } from '../actions';

interface AuthState {
    profile: User | null;
    accounts: Account[];
}

interface AuthActions {
    initUser: (user: User) => Promise<void>;
    refetchUser: () => Promise<void>;
    clearUser: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState = { profile: null, accounts: [] };

export const useAuthStore = create<AuthStore>((set) => ({
    ...initialState,

    initUser: async (user) => {
        const response = await getAccounts();

        if (response.success && response.data) {
            set({ profile: user, accounts: response.data });
        }
    },

    refetchUser: async () => {
        const response = await refetchUserData();

        if (response.success && response.data) {
            set({
                profile: response.data.profile,
                accounts: response.data.accounts,
            });
        }
    },

    clearUser: () => set(initialState),
}));
