'use client';

import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ServerMemberType } from '@/features/shared/types/channel.types';

import { useUserPopoverActions } from '../hooks/useUserPopoverActions';
import UserPopoverBody from './UserPopoverBody';
import UserPopoverHeader from './UserPopoverHeader';
import UserPopoverTrigger from './UserPopoverTrigger';

interface UserPopoverProps {
    member: ServerMemberType;
    nameStyle: {
        color: string;
    };
    isOnline: boolean;
}

export function UserPopover({ member, nameStyle, isOnline }: UserPopoverProps) {
    const [open, setOpen] = useState(false);

    const {
        isChatLoading,
        copied,
        requestSent,
        handleStartDirectChat,
        handleAddFriend,
        handleCopyId,
    } = useUserPopoverActions(member.user, () => setOpen(false));

    const primaryRoleColor = member.roles?.[0]?.color;
    const bannerColor =
        primaryRoleColor && primaryRoleColor !== '#fff' ? primaryRoleColor : '#5865f2';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                nativeButton={false}
                render={
                    <UserPopoverTrigger
                        displayName={member.user.displayName}
                        avatarUrl={member.user.avatarUrl}
                        isOnline={isOnline}
                        nameStyle={nameStyle}
                    />
                }
            />

            <PopoverContent
                side="left"
                align="start"
                sideOffset={12}
                className="z-50 w-80 overflow-hidden rounded-2xl border border-[#1f2023]/80 bg-[#111214] p-0 text-[#dbdee1] shadow-2xl select-none"
            >
                <UserPopoverHeader
                    displayName={member.user.displayName}
                    avatarUrl={member.user.avatarUrl}
                    bannerColor={bannerColor}
                    isOnline={isOnline}
                    requestSent={requestSent}
                    isChatLoading={isChatLoading}
                    onAddFriend={handleAddFriend}
                    onStartChat={handleStartDirectChat}
                />

                <UserPopoverBody
                    userId={member.user.id}
                    displayName={member.user.displayName}
                    roles={member.roles}
                    copied={copied}
                    onCopyId={handleCopyId}
                />
            </PopoverContent>
        </Popover>
    );
}
