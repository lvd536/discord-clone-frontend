'use client';

import { Hash, Users } from 'lucide-react';

interface ChatAreaHeaderProps {
    channelName: string;
    onToggleMembers: () => void;
}

export default function ChatAreaHeader({ channelName, onToggleMembers }: ChatAreaHeaderProps) {
    return (
        <div className="z-10 flex h-12 min-h-12 w-full shrink-0 items-center justify-between border-b border-black/20 bg-[#313338] px-4 shadow-[0_1px_2px_rgba(0,0,0,0.2)] select-none">
            <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-[#80848e]" />
                <span className="font-bold text-[#f2f3f5]">{channelName}</span>
            </div>

            <button
                className="cursor-pointer rounded p-1.5 text-[#b5bac1] transition-colors hover:bg-[#35363c]/60 hover:text-[#dbdee1] md:hidden"
                onClick={onToggleMembers}
                title="Участники"
            >
                <Users size={20} />
            </button>
        </div>
    );
}
