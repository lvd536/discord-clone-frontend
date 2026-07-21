'use client';

import { useState } from 'react';

import { EllipsisVertical } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ServerDeleteAlert } from './ServerDeleteAlert';

interface IProps {
    serverName: string;
    serverId: string;
}

export default function ServerActions({ serverName, serverId }: IProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical size={16} className="focus:outline-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Настройки сервера</DropdownMenuLabel>
                        <DropdownMenuItem>Участники</DropdownMenuItem>
                        <DropdownMenuItem>Роли</DropdownMenuItem>
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
            <ServerDeleteAlert
                open={isDeleteModalOpen}
                onOpenChange={() => setIsDeleteModalOpen(false)}
                serverName={serverName}
                serverId={serverId}
            />
        </>
    );
}
