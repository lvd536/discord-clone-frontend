'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { getOrCreateDM } from '@/features/direct-chat/actions';
import { ServerMemberType } from '@/features/shared/types/channel.types';

interface UserPopoverProps {
    member: ServerMemberType;
    nameStyle: {
        color: string;
    };
    isOnline: boolean;
}

export function UserPopover({ member, nameStyle, isOnline }: UserPopoverProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const primaryRoleColor = member.roles?.[0]?.color;
    const bannerColor =
        primaryRoleColor && primaryRoleColor !== '#fff' ? primaryRoleColor : '#5865f2';

    const handleStartDirectChat = async () => {
        setLoading(true);
        try {
            const res = await getOrCreateDM(member.user.id);
            if (res.success && res.data) {
                setOpen(false);
                router.push(`/dashboard/@me/${res.data.id}`);
            }
        } catch (err) {
            if (err instanceof Error) toast.error(err.message || 'Не удалось открыть диалог');
        } finally {
            setLoading(false);
        }
    };

    const initials = member.user.displayName.substring(0, 2).toUpperCase();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                nativeButton={false}
                render={
                    <div className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-[#35363c]/60 active:bg-[#3b3d44]">
                        <div className="relative h-8 w-8 shrink-0">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={member.user.avatarUrl ?? ''}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-[#5865f2] text-xs font-bold text-white uppercase">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div
                                className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31] transition-colors ${
                                    isOnline ? 'bg-[#23a55a]' : 'bg-[#80848e]'
                                }`}
                            />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                            <span
                                style={nameStyle}
                                className={`truncate text-[14px] font-medium transition-all group-hover:text-white ${
                                    !isOnline ? 'opacity-70 group-hover:opacity-100' : ''
                                }`}
                            >
                                {member.user.displayName}
                            </span>
                        </div>
                    </div>
                }
            />

            <PopoverContent
                side="left"
                align="start"
                sideOffset={12}
                className="z-50 w-80 overflow-hidden rounded-2xl border border-[#1f2023]/80 bg-[#111214] p-0 text-[#dbdee1] shadow-2xl select-none"
            >
                <div
                    className="relative h-16 w-full transition-colors duration-300"
                    style={{ backgroundColor: bannerColor }}
                />

                <div className="relative bottom-8 flex h-8 items-end justify-between px-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20 rounded-full border-[6px] border-[#111214] bg-[#1e1f22] object-cover">
                            <AvatarImage
                                src={member.user.avatarUrl ?? ''}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-[#5865f2] text-xl font-bold text-white uppercase">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div
                            className={`absolute right-0.5 bottom-1 h-5 w-5 rounded-full border-[3.5px] border-[#111214] ${
                                isOnline ? 'bg-[#23a55a]' : 'bg-[#80848e]'
                            }`}
                            title={isOnline ? 'В сети' : 'Не в сети'}
                        />
                    </div>

                    <button
                        onClick={handleStartDirectChat}
                        disabled={loading}
                        className="mb-1 flex cursor-pointer items-center gap-1.5 rounded-md bg-[#2b2d31] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#35363c] disabled:opacity-50"
                        title="Написать сообщение"
                    >
                        <MessageSquare className="h-3.5 w-3.5 text-[#b5bac1]" />
                        <span>Чат</span>
                    </button>
                </div>

                <div className="space-y-4 bg-[#111214] p-4 pt-6">
                    <div className="space-y-3 rounded-xl border border-[#2b2d31]/50 bg-[#1e1f22] p-3">
                        <div>
                            <h3 className="text-base leading-tight font-bold text-[#f2f3f5]">
                                {member.user.displayName}
                            </h3>
                            <span className="text-xs font-medium text-[#949ba4]">
                                {member.user.email}
                            </span>
                        </div>

                        <div className="h-px w-full bg-[#2b2d31]" />

                        <div>
                            <h4 className="mb-2 text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                                Роли ({member.roles?.length ?? 0})
                            </h4>

                            <div className="discord-scroll flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pr-1">
                                {member.roles && member.roles.length > 0 ? (
                                    member.roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="flex max-w-full items-center gap-1.5 rounded bg-[#2b2d31] px-2 py-1 text-[11px] font-medium"
                                        >
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{ backgroundColor: role.color }}
                                            />
                                            <span className="truncate text-[#dbdee1]">
                                                {role.name}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-xs text-[#949ba4] italic">Нет ролей</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
