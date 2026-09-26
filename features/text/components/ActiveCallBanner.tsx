'use client';

import { useParticipants } from '@livekit/components-react';

interface ActiveCallBannerProps {
    inCallMode?: boolean;
    onStartCall?: () => void;
}

export default function ActiveCallBanner({ inCallMode, onStartCall }: ActiveCallBannerProps) {
    const participants = useParticipants();

    const otherParticipants = participants.filter((p) => !p.isLocal);
    const isCallActiveInRoom = otherParticipants.some((p) => p.isMicrophoneEnabled);

    if (inCallMode || !isCallActiveInRoom || !onStartCall) return null;

    return (
        <div className="animate-in fade-in slide-in-from-top-2 flex shrink-0 items-center justify-between bg-[#23a55a] px-4 py-2 text-sm text-white select-none">
            <span className="flex items-center gap-2 font-medium">
                <span className="h-2 w-2 animate-ping rounded-full bg-white" />В этом чате запущен
                голосовой звонок!
            </span>
            <button
                onClick={onStartCall}
                className="cursor-pointer rounded bg-white px-3 py-1 text-xs font-bold text-[#23a55a] transition-colors hover:bg-gray-100"
            >
                Присоединиться
            </button>
        </div>
    );
}
