'use state';

import { useState } from 'react';

import { ConversationType } from '@backend/types/__generated__/enums';
import { EllipsisVertical } from 'lucide-react';
import { toast } from 'sonner';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { leaveFromGroup } from '../actions';
import { ConversationDeleteAlert } from './ConversationDeleteAlert';
import EditGroupModal from './EditGroupModal';

interface IProps {
    conversationName: string;
    conversationId: string;
    channelType: ConversationType;
    isOwner: boolean;
}

export default function GroupActions({
    conversationName,
    conversationId,
    channelType,
    isOwner,
}: IProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    const handleLeave = async () => {
        try {
            const response = await leaveFromGroup(conversationId);

            if (response.success) {
                toast.success('Вы успешно вышли с группы');
            } else throw new Error(response.error);
        } catch (err) {
            if (err instanceof Error) {
                toast.error('Ошибка при выходе с группы', { description: err.message });
            }
        }
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical size={16} className="focus:outline-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Настройки чата</DropdownMenuLabel>
                        {channelType === 'GROUP' ? (
                            <>
                                {isOwner ? (
                                    <>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            Изменить
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
                                    </>
                                ) : (
                                    <DropdownMenuItem variant="destructive" onClick={handleLeave}>
                                        Выйти
                                    </DropdownMenuItem>
                                )}
                            </>
                        ) : (
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsDeleteModalOpen(true);
                                }}
                            >
                                Удалить
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditGroupModal
                conversationId={conversationId}
                open={isEditModalOpen}
                onOpenChange={(state) => setIsEditModalOpen(state)}
            />
            <ConversationDeleteAlert
                conversationId={conversationId}
                conversationName={conversationName}
                open={isDeleteModalOpen}
                onOpenChange={(state) => setIsDeleteModalOpen(state)}
            />
        </>
    );
}
