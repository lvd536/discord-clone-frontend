import { create } from 'zustand';

interface IVoiceState {
    activeChannelId: string | null;
    activeChannelName: string | null;
    serverId: string | null;
    token: string | null;
    isConnected: boolean;
}

interface IVoiceActions {
    connect: (params: {
        channelId: string;
        channelName: string;
        token: string;
        serverId?: string;
    }) => void;
    disconnect: () => void;
}

type VoiceStoreType = IVoiceState & IVoiceActions;

const initialState = {
    activeChannelId: null,
    activeChannelName: null,
    serverId: null,
    token: null,
    isConnected: false,
};

export const useVoiceStore = create<VoiceStoreType>((set) => ({
    ...initialState,
    connect: ({ channelId, channelName, token, serverId }) => {
        set({
            activeChannelId: channelId,
            activeChannelName: channelName,
            token,
            serverId,
            isConnected: true,
        });
    },
    disconnect: () => set({ ...initialState }),
}));
