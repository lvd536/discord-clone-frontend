'use client';

import { LogOut } from 'lucide-react';

interface VoicePanelProps {
    channelName: string;
    isConnected: boolean;
    onLeave: () => void;
}

export function VoicePanel({ channelName, isConnected, onLeave }: VoicePanelProps) {
    if (!isConnected) return null;
    return (
        <div className="flex items-center justify-between border-b border-[#1f2023]/60 bg-[#232428] p-2.5">
            <div className="flex flex-col">
                <span className="flex items-center gap-1 text-xs font-bold text-[#23a55a]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#23a55a]"></span>
                    Голос подключен
                </span>
                <span className="max-w-35 truncate text-[10px] text-[#949ba4]">
                    {channelName || 'Lobby'}
                </span>
            </div>
            <button
                onClick={onLeave}
                className="cursor-pointer rounded p-1 text-[#f23f43] transition-colors hover:bg-[#35363c]"
            >
                <LogOut className="h-4 w-4" />
            </button>
        </div>
    );
}
