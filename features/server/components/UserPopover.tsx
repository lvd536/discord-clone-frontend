import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ServerMemberType } from '@/features/shared/types/channel.types';

interface UserPopoverProps {
    member: ServerMemberType;
    nameStyle: {
        color: string;
    };
}

export function UserPopover({ member, nameStyle }: UserPopoverProps) {
    return (
        <Popover>
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
                                    {member.user.displayName.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31] bg-[#23a55a]" />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                            <span
                                style={nameStyle}
                                className="truncate text-[14px] font-medium transition-colors group-hover:text-white"
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
                className="w-72 overflow-hidden rounded-xl border-zinc-800 bg-zinc-900 p-0 text-zinc-100 shadow-2xl"
            >
                <div className="h-16 w-full" style={{ backgroundColor: '#5865F2' }} />

                <div className="relative bottom-9 h-6 px-4">
                    <Avatar className="h-20 w-20 rounded-full border-[6px] border-zinc-900 ring-0">
                        <AvatarImage src={member.user.avatarUrl} />
                        <AvatarFallback className="bg-zinc-700 text-xl">
                            {member.user.displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex flex-col gap-3 bg-zinc-900 p-4 pt-6">
                    <div>
                        <h3 className="text-lg leading-tight font-bold">
                            {member.user.displayName}
                        </h3>
                        <span className="text-xs text-zinc-400">{member.user.id}</span>
                    </div>

                    <div className="my-1 h-px w-full bg-zinc-800" />

                    <div>
                        <h4 className="mb-2 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                            Роли ({member.roles.length})
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {member.roles.map((role, index) => (
                                <div
                                    key={index}
                                    className="flex max-w-full items-center gap-1.5 rounded bg-zinc-800 px-2 py-1 text-[11px] font-medium"
                                >
                                    <span
                                        className="h-3 w-3 shrink-0 rounded-full"
                                        style={{ backgroundColor: role.color }}
                                    />
                                    <span className="truncate text-zinc-200">{role.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
