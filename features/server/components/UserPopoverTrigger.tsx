'use client';

import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';

interface UserPopoverTriggerProps extends React.ComponentProps<'div'> {
    displayName: string;
    avatarUrl?: string | null;
    isOnline: boolean;
    nameStyle: {
        color: string;
    };
}

export const UserPopoverTrigger = React.forwardRef<HTMLDivElement, UserPopoverTriggerProps>(
    ({ displayName, avatarUrl, isOnline, nameStyle, className, ...props }, ref) => {
        const initials = displayName.substring(0, 2).toUpperCase();

        return (
            <div
                ref={ref}
                {...props}
                className={cn(
                    'group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-[#35363c]/60 active:bg-[#3b3d44]',
                    className,
                )}
            >
                <div className="relative h-8 w-8 shrink-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl ?? ''} className="object-cover" />
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
                        {displayName}
                    </span>
                </div>
            </div>
        );
    },
);

UserPopoverTrigger.displayName = 'UserPopoverTrigger';
export default UserPopoverTrigger;
