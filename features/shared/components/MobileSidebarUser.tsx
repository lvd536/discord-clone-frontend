import { User } from '@backend/types/__generated__/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IProps {
    user: User;
}

export default function MobileSidebarUser({ user }: IProps) {
    const userInitials = (name: string) => name.slice(0, 2).toUpperCase();

    return (
        <div className="flex h-13 shrink-0 items-center justify-between bg-[#232428] px-2 py-1.5">
            <div className="flex max-w-40 cursor-pointer items-center gap-2 rounded p-1 hover:bg-[#35363c]/40">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl ?? ''} />
                    <AvatarFallback>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">
                            {userInitials(user.displayName ?? user.email)}
                        </div>
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-xs font-bold text-[#f2f3f5]">
                        {user.displayName ?? user.email.slice(0, 5)}
                    </span>
                </div>
            </div>
        </div>
    );
}
