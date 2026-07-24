'use client';

import { useState } from 'react';

import Link from 'next/link';

import { EllipsisVertical } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ROUTES } from '@/constants/route.constants';
import { ServerInfoResponse } from '@/features/shared/types/channel.types';

import { ServerDeleteAlert } from './ServerDeleteAlert';
import ServerEditModal from './ServerEditModal';
import ServerInviteCodeDialog from './ServerInviteCodeDialog';

interface IProps {
    serverInfo: ServerInfoResponse;
}

export default function ServerActions({ serverInfo }: IProps) {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical size={16} className="focus:outline-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Настройки сервера</DropdownMenuLabel>
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
                            Пригласить
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={ROUTES.DASHBOARD.SERVER.SETTINGS.SERVER(serverInfo.id)}>
                                Настройки
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            Удалить
                        </DropdownMenuItem>
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
        </>
    );
}
