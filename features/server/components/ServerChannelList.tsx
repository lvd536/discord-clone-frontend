'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Hash, Trash, Voicemail } from 'lucide-react';

import { ROUTES } from '@/features/shared/constants/route.constants';
import { ChannelResponse } from '@/features/shared/types/channel.types';

import ChannelDeleteAlert from './ChannelDeleteAlert';

interface ServerChannelListProps {
    serverId: string;
    channels: ChannelResponse[];
}

export default function ServerChannelList({ serverId, channels }: ServerChannelListProps) {
    const pathname = usePathname();
    const [channelToDelete, setChannelToDelete] = useState<ChannelResponse | null>(null);

    return (
        <>
            <ul className="discord-scroll space-y-0.5">
                {channels.map((cn) => {
                    const channelUrl = ROUTES.DASHBOARD.SERVER.CHANNEL(serverId, cn.id);
                    const isActive = pathname === channelUrl;
                    const isProtected = cn.name === 'general';

                    return (
                        <li key={cn.id}>
                            <Link
                                href={channelUrl}
                                className={`group flex items-center justify-between rounded px-2 py-1.5 transition-colors ${
                                    isActive
                                        ? 'bg-[#35363c] text-white'
                                        : 'text-[#949ba4] hover:bg-[#35363c]/60 hover:text-[#dbdee1]'
                                }`}
                            >
                                <div className="flex min-w-0 items-center gap-1.5">
                                    {cn.type === 'TEXT' ? (
                                        <Hash
                                            className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-[#80848e] group-hover:text-[#dbdee1]'}`}
                                        />
                                    ) : (
                                        <Voicemail
                                            className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-[#80848e] group-hover:text-[#dbdee1]'}`}
                                        />
                                    )}
                                    <span className="truncate text-sm font-medium">{cn.name}</span>
                                </div>

                                {!isProtected && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setChannelToDelete(cn);
                                        }}
                                        className="cursor-pointer rounded p-0.5 text-[#dbdee1] opacity-0 transition-[color,opacity] group-hover:opacity-100 hover:text-red-400"
                                        title="Удалить канал"
                                    >
                                        <Trash size={14} />
                                    </button>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {channelToDelete && (
                <ChannelDeleteAlert
                    open={Boolean(channelToDelete)}
                    onOpenChange={(open) => {
                        if (!open) setChannelToDelete(null);
                    }}
                    serverId={serverId}
                    channelId={channelToDelete.id}
                    channelName={channelToDelete.name}
                />
            )}
        </>
    );
}
