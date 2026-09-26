'use client';

import { useState } from 'react';

import Link from 'next/link';

import { EllipsisVertical, LogOut, Trash2 } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/features/shared/constants/route.constants';
import { ServerInfoResponse } from '@/features/shared/types/channel.types';

import { ServerDeleteAlert } from './ServerDeleteAlert';
import ServerEditModal from './ServerEditModal';
import ServerInviteCodeDialog from './ServerInviteCodeDialog';
import ServerLeaveAlert from './ServerLeaveAlert';

interface IProps {
    serverInfo: ServerInfoResponse;
}

export default function ServerActions({ serverInfo }: IProps) {
    const profile = useAuthStore((s) => s.profile);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

    const isOwner = profile?.id === serverInfo.ownerId;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <button className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[#b5bac1] transition-colors hover:bg-[#35363c]/60 hover:text-white">
                            <EllipsisVertical size={16} />
                        </button>
                    }
                />

                <DropdownMenuContent className="w-52" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs text-[#949ba4]">
                            Настройки сервера
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                setIsEditModalOpen(true);
                            }}
                        >
                            Изменить
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                setIsInviteModalOpen(true);
                            }}
                        >
                            Пригласить людей
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            render={
                                <Link href={ROUTES.DASHBOARD.SERVER.SETTINGS.SERVER(serverInfo.id)}>
                                    Настройки сервера
                                </Link>
                            }
                        />

                        <DropdownMenuSeparator />

                        {isOwner ? (
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsDeleteModalOpen(true);
                                }}
                                className="cursor-pointer text-[#da373c] focus:bg-[#da373c]/10 focus:text-[#da373c]"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Удалить сервер</span>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsLeaveModalOpen(true);
                                }}
                                className="cursor-pointer text-[#da373c] focus:bg-[#da373c]/10 focus:text-[#da373c]"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Покинуть сервер</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <ServerEditModal
                open={isEditModalOpen}
                onOpenChange={() => setIsEditModalOpen(false)}
                serverId={serverInfo.id}
                serverName={serverInfo.name}
                serverAvatar={serverInfo.imageUrl ?? undefined}
            />

            <ServerDeleteAlert
                open={isDeleteModalOpen}
                onOpenChange={() => setIsDeleteModalOpen(false)}
                serverName={serverInfo.name}
                serverId={serverInfo.id}
            />

            <ServerInviteCodeDialog
                open={isInviteModalOpen}
                onOpenChange={(state) => setIsInviteModalOpen(state)}
                inviteCode={serverInfo.inviteCode}
            />

            <ServerLeaveAlert
                open={isLeaveModalOpen}
                onOpenChange={setIsLeaveModalOpen}
                serverId={serverInfo.id}
                serverName={serverInfo.name}
            />
        </>
    );
}
