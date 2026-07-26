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
} from '@/components/ui/alert-dialog';

import { deleteConversation } from '../actions';

interface IProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    conversationName: string;
    conversationId: string;
}

export function ConversationDeleteAlert({
    open,
    conversationName,
    conversationId,
    onOpenChange,
}: IProps) {
    const handleDeleteConversation = async () => {
        try {
            const response = await deleteConversation(conversationId);

            if (response.success) {
                toast.success('Чат успешно удален');
            } else {
                toast.error(response.error);
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error('Ошибка при удалении чата', {
                    description: err.message,
                });
            } else {
                toast.error(
                    'Произошла непредвиденная ошибка при удалении чата. Пожалуйста, попробуйте снова или обратитесь в поддержку',
                );
            }
        } finally {
            onOpenChange(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Вы уверены что хотите удалить чат {conversationName}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Это действие не может быть отменено. Все чаты удаляются полностью и
                        безвозвратно
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConversation}>
                        Подтвердить
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
