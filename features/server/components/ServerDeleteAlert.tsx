'use client';

import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { deleteServer } from '../actions';

interface IProps {
    open: boolean;
    onOpenChange: () => void;
    serverName: string;
    serverId: string;
}

export function ServerDeleteAlert({ open, serverName, serverId, onOpenChange }: IProps) {
    const handleDeleteServer = async () => {
        try {
            const response = await deleteServer(serverId);

            if (response.success) {
                toast.success('Сервер успешно удален');
            } else {
                toast.error(response.error);
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error('Ошибка при удалении сервера', {
                    description: err.message,
                });
            } else {
                toast.error(
                    'Произошла непредвиденная ошибка при удалении сервера. Пожалуйста, попробуйте снова или обратитесь в поддержку',
                );
            }
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Вы уверены что хотите удалить сервер {serverName}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Это действие не может быть отменено. Все сервера удаляются полностью и
                        безвозвратно
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteServer}>Подтвердить</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
