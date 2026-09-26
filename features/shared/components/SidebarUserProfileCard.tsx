'use client';

import { useState } from 'react';

import Link from 'next/link';

import { User } from '@backend/types/__generated__/client';
import { Check, Copy, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ROUTES } from '@/features/shared/constants/route.constants';

interface SidebarUserProfileCardProps {
    user: User;
    initials: string;
}

export default function SidebarUserProfileCard({ user, initials }: SidebarUserProfileCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyId = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(user.id);
        setCopied(true);
        toast.success('Ваш ID скопирован в буфер обмена!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="select-none">
            <div className="h-20 w-full bg-[#5865f2]" />

            <div className="relative px-4 pb-2">
                <div className="absolute -top-10 left-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20 rounded-full border-[6px] border-[#111214] bg-[#1e1f22] object-cover">
                            <AvatarImage src={user.avatarUrl ?? ''} className="object-cover" />
                            <AvatarFallback className="bg-[#5865f2] text-xl font-bold text-white uppercase">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute right-0 bottom-0.5 h-5 w-5 rounded-full border-[3.5px] border-[#111214] bg-[#23a55a]" />
                    </div>
                </div>

                <div className="flex justify-end pt-3">
                    <Link
                        href={ROUTES.PROFILE}
                        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-[#2b2d31] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#35363c]"
                    >
                        <Settings className="h-3.5 w-3.5 text-[#b5bac1]" />
                        <span>Профиль</span>
                    </Link>
                </div>
            </div>

            <div className="px-4 pt-2 pb-4">
                <div className="space-y-3 rounded-xl border border-[#2b2d31]/50 bg-[#1e1f22] p-3.5">
                    <div>
                        <h3 className="text-base leading-tight font-bold text-[#f2f3f5]">
                            {user.displayName}
                        </h3>
                        <span className="mt-0.5 block text-xs font-medium text-[#949ba4]">
                            {user.email}
                        </span>
                    </div>

                    <div className="h-px w-full bg-[#2b2d31]" />

                    <div>
                        <span className="mb-1.5 block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                            Ваш User ID (для добавления в друзья)
                        </span>

                        <button
                            type="button"
                            onClick={handleCopyId}
                            className="group/btn flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#2b2d31] bg-[#111214] px-3 py-2 text-left font-mono text-xs text-[#dbdee1] transition-all hover:border-[#5865f2] hover:bg-[#18191c]"
                            title="Нажмите, чтобы скопировать ID"
                        >
                            <span className="truncate pr-2 font-mono text-[11px] text-[#00a8fc] select-all">
                                {user.id}
                            </span>
                            <div className="flex shrink-0 items-center gap-1 text-[#949ba4] group-hover/btn:text-white">
                                {copied ? (
                                    <Check className="h-3.5 w-3.5 text-[#23a55a]" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                                <span className="font-sans text-[10px] font-medium">
                                    {copied ? 'Скопировано!' : 'Копировать'}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
